// app/(dashboard)/dashboard/my/transactions/hooks/useTransactionFilters.tsx

"use client";

import { useState, useMemo } from "react";
import type { Transaction, TransactionStats, PaymentStatus, PaymentTargetEntity } from "@/types/users.types";

export type SortField = "created_on" | "amount";
export type SortDir = "asc" | "desc";

export interface TransactionFilters {
    search: string;
    status: "all" | PaymentStatus;
    target: "all" | PaymentTargetEntity;
    sortField: SortField;
    sortDir: SortDir;
}

const DEFAULT_FILTERS: TransactionFilters = {
    search: "",
    status: "all",
    target: "all",
    sortField: "created_on",
    sortDir: "desc",
};

const PAGE_SIZE = 10;

export function useTransactionFilters(dataset: Transaction[]) {
    const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);

    function setFilter<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function resetFilters() {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }

    /* Stats always reflect the whole dataset, not the filtered view */
    const stats = useMemo<TransactionStats>(() => {
        return dataset.reduce<TransactionStats>(
            (acc, t) => {
                if (t.status === "Success") { acc.successCount++; acc.totalPaid += t.amount; }
                if (t.status === "Pending") acc.pendingCount++;
                if (t.status === "Failed") acc.failedCount++;
                return acc;
            },
            { totalPaid: 0, successCount: 0, pendingCount: 0, failedCount: 0 }
        );
    }, [dataset]);

    const filtered = useMemo(() => {
        let result: Transaction[] = [...dataset];

        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter((t) => {
                const purpose = typeof t.payload?.purpose === "string" ? t.payload.purpose : "";
                const keyCode = typeof t.payload?.key_code === "string" ? t.payload.key_code : "";
                return (
                    t.id.toLowerCase().includes(q) ||
                    t.business?.name.toLowerCase().includes(q) ||
                    purpose.toLowerCase().includes(q) ||
                    keyCode.toLowerCase().includes(q) ||
                    t.error_message?.toLowerCase().includes(q)
                );
            });
        }

        if (filters.status !== "all") result = result.filter((t) => t.status === filters.status);
        if (filters.target !== "all") result = result.filter((t) => t.target_entity === filters.target);

        result.sort((a, b) => {
            const cmp =
                filters.sortField === "amount"
                    ? a.amount - b.amount
                    : a.created_on < b.created_on ? -1 : a.created_on > b.created_on ? 1 : 0;
            return filters.sortDir === "asc" ? cmp : -cmp;
        });

        return result;
    }, [filters, dataset]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return {
        filters, setFilter, resetFilters,
        page: safePage, setPage,
        totalPages, totalCount: filtered.length,
        paginated, allFiltered: filtered,
        stats, PAGE_SIZE,
    };
}