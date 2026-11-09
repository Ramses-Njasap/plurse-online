"use server";

import { createClient } from "@supabase/supabase-js";
import { whichUser } from "@/app/utils/auth";
import type { Transaction } from "@/types/users.types";

export type FetchTransactionsResponse =
    | { success: true; data: Transaction[] }
    | { success: false; errorType: "UNAUTHORIZED" | "DATABASE_ERROR"; message: string };

export async function fetchAuthenticatedTransactions(): Promise<FetchTransactionsResponse> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const currentUser = await whichUser.info;
    if (!currentUser) {
        return {
            success: false,
            errorType: "UNAUTHORIZED",
            message: "Your session has expired or you are not logged in."
        };
    }

    const userId = currentUser.id;

    try {
        // Step 1: Find businesses owned by the current user so we can include related transactions
        const { data: userBusinesses, error: bizError } = await supabase
            .from("businesses")
            .select("id")
            .eq("owner_id", userId);

        if (bizError) {
            console.error("Error fetching user businesses for transactions:", bizError);
            return { success: false, errorType: "DATABASE_ERROR", message: "Failed to verify user context." };
        }

        const businessIds = (userBusinesses || []).map((b) => b.id).filter(Boolean);

        // Step 2: Query transactions table with joined business relation
        let query = supabase
            .from("transactions")
            .select(`
                *,
                business:businesses(id, name)
            `)
            .order("created_on", { ascending: false });

        // Step 3: Filter transactions belonging to the user OR their businesses
        if (businessIds.length > 0) {
            const quotedBizIds = businessIds.map((id) => `"${id}"`).join(",");
            query = query.or(`user_id.eq.${userId},business_id.in.(${quotedBizIds})`);
        } else {
            query = query.eq("user_id", userId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Database query exception for transactions:", error);
            return { success: false, errorType: "DATABASE_ERROR", message: "Failed to retrieve transactions." };
        }

        const formattedTransactions: Transaction[] = (data || []).map((t: any) => ({
            ...t,
            business: Array.isArray(t.business) ? t.business[0] || null : t.business || null,
        }));

        return { success: true, data: formattedTransactions };

    } catch (e) {
        console.error("Unexpected parsing exception during transaction fetch:", e);
        return { success: false, errorType: "DATABASE_ERROR", message: "An unexpected error occurred." };
    }
}