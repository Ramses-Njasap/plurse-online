"use server";

import { createClient } from "@supabase/supabase-js";
import { whichUser } from "@/app/utils/auth";
import type { AccessKey, Business } from "@/types/users.types";
import { isTimestampExpired } from "../utils/func";
import { TRIAL_PERIOD_DAYS } from "../utils/constants";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type UpgradeKeyResponse =
    | { success: true; keyId: string }
    | { success: false; message: string };

/**
 * Upgrades a TRIAL access key to LIFETIME.
 *
 * This is called from the client's PaymentModal `onSuccess` callback, so by the time this
 * runs the (mock) payment has already gone through — this just persists that result and
 * clears the trial expiry. `transactionId` is only used for logging/support traceability
 * here; wire it into your real ledger/transactions table if/when that exists.
 *
 * Kept intentionally minimal — no invoice or transaction-row writes, since that schema
 * wasn't specified. Extend this once you have a concrete transactions table to write to.
 */
export async function upgradeAccessKeyToLifetimeAction(
    accessKeyId: string,
    transactionId: string
): Promise<UpgradeKeyResponse> {
    const currentUser = await whichUser.info;
    if (!currentUser) {
        return { success: false, message: "Your session has expired or you are not logged in." };
    }

    try {
        const { data: existingKey, error: fetchError } = await supabaseAdmin
            .from("access_keys")
            .select("id, key_type")
            .eq("id", accessKeyId)
            .maybeSingle();

        if (fetchError) {
            console.error("Error looking up access key before upgrade:", fetchError);
            return { success: false, message: "Failed to verify the access key before upgrading." };
        }

        if (!existingKey) {
            return { success: false, message: "This access key no longer exists." };
        }

        if (existingKey.key_type === "LIFETIME") {
            // Already upgraded (e.g. a duplicate click/replayed success) -- not an error.
            return { success: true, keyId: existingKey.id };
        }

        const { error: updateError } = await supabaseAdmin
            .from("access_keys")
            .update({
                key_type: "LIFETIME",
                expires_at: null,
            })
            .eq("id", accessKeyId);

        if (updateError) {
            console.error("Error upgrading access key to lifetime:", updateError);
            return {
                success: false,
                message: `Payment succeeded, but we couldn't update the key. Contact support with transaction ${transactionId}.`,
            };
        }

        return { success: true, keyId: accessKeyId };
    } catch (err: any) {
        console.error("Unexpected error upgrading access key:", err);
        return { success: false, message: err.message || "An unexpected error occurred while upgrading your key." };
    }
}


export interface FetchKeysResponse {
    success: boolean;
    data?: any[];
    errorType?: "UNAUTHORIZED" | "DATABASE_ERROR";
    error?: string;
}

export async function fetchAuthenticatedAccessKeys(): Promise<FetchKeysResponse> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Grab user profile details from server session matching the business page context
    const currentUser = await whichUser.info;
    if (!currentUser) {
        return {
            success: false,
            errorType: "UNAUTHORIZED",
            error: "Your session has expired or you are not logged in."
        };
    }

    const userId = currentUser.id;

    try {

        // 2. Find if this user is a channel partner
        const { data: partnerData, error: partnerError } = await supabase
            .from("channel_partners")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

        if (partnerError) {
            console.error("Error identifying partner context:", partnerError);
        }

        const partnerId = partnerData?.id || null;

        // 3. Fetch businesses owned by this user
        const { data: ownedBusinesses, error: businessError } = await supabase
            .from("businesses")
            .select("access_key_id")
            .eq("owner_id", userId);

        if (businessError) {
            console.error("Error fetching owned businesses:", businessError);
        }

        const ownedKeyIds = (ownedBusinesses || [])
            .map((b) => b.access_key_id)
            .filter(Boolean);

        // 4. Construct the query
        let query = supabase
            .from("access_keys")
            .select(`
                *,
                business:businesses (
                    id,
                    owner_id,
                    name,
                    country,
                    region_city
                )
            `);

        const orConditions: string[] = [];

        // Condition A: Keys belonging to the partner (from_company is false)
        if (partnerId) {
            orConditions.push(`and(channel_partner_id.eq.${partnerId},from_company.eq.false)`);
        }

        // Condition B: Keys linked to a business owned by the user
        if (ownedKeyIds.length > 0) {
            const formattedIds = ownedKeyIds.map(id => `${id}`).join(",");
            orConditions.push(`id.in.(${formattedIds})`);
        }

        if (orConditions.length > 0) {
            const finalOrQuery = orConditions.join(",");
            query = query.or(finalOrQuery);
        } else {
            return { success: true, data: [] };
        }

        const { data, error } = await query;

        if (error) {
            console.error("Supabase Query Error:", error);
            return { success: false, errorType: "DATABASE_ERROR", error: error.message };
        }

        const formattedKeys = (data || []).map((key: any) => ({
            ...key,
            business: Array.isArray(key.business) ? key.business[0] : key.business || null
        }));

        return { success: true, data: formattedKeys };

    } catch (err: any) {
        console.error("Exception in fetchAuthenticatedAccessKeys:", err);
        return { success: false, errorType: "DATABASE_ERROR", error: err.message };
    }
}


export interface KeyDeleteResult {
    success: boolean;
    id: string;
    message: string;
    errorType?: "UNAUTHORIZED" | "DATABASE_ERROR";
}

/**
 * Validates ownership and deletes an access key if authorized.
 */
export async function deleteAccessKeyAction(keyId: string): Promise<KeyDeleteResult> {
    // 1. Authenticate user session using your established utility
    const currentUser = await whichUser.info;
    if (!currentUser) {
        return {
            success: false,
            id: keyId,
            message: "Your session has expired or you are not logged in.",
            errorType: "UNAUTHORIZED"
        };
    }

    try {
        // 2. Fetch target key metrics
        const { data: keyData, error: fetchError } = await supabaseAdmin
            .from("access_keys")
            .select("id, key_code, channel_partner_id, from_company")
            .eq("id", keyId)
            .single();

        if (fetchError || !keyData) {
            return {
                success: false,
                id: keyId,
                message: "The requested access key could not be found.",
                errorType: "DATABASE_ERROR"
            };
        }

        // 3. Apply your frontend UI constraint rule safely on the server side
        if (keyData.channel_partner_id && keyData.from_company === false) {
            return {
                success: false,
                id: keyId,
                message: "You cannot delete an access key for a business you do not directly own.",
                errorType: "DATABASE_ERROR" // Keeps toast alert style active instead of logging user out
            };
        }

        // 4. Perform the hard deletion
        const { error: deleteError } = await supabaseAdmin
            .from("access_keys")
            .delete()
            .eq("id", keyId);

        if (deleteError) throw deleteError;

        return {
            success: true,
            id: keyId,
            message: `Access key "${keyData.key_code.slice(-4)}" was successfully removed.`
        };

    } catch (error: any) {
        console.error("Database query exception inside deleteAccessKeyAction:", error);
        return {
            success: false,
            id: keyId,
            message: error.message || "An unexpected database transaction error occurred.",
            errorType: "DATABASE_ERROR"
        };
    }
}


/**
 * Iterates through selected access key IDs and runs the deletion action on each.
 */
export async function deleteAccessKeysBulkAction(ids: string[]): Promise<KeyDeleteResult[]> {
    const results: KeyDeleteResult[] = [];
    for (const id of ids) {
        const result = await deleteAccessKeyAction(id);
        results.push(result);
    }
    return results;
}




export interface CreateKeyParams {
    key_code: string;
    key_type: "TRIAL" | "LIFETIME";
    amount: number;
    deduct_trial_fee: boolean;
    payment_gateway_tx_id?: string;
}

export type ActionResponse<T> =
    | { success: true; data: T, message?: string }
    | { success: false; message: string, errorType?: string };

/**
 * Creates a real access key in Supabase upon payment success.
 */
export async function createStandaloneAccessKeyAction(
    params: CreateKeyParams
): Promise<ActionResponse<AccessKey>> {
    const currentUser = await whichUser.info;
    if (!currentUser) {
        return { success: false, message: "Your session has expired or you are not logged in." };
    }

    try {
        // Retrieve partner ID if current user is a channel partner
        const { data: partnerData } = await supabaseAdmin
            .from("channel_partners")
            .select("id")
            .eq("user_id", currentUser.id)
            .maybeSingle();

        const partnerId = partnerData?.id || null;

        if (!partnerId) {
            return { success: false, message: "You are not authorized to create access keys." };
        }

        // Set 7-day trial expiry if TRIAL key
        const expiresAt =
            params.key_type === "TRIAL"
                ? new Date(Date.now() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString()
                : null;

        const { data: newKey, error } = await supabaseAdmin
            .from("access_keys")
            .insert({
                key_code: params.key_code,
                key_type: params.key_type,
                amount: params.amount,
                deduct_trial_fee: params.deduct_trial_fee,
                is_active: true,
                activated_at: new Date().toISOString(),
                expires_at: expiresAt,
                channel_partner_id: partnerId,
                from_company: false,
                is_standalone: true,
            })
            .select(`
                *,
                business:businesses (
                    id,
                    owner_id,
                    name,
                    country,
                    region_city
                )
            `)
            .single();

        if (error) {
            console.error("Database error creating access key:", error);
            return { success: false, message: "Failed to write new access key to database." };
        }

        return { success: true, data: newKey as AccessKey };
    } catch (err: any) {
        console.error("Unexpected exception creating access key:", err);
        return { success: false, message: err.message || "An unexpected database error occurred." };
    }
}


export async function searchBusinessesAction(query: string): Promise<Business[]> {
    if (!query.trim()) return [];

    const currentUser = await whichUser.info;
    if (!currentUser) return [];

    const trimmedQuery = query.trim().toUpperCase();

    // Check if the query matches the PLUR-XXXXXX-BIZ format or just the middle code
    const fullCodeMatch = trimmedQuery.match(/^PLUR-([A-Z0-9]{6})-BIZ$/);
    const middleCodeMatch = trimmedQuery.match(/^([A-Z0-9]{6})$/);

    let searchCode = trimmedQuery;

    if (fullCodeMatch) {
        searchCode = trimmedQuery;
    } else if (middleCodeMatch) {
        searchCode = `PLUR-${middleCodeMatch[1]}-BIZ`;
    } else {
        return [];
    }

    // Exact match on business_code
    const { data, error } = await supabaseAdmin
        .from("businesses")
        .select(`
            *,
            access_key:access_keys(*)
        `)
        .eq('business_code', searchCode)
        .limit(1);

    if (error || !data || data.length === 0) {
        if (error) console.error("Database error querying businesses:", error);
        return [];
    }

    const businessData = data[0];

    const formattedBusiness: Business = {
        ...businessData,
        access_key: businessData.access_key
            ? {
                ...businessData.access_key,
                is_expired: isTimestampExpired(businessData.access_key.expires_at),
            }
            : null,
    };

    return [formattedBusiness];
}

/**
 * Links an existing business to a generated access key and marks it as active.
 * We need to use this rpc function ´provision_key_and_link_existing_business´
 */

export interface LinkBusinessToKeyPayload {
    businessId: string;
    key_code: string;
    key_type: "TRIAL" | "LIFETIME";
    amount: number;
    deduct_trial_fee: boolean;
    payment_gateway_tx_id?: string;
    client_tx_id?: string;
}

export async function linkBusinessToAccessKeyAction(
    payload: LinkBusinessToKeyPayload
): Promise<ActionResponse<Business>> {
    try {
        // 1. Authenticate session
        const currentUser = await whichUser.info;
        if (!currentUser) {
            return {
                success: false,
                message: "Your session has expired.",
                errorType: "UNAUTHORIZED",
            };
        }

        // 2. Validate essential parameters
        if (!payload.businessId) {
            return { success: false, message: "Target business ID is required." };
        }
        if (!payload.key_code) {
            return { success: false, message: "Access key code is required." };
        }

        // 3. Compute transaction IDs & expiry date
        const clientTxId = payload.client_tx_id || `CTX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const gatewayTxId = payload.payment_gateway_tx_id || `GTX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        let calculatedExpiration: string | null = null;
        if (payload.key_type === "TRIAL") {
            const expDate = new Date();
            expDate.setDate(expDate.getDate() + TRIAL_PERIOD_DAYS); // Standard 7-day trial window
            calculatedExpiration = expDate.toISOString();
        }

        // 4. Invoke RPC
        const { data: rpcRes, error: rpcError } = await supabaseAdmin.rpc(
            "provision_key_and_link_existing_business",
            {
                p_client_tx_id: clientTxId,
                p_gateway_tx_id: gatewayTxId,
                p_business_id: payload.businessId,
                p_key_code: payload.key_code,
                p_key_type: payload.key_type,
                p_amount: payload.amount,
                p_deduct_trial_fee: payload.deduct_trial_fee,
                p_calculated_expiration: calculatedExpiration,
                p_operator_user_id: currentUser.id,
                p_payload: payload,
            }
        );

        if (rpcError) {
            console.error("RPC provision_key_and_link_existing_business failed:", rpcError);
            return {
                success: false,
                message: rpcError.message || "Failed to execute business key linking.",
            };
        }

        // 5. Handle RPC return payload evaluation
        if (!rpcRes || rpcRes.success === false) {
            return {
                success: false,
                message: rpcRes?.message || "RPC failed to link key to existing business.",
            };
        }

        // 6. Retrieve the complete, newly linked Business record
        const { data: updatedBusiness, error: fetchError } = await supabaseAdmin
            .from("businesses")
            .select(`
                *,
                access_key:access_keys!access_key_id (
                    id,
                    key_code,
                    key_type,
                    amount,
                    deduct_trial_fee,
                    expires_at,
                    activated_at,
                    created_on,
                    channel_partner_id,
                    channel_partner:channel_partners!channel_partner_id (
                        id,
                        user_id,
                        valid_from,
                        valid_to,
                        amount,
                        profile:user_profiles!user_id (
                            *,
                            user:users!id (*)
                        )
                    )
                )
            `)
            .eq("id", payload.businessId)
            .single();

        if (fetchError || !updatedBusiness) {
            console.error("Failed to fetch updated business record after linking:", fetchError);
            return {
                success: false,
                message: "Key linked successfully, but failed to retrieve updated business details.",
            };
        }

        return {
            success: true,
            data: updatedBusiness as Business,
            message: "Access key linked to business successfully.",
        };
    } catch (error: any) {
        console.error("Unexpected error in linkBusinessToAccessKeyAction:", error);
        return {
            success: false,
            message: error?.message || "An unexpected system error occurred.",
        };
    }
}