"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verifyForgotPasswordOtpAction(email: string, typedCode: string) {
    try {
        // 1. Grab matching record profile parameters
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, otp, otp_expires_at")
            .eq("email", email.trim().toLowerCase())
            .maybeSingle();

        if (fetchError || !user) {
            return { success: false, message: "Verification profile mapping missing." };
        }

        // 2. Validate Code Accuracy and Time Window
        if (!user.otp || user.otp !== typedCode.trim()) {
            return { success: false, message: "The verification code entered is incorrect." };
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return { success: false, message: "This verification token has expired." };
        }

        // We return true here but intentionally DO NOT clear the OTP yet,
        // and DO NOT issue a session cookie. This is strictly identity proofing.
        return { success: true };

    } catch (error) {
        console.error("Forgot Password Verification Exception:", error);
        return { success: false, message: "System verification failure occurred." };
    }
}