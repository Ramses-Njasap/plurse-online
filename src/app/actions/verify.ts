"use server";

import { createClient } from "@supabase/supabase-js";
import { createPersistentSession } from "@/app/utils/auth";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verifyOtpAction(email: string, typedCode: string) {
    try {
        // 1. Grab matching record profile parameters
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, otp, otp_expires_at, phone, is_business, is_individual")
            .eq("email", email.trim().toLowerCase())
            .maybeSingle();

        if (fetchError || !user) {
            return { success: false, message: "Verification profile mapping missing." };
        }

        // 2. Validate Code Accuracy and 1-Hour Time Window
        if (user.otp !== typedCode.trim()) {
            return { success: false, message: "The verification code entered is incorrect." };
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return { success: false, message: "This verification token has expired." };
        }

        // 3. Unlock User inside the database
        const { error: unlockError } = await supabaseAdmin
            .from("users")
            .update({
                is_active: true,
                email_verified: true,
                otp: null, // Clear token slot to prevent subsequent attacks
                otp_expires_at: null,
                updated_on: new Date().toISOString()
            })
            .eq("id", user.id);

        if (unlockError) throw unlockError;

        // 4. Provision the 1-Week Persistent Session Cookie
        // We store all structural strings right inside the token itself
        await createPersistentSession({
            id: user.id,
            email: email.trim().toLowerCase(),
            phone: user.phone,
            accountType: user.is_business ? "business" : "individual",
            isActive: true
        });

        return { success: true, message: "Account verified successfully." };

    } catch (error) {
        console.error("Verification Handshake Exception:", error);
        return { success: false, message: "System verification failure occurred." };
    }
}