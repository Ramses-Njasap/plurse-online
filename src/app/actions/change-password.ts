"use server";

import { createClient } from "@supabase/supabase-js";
import { whichUser } from "@/app/utils/auth";

export type UpdatePasswordPayload = {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

export async function updateAccountPassword(
    payload: UpdatePasswordPayload
): Promise<{ success: boolean; message: string }> {
    const { currentPassword, newPassword, confirmPassword } = payload;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, message: "All password fields are required." };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: "New passwords do not match." };
    }

    if (newPassword.length < 6) {
        return { success: false, message: "Password must be at least 6 characters long." };
    }

    const currentUser = await whichUser.info;
    if (!currentUser || !currentUser.email) {
        return { success: false, message: "Unauthorized." };
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 1. Verify current password by attempting sign-in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: currentUser.email,
            password: currentPassword,
        });

        if (signInError) {
            return { success: false, message: "Incorrect current password." };
        }

        // 2. Update password for authenticated user
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            currentUser.id,
            { password: newPassword }
        );

        if (updateError) throw updateError;

        return { success: true, message: "Password updated successfully." };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to update password." };
    }
}