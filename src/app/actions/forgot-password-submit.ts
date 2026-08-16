"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function forgotPasswordSubmitAction(email: string, typedCode: string, password: string) {
    const targetEmail = email.trim().toLowerCase();

    try {
        // 1. Fetch the user profile and check their current valid OTP state
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, otp, otp_expires_at")
            .eq("email", targetEmail)
            .maybeSingle();

        if (fetchError || !user) {
            return { success: false, message: "Account profile association reference was lost." };
        }

        // 2. FORCE OTP validation right here on the server before touching credentials
        if (!user.otp || user.otp !== typedCode.trim()) {
            return { success: false, message: "Invalid or unauthorized verification token." };
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return { success: false, message: "Your verification token has expired." };
        }

        // 3. Securely overwrite the credential record now that identity is proven
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password: password }
        );

        if (updateError) {
            // return { success: false, message: "Could not overwrite credentials. Try a stronger password." };
            return { success: false, message: updateError.message ?? "Could not overwrite credentials. Try a stronger password." };
        }

        // 4. Clear out the used OTP token immediately so it can never be reused
        await supabaseAdmin
            .from("users")
            .update({
                otp: null,
                otp_expires_at: null,
                updated_on: new Date().toISOString()
            })
            .eq("id", user.id);

        return { success: true };
    } catch (error) {
        console.error("Password Overwrite Handshake Exception:", error);
        return { success: false, message: "Server connection failure during password sync." };
    }
}