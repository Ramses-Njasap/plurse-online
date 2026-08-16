"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createActionClient } from "@/lib/supabase/server"; // ✅ Import your SSR client
import { createPersistentSession } from "@/app/utils/auth";

// Keep this ONLY for admin-level database operations (bypassing RLS during auto-heal)
const supabaseAdmin = createAdminClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loginAction(payload: { email: string; password: string }) {
    const emailLower = payload.email.trim().toLowerCase();

    // 1. Initialize your official cookie-aware server client
    const supabase = await createActionClient();

    try {
        // 2. Authenticate using the SSR client. 
        // This automatically sets the standard Supabase access & refresh token cookies in the browser!
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailLower,
            password: payload.password,
        });

        if (authError || !authData.user) {
            return { success: false, message: "Invalid email or password credentials." };
        }

        const authUser = authData.user;

        // 3. Fetch profile status tags from your manual mapping table (using admin to bypass RLS)
        let { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, phone, is_active, is_business")
            .eq("id", authUser.id)
            .maybeSingle();

        if (fetchError) throw fetchError;

        // HEALING LAYER A: Provision missing row in "users" table
        if (!user) {
            const metadata = authUser.user_metadata || {};

            const { data: newUser, error: insertError } = await supabaseAdmin
                .from("users")
                .insert({
                    id: authUser.id,
                    email: emailLower,
                    phone: authUser.phone || null,
                    is_business: metadata.is_company === true || metadata.accountType === "business",
                    is_individual: metadata.is_individual === true || metadata.accountType === "individual",
                    is_active: true,
                    email_verified: true,
                    created_on: new Date().toISOString()
                })
                .select("id, phone, is_active, is_business")
                .single();

            if (insertError) {
                console.error("Failed to auto-heal base users row:", insertError);
                throw insertError;
            }
            user = newUser;
        }

        // HEALING LAYER B: Provision missing row in "user_profiles" table
        let { data: profile, error: profileFetchError } = await supabaseAdmin
            .from("user_profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

        if (profileFetchError) throw profileFetchError;

        if (!profile) {
            const metadata = authUser.user_metadata || {};

            const { error: profileInsertError } = await supabaseAdmin
                .from("user_profiles")
                .insert({
                    id: user.id,
                    full_name: metadata.full_name || "Anonymous User",
                    date_of_birth: metadata.date_of_birth || null,
                    country: metadata.country || "",
                    region_city: metadata.region_city || "",
                    is_channel_partner: false,
                    created_on: new Date().toISOString()
                });

            if (profileInsertError) {
                console.error("Failed to auto-heal user_profiles row:", profileInsertError);
                throw profileInsertError;
            }
        }

        // 4. Prevent unverified or suspended users from logging into the dashboard
        if (!user.is_active) {
            // Log them out from the session we just created if they shouldn't access the app
            await supabase.auth.signOut();
            return {
                success: false,
                message: "Your account is not active. Please complete verification first."
            };
        }

        // 5. Provision your custom 1-Week Persistent Cookie layer for custom logic
        await createPersistentSession({
            id: user.id,
            email: emailLower,
            phone: user.phone,
            accountType: user.is_business ? "business" : "individual",
            isActive: true,
        });

        return { success: true, message: "Authentication successful." };

    } catch (error) {
        console.error("Login Handler Exception:", error);
        return { success: false, message: "An unexpected authorization error occurred." };
    }
}
