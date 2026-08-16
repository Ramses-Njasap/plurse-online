"use client";

import { useState, useMemo } from "react";
import { type Business, MOCK_BUSINESSES } from "../data/mockBusinessData";

export type SortField = "name" | "created_on" | "updated_on" | "country";
export type SortDir = "asc" | "desc";

export interface BusinessFilters {
    search: string;
    country: string;         // "all" or specific country
    hasKey: "all" | "linked" | "unlinked";
    hasPartner: "all" | "yes" | "no";
    sortField: SortField;
    sortDir: SortDir;
}

const DEFAULT_FILTERS: BusinessFilters = {
    search: "",
    country: "all",
    hasKey: "all",
    hasPartner: "all",
    sortField: "created_on",
    sortDir: "desc",
};

const PAGE_SIZE = 10;

export function useBusinessFilters(dataset: Business[]) {
    const [filters, setFilters] = useState<BusinessFilters>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);

    function setFilter<K extends keyof BusinessFilters>(key: K, value: BusinessFilters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function resetFilters() {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }

    /* All unique countries in the dataset */
    const countries = useMemo(
        () => [...new Set(dataset.map((b) => b.country))].sort(),
        [dataset]
    );

    const filtered = useMemo(() => {
        let result: Business[] = [...dataset];

        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (b) =>
                    b.name.toLowerCase().includes(q) ||
                    b.id.toLowerCase().includes(q) ||
                    b.manager_profile.full_name.toLowerCase().includes(q) ||
                    b.region_city.toLowerCase().includes(q) ||
                    b.country.toLowerCase().includes(q)
            );
        }

        if (filters.country !== "all") {
            result = result.filter((b) => b.country === filters.country);
        }

        if (filters.hasKey === "linked") result = result.filter((b) => b.access_key !== null);
        if (filters.hasKey === "unlinked") result = result.filter((b) => b.access_key === null);

        if (filters.hasPartner === "yes") result = result.filter((b) => b.channel_partner !== null);
        if (filters.hasPartner === "no") result = result.filter((b) => b.channel_partner === null);

        result.sort((a, b) => {
            let aVal: string = "";
            let bVal: string = "";
            switch (filters.sortField) {
                case "name": aVal = a.name; bVal = b.name; break;
                case "country": aVal = a.country; bVal = b.country; break;
                case "created_on": aVal = a.created_on; bVal = b.created_on; break;
                case "updated_on": aVal = a.updated_on; bVal = b.updated_on; break;
            }
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
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
        countries, PAGE_SIZE,
    };
}