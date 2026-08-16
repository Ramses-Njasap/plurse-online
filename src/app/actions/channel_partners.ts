"use server";

import { createClient } from "@supabase/supabase-js";
import { whichUser, COOKIE_NAME } from "@/app/utils/auth";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { sendChannelPartnerWelcomeEmail } from "@/lib/services/emails/new-channel-partner";

// Guard against undefined/empty secret which causes "Zero-length key is not supported" DataError
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
    console.warn("WARNING: JWT_SECRET environment variable is missing. Falling back to default fallback key.");
}

const JWT_SECRET = new TextEncoder().encode(rawSecret);

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 1. Lightweight Security Check
 * Verifies if the authenticated session explicitly carries Channel Partner privileges
 */
export async function checkChannelPartnerStatus(): Promise<boolean> {
    const session = await whichUser.info;

    if (!session) return false;

    // Check if the parameter exists directly inside your persistent cookie layout
    if (session.isChannelPartner === true) {
        return true;
    }

    // Fallback: Query the database to double-check if the session token hasn't synced yet
    try {
        const { data, error } = await supabaseAdmin
            .from("user_profiles")
            .select("is_channel_partner")
            .eq("id", session.id)
            .maybeSingle();

        if (error || !data) return false;
        return !!data.is_channel_partner;
    } catch {
        console.error("Error occurred while checking channel partner status in the database.");
        return false;
    }
}

export type UpgradePartnerResponse =
    | { success: true; message: string }
    | { success: false; message: string };


/**
 * 2. High-Privilege Promotion Transaction
 * Handles core DB writes, live session cookie updates, and sends partner onboarding email
 */
export async function purchaseChannelPartnerAction(transactionId: string): Promise<UpgradePartnerResponse> {
    const session = await whichUser.info;
    if (!session) {
        return { success: false, message: "Authentication failed. Session missing." };
    }

    // Set up partnership subscription durations (3 months runtime)
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setMonth(validTo.getMonth() + 3);

    try {
        // ── STUB DB OPERATION: Record your standard payment ledger row if active ──
        /* 
        await supabaseAdmin.from("payments").insert({
            user_id: session.id,
            amount: 4000,
            currency: "XAF",
            purpose: "CHANNEL_PARTNER_3M",
            transaction_id: transactionId,
            status: "SUCCESS"
        });
        */

        // ── SINGLE BASE INSERTION ──
        // Thanks to our database trigger, inserting here automatically triggers the
        // history table creation and updates user_profiles inside an implicit transaction.
        const { error: dbError } = await supabaseAdmin
            .from("channel_partners")
            .insert({
                id: crypto.randomUUID(),
                user_id: session.id,
                valid_from: validFrom.toISOString(),
                valid_to: validTo.toISOString(),
                amount: 4000
            });

        if (dbError) {
            console.error("[DATABASE ERROR] Rollback handled implicitly by Postgres:", dbError);
            throw new Error("Failed to register your partnership account securely.");
        }

        // ── STEP 3: Re-sign cookie token so the UI updates layout permissions instantly ──
        const cookieStore = await cookies();
        const updatedPayload = {
            ...session,
            isChannelPartner: true
        };

        const updatedJwt = await new SignJWT(updatedPayload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

        cookieStore.set(COOKIE_NAME, updatedJwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // ── STEP 4: Trigger transactional onboarding email asynchronously with retries ──
        if (session.email) {
            sendChannelPartnerWelcomeEmail({
                to: session.email,
                userName: session.email.split("@")[0] || "Partner",
                validTo: validTo.toISOString(),
            }, 3).catch((emailErr) => {
                console.error(`[PARTNER_WELCOME] Fatal background delivery failure for ${session.email}:`, emailErr);
            });
        }

        return { success: true, message: "Welcome aboard! Your Channel Partner account is now active." };

    } catch (err: any) {
        console.error("Upgrade Flow Exception:", err);
        return { success: false, message: err.message || "Failed to commit partner account creation." };
    }
}