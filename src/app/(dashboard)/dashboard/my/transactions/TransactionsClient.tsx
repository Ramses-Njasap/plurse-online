// app/(dashboard)/dashboard/my/transactions/TransactionsClient.tsx

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Transaction } from "@/types/users.types";
import { useTransactionFilters } from "./hooks/useTransactionFilters";
import { describeTransaction } from "./data/mockTransactions"; // Or keep your description helper
import { fetchAuthenticatedTransactions } from "@/app/actions/transactions"; // Import your server action here
import { TransactionsHeader } from "@/components/dashboard/my/transactions/TransactionsHeader";
import { TransactionsStats } from "@/components/dashboard/my/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/dashboard/my/transactions/TransactionsTable";
import { ViewTransactionModal } from "@/components/dashboard/my/transactions/ViewTransactionModal";
import { useToast } from "@/components/ui";

const MOCK_RETRY_DELAY_MS = 1500;

export function TransactionsClient() {
    const toast = useToast();

    /* ── Data ── */
    const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const retryTimers = useRef<number[]>([]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchAuthenticatedTransactions();
            if (response.success) {
                setLiveTransactions(response.data);
            } else {
                toast.error(response.message, { title: "Couldn't load transactions" });
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred while loading your transactions.", { title: "Couldn't load transactions" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadData();
        const timers = retryTimers.current;
        return () => timers.forEach((id) => window.clearTimeout(id));
    }, [loadData]);

    const {
        filters, setFilter, resetFilters,
        page, setPage, totalPages, totalCount,
        paginated, stats, PAGE_SIZE,
    } = useTransactionFilters(liveTransactions);

    /* ── View modal (derive from live list so it reflects retries) ── */
    const [viewId, setViewId] = useState<string | null>(null);
    const viewTarget = viewId ? liveTransactions.find((t) => t.id === viewId) ?? null : null;

    /* ── Copy ID ── */
    const handleCopyId = useCallback(async (t: Transaction) => {
        try {
            await navigator.clipboard.writeText(t.id);
            toast.success("Transaction ID copied to clipboard.", { title: describeTransaction(t) });
        } catch {
            toast.error("Your browser blocked clipboard access.", { title: "Couldn't copy ID" });
        }
    }, [toast]);

    /* ── Retry a failed payment (mock / expandable to server action) ── */
    const handleRetry = useCallback((t: Transaction) => {
        if (t.status !== "Failed") return;

        setLiveTransactions((prev) =>
            prev.map((item) =>
                item.id === t.id
                    ? {
                        ...item,
                        status: "Pending",
                        error_message: null,
                        retry_count: item.retry_count + 1,
                        updated_on: new Date().toISOString(),
                    }
                    : item
            )
        );
        toast.info("We're checking the payment with the gateway.", { title: "Retrying payment" });

        // TODO: Replace or wire with your backend retry/polling server action
        const timer = window.setTimeout(() => {
            setLiveTransactions((prev) =>
                prev.map((item) =>
                    item.id === t.id
                        ? { ...item, status: "Success", updated_on: new Date().toISOString() }
                        : item
                )
            );
            toast.success("The payment went through.", { title: describeTransaction(t) });
        }, MOCK_RETRY_DELAY_MS);
        retryTimers.current.push(timer);
    }, [toast]);

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                <p className="text-sm font-medium text-gray-500">Retrieving your transactions...</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-5">
                <TransactionsHeader
                    filters={filters}
                    totalCount={totalCount}
                    onFilterChange={setFilter}
                    onResetFilters={resetFilters}
                />

                <TransactionsStats stats={stats} />

                <TransactionsTable
                    transactions={paginated}
                    page={page}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                    onView={(t) => setViewId(t.id)}
                    onRetry={handleRetry}
                    onCopyId={handleCopyId}
                />
            </div>

            {viewTarget && (
                <ViewTransactionModal
                    transaction={viewTarget}
                    onClose={() => setViewId(null)}
                    onRetry={handleRetry}
                />
            )}
        </>
    );
}