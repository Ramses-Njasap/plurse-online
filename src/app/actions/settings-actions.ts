"use server";

import { createClient } from "@supabase/supabase-js";
import { whichUser } from "@/app/utils/auth";
import type {
    UserAccount,
    UserProfile,
    ChannelPartner,
} from "@/types/users.types";

import { revalidatePath } from "next/cache";

export type AccountTabData = {
    account: UserAccount;
    profile: UserProfile;
    channelPartner: ChannelPartner | null;
    partnerHistory: ChannelPartner[];
};

export type FetchAccountTabResponse =
    | { success: true; data: AccountTabData }
    | { success: false; errorType: "UNAUTHORIZED" | "NOT_FOUND" | "DATABASE_ERROR"; message: string };

export async function fetchAccountTabData(): Promise<FetchAccountTabResponse> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Authenticate session
    const currentUser = await whichUser.info;
    if (!currentUser) {
        return {
            success: false,
            errorType: "UNAUTHORIZED",
            message: "Your session has expired or you are not logged in.",
        };
    }

    const userId = currentUser.id;

    try {
        // 2. Fetch UserAccount, UserProfile, and ChannelPartners concurrently
        // Note: Explicitly selecting safe non-sensitive columns
        const [accountResult, profileResult, partnerResult] = await Promise.all([
            supabase
                .from("users")
                .select("id, email, phone, is_deleted, is_banned, is_business, is_individual, is_active, email_verified, phone_verified, created_on, updated_on")
                .eq("id", userId)
                .single(),

            supabase
                .from("user_profiles")
                .select("id, full_name, date_of_birth, country, region_city, is_channel_partner, created_on, updated_on")
                .eq("id", userId)
                .single(),

            supabase
                .from("channel_partners")
                .select("id, user_id, valid_from, valid_to, amount")
                .eq("user_id", userId)
                .order("valid_from", { ascending: false })
        ]);

        if (accountResult.error || !accountResult.data) {
            console.error("Error fetching user account:", accountResult.error);
            return {
                success: false,
                errorType: "NOT_FOUND",
                message: "User account record not found.",
            };
        }

        if (profileResult.error || !profileResult.data) {
            console.error("Error fetching user profile:", profileResult.error);
            return {
                success: false,
                errorType: "NOT_FOUND",
                message: "User profile record not found.",
            };
        }

        const rawAccount = accountResult.data;
        const rawProfile = profileResult.data;

        // Map strictly non-sensitive metadata
        const account: UserAccount = {
            id: rawAccount.id,
            email: rawAccount.email,
            phone: rawAccount.phone || "",
            is_deleted: rawAccount.is_deleted ?? false,
            is_banned: rawAccount.is_banned ?? false,
            is_business: rawAccount.is_business ?? false,
            is_individual: rawAccount.is_individual ?? false,
            is_active: rawAccount.is_active ?? true,
            email_verified: rawAccount.email_verified ?? false,
            phone_verified: rawAccount.phone_verified ?? false,
            created_on: rawAccount.created_on,
            updated_on: rawAccount.updated_on,
            my_business: true,
        };

        const profile: UserProfile = {
            id: rawProfile.id,
            user_id: rawProfile.id,
            full_name: rawProfile.full_name ?? "",
            date_of_birth: rawProfile.date_of_birth ?? "",
            country: rawProfile.country ?? "",
            region_city: rawProfile.region_city ?? "",
            is_channel_partner: rawProfile.is_channel_partner ?? false,
            created_on: rawProfile.created_on,
            updated_on: rawProfile.updated_on,
        };

        // 3. Process Channel Partner Records
        const rawPartners = partnerResult.data || [];
        const now = new Date();

        const partnerHistory: ChannelPartner[] = rawPartners.map((cp: any) => ({
            id: cp.id,
            user_id: cp.user_id,
            valid_from: cp.valid_from,
            valid_to: cp.valid_to ?? null,
            amount: cp.amount ?? 0,
            access_key_id: cp.access_key_id ?? null,
            user: account,
            profile: profile,
        }));

        const activePartner = partnerHistory.find((cp) => {
            if (!cp.valid_to) return true;
            return new Date(cp.valid_to) >= now;
        }) || null;

        return {
            success: true,
            data: {
                account,
                profile,
                channelPartner: activePartner,
                partnerHistory,
            },
        };

    } catch (e: any) {
        console.error("Unexpected exception fetching account tab data:", e);
        return {
            success: false,
            errorType: "DATABASE_ERROR",
            message: e.message || "An unexpected database query error occurred.",
        };
    }
}


export type ProfileUpdatePayload = {
    full_name?: string;
    date_of_birth?: string;
    country?: string;
    region_city?: string;
};

export type ContactsUpdatePayload = {
    email?: string;
    phone?: string;
};

// Update user_profiles table with ONLY modified fields
export async function updatePersonalProfile(
    payload: ProfileUpdatePayload
): Promise<{ success: boolean; message: string }> {
    const currentUser = await whichUser.info;
    if (!currentUser) return { success: false, message: "Unauthorized." };

    if (Object.keys(payload).length === 0) {
        return { success: false, message: "No changes detected." };
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { error } = await supabase
            .from("user_profiles")
            .update({
                ...payload,
                updated_on: new Date().toISOString(),
            })
            .eq("id", currentUser.id);

        if (error) throw error;

        revalidatePath("/dashboard/my/settings");
        return { success: true, message: "Profile updated successfully." };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to update profile." };
    }
}

// Update users table with ONLY modified fields
export async function updateContacts(
    payload: ContactsUpdatePayload
): Promise<{ success: boolean; message: string }> {
    const currentUser = await whichUser.info;
    if (!currentUser) return { success: false, message: "Unauthorized." };

    if (Object.keys(payload).length === 0) {
        return { success: false, message: "No changes detected." };
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { error } = await supabase
            .from("users")
            .update({
                ...payload,
                updated_on: new Date().toISOString(),
            })
            .eq("id", currentUser.id);

        if (error) throw error;

        revalidatePath("/dashboard/my/settings");
        return { success: true, message: "Contacts updated successfully." };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to update contacts." };
    }
}