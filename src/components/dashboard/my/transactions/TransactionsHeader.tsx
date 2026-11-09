// src/components/dashboard/my/transactions/TransactionsHeader.tsx

"use client";

import type { TransactionFilters } from "@/app/(dashboard)/dashboard/my/transactions/hooks/useTransactionFilters";
import { FilterSelect } from "@/components/dashboard/my/shared/FilterSelect";

interface TransactionsHeaderProps {
    filters: TransactionFilters;
    totalCount: number;
    onFilterChange: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
    onResetFilters: () => void;
}

export function TransactionsHeader({ filters, totalCount, onFilterChange, onResetFilters }: TransactionsHeaderProps) {
    const hasActiveFilters =
        filters.search !== "" || filters.status !== "all" || filters.target !== "all";

    return (
        <div className="space-y-4">
            {/* Title row */}
            <div>
                <h2 className="text-[18px] font-semibold" style={{ color: "var(--foreground)" }}>
                    Transactions
                </h2>
                <p className="mt-0.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {totalCount} transaction{totalCount !== 1 ? "s" : ""} found
                </p>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1" style={{ minWidth: "220px", maxWidth: "320px" }}>
                    <SearchIcon />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => onFilterChange("search", e.target.value)}
                        placeholder="Search ID, business, key code…"
                        className="h-9 w-full rounded-lg border bg-white py-0 pl-8 pr-3 text-[13px] transition-colors focus:outline-none"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                </div>

                {/* Status */}
                <FilterSelect
                    value={filters.status}
                    onChange={(v) => onFilterChange("status", v as TransactionFilters["status"])}
                    options={[
                        { value: "all", label: "All statuses" },
                        { value: "Success", label: "Successful" },
                        { value: "Pending", label: "Pending" },
                        { value: "Failed", label: "Failed" },
                    ]}
                />

                {/* Target entity */}
                <FilterSelect
                    value={filters.target}
                    onChange={(v) => onFilterChange("target", v as TransactionFilters["target"])}
                    options={[
                        { value: "all", label: "All payment types" },
                        { value: "access_keys", label: "Access keys" },
                        { value: "businesses", label: "Businesses" },
                        { value: "channel_partners", label: "Channel partner" },
                    ]}
                />

                {/* Sort */}
                <FilterSelect
                    value={`${filters.sortField}:${filters.sortDir}`}
                    onChange={(v) => {
                        const [field, dir] = v.split(":") as [TransactionFilters["sortField"], TransactionFilters["sortDir"]];
                        onFilterChange("sortField", field);
                        onFilterChange("sortDir", dir);
                    }}
                    options={[
                        { value: "created_on:desc", label: "Newest first" },
                        { value: "created_on:asc", label: "Oldest first" },
                        { value: "amount:desc", label: "Highest amount" },
                        { value: "amount:asc", label: "Lowest amount" },
                    ]}
                />

                {/* Clear */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-all"
                        style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                        <XIcon />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}

function SearchIcon() {
    return (
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
        </span>
    );
}
function XIcon() {
    return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}