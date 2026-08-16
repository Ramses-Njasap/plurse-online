"use client";

import { useState, useMemo } from "react";
import { MOCK_KEYS, getExpiryStatus } from "../data/mockKeys";
import type { AccessKey, KeyType } from "@/types/users.types";

export type SortField = "created_on" | "expires_at" | "key_code" | "amount";
export type SortDir = "asc" | "desc";

export interface KeyFilters {
    search: string;
    keyType: KeyType | "all";
    isActive: "all" | "active" | "inactive";
    expiryStatus: "all" | "active" | "expiring_soon" | "expired" | "never" | "inactive";
    linkedBusiness: "all" | "linked" | "unlinked";
    deductTrialFee: "all" | "yes" | "no";
    sortField: SortField;
    sortDir: SortDir;
}

const DEFAULT_FILTERS: KeyFilters = {
    search: "",
    keyType: "all",
    isActive: "all",
    expiryStatus: "all",
    linkedBusiness: "all",
    deductTrialFee: "all",
    sortField: "created_on",
    sortDir: "desc",
};

const PAGE_SIZE = 10;

export function useMockKeyFilters() {
    const [filters, setFilters] = useState<KeyFilters>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);

    function setFilter<K extends keyof KeyFilters>(key: K, value: KeyFilters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function resetFilters() {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }

    const filtered = useMemo(() => {
        let result: AccessKey[] = [...MOCK_KEYS];

        // Search — key_code or business name / city
        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (k) =>
                    k.key_code.toLowerCase().includes(q) ||
                    k.business?.name.toLowerCase().includes(q) ||
                    k.business?.region_city.toLowerCase().includes(q)
            );
        }

        // Key type
        if (filters.keyType !== "all") {
            result = result.filter((k) => k.key_type === filters.keyType);
        }

        // Active state
        if (filters.isActive === "active") result = result.filter((k) => k.is_active);
        if (filters.isActive === "inactive") result = result.filter((k) => !k.is_active);

        // Expiry status (derived)
        if (filters.expiryStatus !== "all") {
            result = result.filter((k) => getExpiryStatus(k) === filters.expiryStatus);
        }

        // Linked business
        if (filters.linkedBusiness === "linked") result = result.filter((k) => k.business !== null);
        if (filters.linkedBusiness === "unlinked") result = result.filter((k) => k.business === null);

        // Deduct trial fee — only relevant for trial keys
        if (filters.deductTrialFee === "yes") result = result.filter((k) => k.deduct_trial_fee);
        if (filters.deductTrialFee === "no") result = result.filter((k) => !k.deduct_trial_fee);

        // Sort
        result.sort((a, b) => {
            let aVal: string | number = "";
            let bVal: string | number = "";

            switch (filters.sortField) {
                case "created_on":
                    aVal = new Date(a.created_on).getTime();
                    bVal = new Date(b.created_on).getTime();
                    break;
                case "expires_at":
                    aVal = a.expires_at ? new Date(a.expires_at).getTime() : Infinity;
                    bVal = b.expires_at ? new Date(b.expires_at).getTime() : Infinity;
                    break;
                case "key_code":
                    aVal = a.key_code;
                    bVal = b.key_code;
                    break;
                case "amount":
                    aVal = a.amount;
                    bVal = b.amount;
                    break;
            }

            if (aVal < bVal) return filters.sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return filters.sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return {
        filters,
        setFilter,
        resetFilters,
        page: safePage,
        setPage,
        totalPages,
        totalCount: filtered.length,
        paginated,
        allFiltered: filtered,
        PAGE_SIZE,
    };
}


// ✅ Changed: We now pass the dynamic database keys array into the hook
export function useKeyFilters(initialKeys: AccessKey[]) {
    const [filters, setFilters] = useState<KeyFilters>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);

    function setFilter<K extends keyof KeyFilters>(key: K, value: KeyFilters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function resetFilters() {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }

    const filtered = useMemo(() => {
        let result: AccessKey[] = [...initialKeys]; // ✅ Uses the dynamically fetched keys

        // Search — key_code or business name / city
        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (k) =>
                    k.key_code.toLowerCase().includes(q) ||
                    k.business?.name.toLowerCase().includes(q) ||
                    k.business?.region_city.toLowerCase().includes(q)
            );
        }

        // Key type
        if (filters.keyType !== "all") {
            result = result.filter((k) => k.key_type === filters.keyType);
        }

        // Active state
        if (filters.isActive === "active") result = result.filter((k) => k.is_active);
        if (filters.isActive === "inactive") result = result.filter((k) => !k.is_active);

        // Expiry status (derived)
        if (filters.expiryStatus !== "all") {
            result = result.filter((k) => getExpiryStatus(k) === filters.expiryStatus);
        }

        // Linked business
        if (filters.linkedBusiness === "linked") result = result.filter((k) => k.business !== null);
        if (filters.linkedBusiness === "unlinked") result = result.filter((k) => k.business === null);

        // Deduct trial fee — only relevant for trial keys
        if (filters.deductTrialFee === "yes") result = result.filter((k) => k.deduct_trial_fee);
        if (filters.deductTrialFee === "no") result = result.filter((k) => !k.deduct_trial_fee);

        // Sort
        result.sort((a, b) => {
            let aVal: string | number = "";
            let bVal: string | number = "";

            switch (filters.sortField) {
                case "created_on":
                    aVal = new Date(a.created_on).getTime();
                    bVal = new Date(b.created_on).getTime();
                    break;
                case "expires_at":
                    aVal = a.expires_at ? new Date(a.expires_at).getTime() : Infinity;
                    bVal = b.expires_at ? new Date(b.expires_at).getTime() : Infinity;
                    break;
                case "key_code":
                    aVal = a.key_code;
                    bVal = b.key_code;
                    break;
                case "amount":
                    aVal = a.amount;
                    bVal = b.amount;
                    break;
            }

            if (aVal < bVal) return filters.sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return filters.sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [filters, initialKeys]); // ✅ Added initialKeys as a dependency

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return {
        filters,
        setFilter,
        resetFilters,
        page: safePage,
        setPage,
        totalPages,
        totalCount: filtered.length,
        paginated,
        allFiltered: filtered,
        PAGE_SIZE,
    };
}