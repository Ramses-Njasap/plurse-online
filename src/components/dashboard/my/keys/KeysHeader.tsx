"use client";

import { type KeyFilters } from "@/app/(dashboard)/dashboard/my/keys/hooks/useKeyFilters";
import { FilterSelect } from "@/components/dashboard/my/shared/FilterSelect";
import { useState } from "react";

interface KeysHeaderProps {
    filters: KeyFilters;
    totalCount: number;
    selectedCount: number;
    multiSelectMode: boolean;
    onFilterChange: <K extends keyof KeyFilters>(key: K, value: KeyFilters[K]) => void;
    onResetFilters: () => void;
    onToggleMultiSelect: () => void;
    onBulkDelete: () => void;
    onAddKey: () => void;
}

export function KeysHeader({
    filters, totalCount, selectedCount, multiSelectMode,
    onFilterChange, onResetFilters, onToggleMultiSelect, onBulkDelete, onAddKey,
}: KeysHeaderProps) {

    const [copied, setCopied] = useState(false);

    const hasActiveFilters =
        filters.search !== "" ||
        filters.keyType !== "all" ||
        filters.isActive !== "all" ||
        filters.expiryStatus !== "all" ||
        filters.linkedBusiness !== "all" ||
        filters.deductTrialFee !== "all";

    const referralCode = "your-referral-code";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const referralLink = `${origin}/r/${referralCode}`;

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            /* Fallback for browsers without clipboard API */
            const ta = document.createElement("textarea");
            ta.value = referralLink;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    }

    return (
        <div className="space-y-4">
            {/* Title row */}
            <div className="flex items-center justify-between flex-wrap">
                <div className="flex flex-row gap-5 items-center flex-wrap">
                    <div>
                        <h2 className="text-[18px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Access Keys
                        </h2>
                        <p className="mt-0.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
                            {totalCount} key{totalCount !== 1 ? "s" : ""} found
                        </p>
                    </div>
                    <div>
                        {/* Referral key to copy and paste */}
                        <div
                            className="mb-2 overflow-hidden rounded-xl"
                            style={{ border: "1px solid var(--border)" }}
                        >

                            {/* Key code */}
                            <div
                                className="flex items-center justify-between gap-3 py-1 px-2 overflow-x-auto no-scrollbar"
                                style={{ background: "var(--surface)" }}
                            >
                                <code
                                    className="flex-1 break-all font-mono text-[14px] font-semibold tracking-wide"
                                    style={{ color: "var(--foreground)" }}
                                >
                                    {referralLink}
                                </code>

                                {/* Copy button */}
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all"
                                    style={
                                        copied
                                            ? { background: "rgba(34,197,94,0.12)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }
                                            : { background: "var(--brand-light)", color: "var(--brand)", border: "1px solid rgba(59,130,246,0.2)" }
                                    }
                                >
                                    {copied ? (
                                        <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </svg>
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleMultiSelect}
                        className="flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-all"
                        style={
                            multiSelectMode
                                ? { background: "var(--brand-light)", borderColor: "rgba(59,130,246,0.3)", color: "var(--brand)" }
                                : { background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }
                        }
                    >
                        <CheckboxIcon />
                        {multiSelectMode ? "Cancel selection" : "Select"}
                    </button>

                    {multiSelectMode && selectedCount > 0 && (
                        <button
                            type="button"
                            onClick={onBulkDelete}
                            className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-white transition-all"
                            style={{ background: "#ef4444" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
                        >
                            <TrashIcon />
                            Delete {selectedCount} selected
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onAddKey}
                        className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-white transition-all"
                        style={{ background: "var(--brand)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                    >
                        <PlusIcon />
                        New key
                    </button>
                </div>
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
                        placeholder="Search key code or business…"
                        className="h-9 w-full rounded-lg border bg-white py-0 pl-8 pr-3 text-[13px] transition-colors focus:outline-none"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                </div>

                <FilterSelect
                    value={filters.keyType}
                    onChange={(v) => onFilterChange("keyType", v as KeyFilters["keyType"])}
                    options={[
                        { value: "all", label: "All types" },
                        { value: "TRIAL", label: "Trial" },
                        { value: "LIFETIME", label: "Lifetime" },
                    ]}
                />

                <FilterSelect
                    value={filters.isActive}
                    onChange={(v) => onFilterChange("isActive", v as KeyFilters["isActive"])}
                    options={[
                        { value: "all", label: "Active & inactive" },
                        { value: "active", label: "Active only" },
                        { value: "inactive", label: "Inactive only" },
                    ]}
                />

                <FilterSelect
                    value={filters.expiryStatus}
                    onChange={(v) => onFilterChange("expiryStatus", v as KeyFilters["expiryStatus"])}
                    options={[
                        { value: "all", label: "All statuses" },
                        { value: "active", label: "Active" },
                        { value: "expiring_soon", label: "Expiring soon" },
                        { value: "expired", label: "Expired" },
                        { value: "never", label: "Never expires" },
                        { value: "inactive", label: "Inactive" },
                    ]}
                />

                <FilterSelect
                    value={filters.linkedBusiness}
                    onChange={(v) => onFilterChange("linkedBusiness", v as KeyFilters["linkedBusiness"])}
                    options={[
                        { value: "all", label: "All keys" },
                        { value: "linked", label: "Linked to business" },
                        { value: "unlinked", label: "Not linked" },
                    ]}
                />

                <FilterSelect
                    value={filters.deductTrialFee}
                    onChange={(v) => onFilterChange("deductTrialFee", v as KeyFilters["deductTrialFee"])}
                    options={[
                        { value: "all", label: "Trial fee: all" },
                        { value: "yes", label: "Trial fee: yes" },
                        { value: "no", label: "Trial fee: no" },
                    ]}
                />

                <FilterSelect
                    value={`${filters.sortField}:${filters.sortDir}`}
                    onChange={(v) => {
                        const [field, dir] = v.split(":") as [KeyFilters["sortField"], KeyFilters["sortDir"]];
                        onFilterChange("sortField", field);
                        onFilterChange("sortDir", dir);
                    }}
                    options={[
                        { value: "created_on:desc", label: "Newest first" },
                        { value: "created_on:asc", label: "Oldest first" },
                        { value: "expires_at:asc", label: "Expiring soonest" },
                        { value: "expires_at:desc", label: "Expiring latest" },
                        { value: "amount:desc", label: "Amount: high–low" },
                        { value: "amount:asc", label: "Amount: low–high" },
                        { value: "key_code:asc", label: "Key A–Z" },
                    ]}
                />

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
function PlusIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
}
function TrashIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>;
}
function CheckboxIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 12 2 2 4-4" /></svg>;
}
function XIcon() {
    return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}