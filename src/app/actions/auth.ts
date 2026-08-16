"use server";

import { sendSignupOtpEmail } from "@/lib/services/emails/signup";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type SignupResponse = { success: boolean; message: string };

export async function registerUserAction(formData: {
    accountType: "individual" | "business";
    email: string;
    phone?: string;
    password?: string;
}): Promise<SignupResponse> {
    const { accountType, email, phone, password } = formData;
    const targetEmail = email.trim().toLowerCase();
    const targetPhone = phone?.trim() ? phone.trim() : null;

    if (!password) {
        return { success: false, message: "A password is required to register." };
    }

    try {
        // A. Look up if they already exist in your public data table
        const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, is_active")
            .eq("email", targetEmail)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (existingUser && existingUser.is_active) {
            return { success: false, message: "This email address is already registered." };
        }

        let authUserId: string | null = null;

        // B. Securely delegate credentials over to Supabase Auth using Admin privilege
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
            email: targetEmail,
            password: password,
            email_confirm: true, // Auto-confirms on GoTrue side so standard login works seamlessly
            user_metadata: {
                accountType,
                is_company: accountType === "business",
                is_individual: accountType === "individual"
            }
        });

        if (adminError) {
            // Handle edge case where they were wiped from custom tables but lingered inside GoTrue Auth
            if (adminError.message.includes("already exists")) {
                const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
                if (listError) throw listError;

                const foundUser = listData.users.find(u => u.email?.toLowerCase() === targetEmail);
                if (foundUser) authUserId = foundUser.id;
            } else {
                console.error(`[SIGNUP] Supabase Auth Admin createUser critical error:`, adminError);
                throw adminError;
            }
        } else if (adminData?.user) {
            authUserId = adminData.user.id;
        }

        if (!authUserId) {
            console.error(`[SIGNUP] Failed to establish authorization context for ${targetEmail}`);
            return { success: false, message: "Failed to establish authorization context." };
        }

        // C. Build your custom OTP parameters
        const generatedOtp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // D. Commit the state tracking down to your data rows safely
        if (!existingUser) {
            const { error: insertError } = await supabaseAdmin.from("users").insert({
                id: authUserId, // Bound directly to Supabase Auth ID
                email: targetEmail,
                phone: targetPhone,
                is_business: accountType === "business",
                is_individual: accountType === "individual",
                is_active: false, // Set to true inside your verifyOtp server action later
                email_verified: false,
                phone_verified: false,
                otp: generatedOtp,
                otp_expires_at: expiresAt.toISOString(),
                last_otp_sent_at: new Date().toISOString(),
                created_on: new Date().toISOString()
            });
            if (insertError) throw insertError;
        } else {
            const { error: updateError } = await supabaseAdmin
                .from("users")
                .update({
                    phone: targetPhone,
                    is_business: accountType === "business",
                    is_individual: accountType === "individual",
                    otp: generatedOtp,
                    otp_expires_at: expiresAt.toISOString(),
                    last_otp_sent_at: new Date().toISOString(),
                    updated_on: new Date().toISOString()
                })
                .eq("id", authUserId);
            if (updateError) throw updateError;
        }

        console.log(`[SIGNUP] OTP generated for ${targetEmail}: ${generatedOtp} (expires at ${expiresAt.toISOString()})`);

        // E. Dispatch the OTP verification email asynchronously
        sendSignupOtpEmail({
            to: targetEmail,
            otp: generatedOtp,
        }).catch((emailError) => {
            console.error(`[SIGNUP] Async OTP email dispatch failed for ${targetEmail}:`, emailError);
        });

        return { success: true, message: "Registration initiated. Verification token sent." };

    } catch (error: any) {
        console.error("Signup Critical Exception:", error);
        return { success: false, message: "A backend transaction error occurred." };
    }
}