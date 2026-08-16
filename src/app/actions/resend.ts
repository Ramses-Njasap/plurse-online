"use server";

import { sendResendOtpEmail } from "@/lib/services/emails/resend-otp";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type ResendResponse = { success: boolean; message: string };

export async function resendOtpAction(email: string): Promise<ResendResponse> {
    const targetEmail = email.trim().toLowerCase();

    try {
        // 1. Fetch user to check current throttling status
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, last_otp_sent_at, is_active")
            .eq("email", targetEmail)
            .maybeSingle();

        if (fetchError || !user) {
            return { success: false, message: "Identity tracking profile missing." };
        }

        if (user.is_active) {
            return { success: false, message: "This account is already verified." };
        }

        // 2. Enforce a Strict 60-Second Server-Side Cooldown Check
        if (user.last_otp_sent_at) {
            const lastSent = new Date(user.last_otp_sent_at).getTime();
            const now = new Date().getTime();
            const secondsPassed = Math.floor((now - lastSent) / 1000);

            if (secondsPassed < 60) {
                return {
                    success: false,
                    message: `Please wait ${60 - secondsPassed} more seconds before requesting a new code.`
                };
            }
        }

        // 3. Generate a fresh, exactly 6-digit numeric string
        const newOtp = crypto.randomInt(100000, 999999).toString();
        const newExpiry = new Date();
        newExpiry.setHours(newExpiry.getHours() + 1); // 1-Hour validity extension

        // 4. Commit values directly onto the user row
        const { error: updateError } = await supabaseAdmin
            .from("users")
            .update({
                otp: newOtp,
                otp_expires_at: newExpiry.toISOString(),
                last_otp_sent_at: new Date().toISOString(),
                updated_on: new Date().toISOString()
            })
            .eq("id", user.id);

        if (updateError) throw updateError;

        // 5. Trigger transactional template delivery asynchronously with automatic retries
        sendResendOtpEmail({
            to: targetEmail,
            otp: newOtp,
        }, 3).catch((emailErr) => {
            console.error(`[RESEND_OTP] Fatal background delivery failure for ${targetEmail}:`, emailErr);
        });

        return { success: true, message: "A fresh verification code has been sent." };

    } catch (error) {
        console.error("Resend Core Action Exception:", error);
        return { success: false, message: "Failed to dispatch a fresh verification code." };
    }
}