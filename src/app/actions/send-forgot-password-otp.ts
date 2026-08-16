"use server";

import { sendForgotPasswordOtpEmail } from "@/lib/services/emails/forgot-password";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type ForgotPasswordOtpResponse = { success: boolean; message: string };

export async function sendForgotPasswordOtpAction(email: string): Promise<ForgotPasswordOtpResponse> {
    const targetEmail = email.trim().toLowerCase();

    try {
        // 1. Fetch user and ensure the account exists and is allowed to request a reset
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, last_otp_sent_at, is_active")
            .eq("email", targetEmail)
            .maybeSingle();

        if (fetchError || !user) {
            return { success: false, message: "No account found matching this email address." };
        }

        // Optional check: Ensure the account isn't completely banned/disabled if applicable
        if (!user.is_active) {
            return { success: false, message: "This account is inactive. Please verify your account first." };
        }

        // 2. Enforce your Strict 60-Second Server-Side Cooldown
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

        // 3. Generate a fresh, secure 6-digit code
        const newOtp = crypto.randomInt(100000, 999999).toString();
        const newExpiry = new Date();
        newExpiry.setHours(newExpiry.getHours() + 1); // Valid for 1 hour

        // 4. Update the user row with the reset token state
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

        // 5. Trigger transactional email delivery asynchronously with automatic retries
        sendForgotPasswordOtpEmail({
            to: targetEmail,
            otp: newOtp,
        }, 3).catch((emailErr) => {
            console.error(`[FORGOT_PASSWORD] Fatal background delivery failure for ${targetEmail}:`, emailErr);
        });

        return { success: true, message: "A password reset code has been sent to your email." };

    } catch (error) {
        console.error("Forgot Password OTP Action Exception:", error);
        return { success: false, message: "Failed to dispatch password reset code." };
    }
}
