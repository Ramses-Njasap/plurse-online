"use client";

import { type BusinessFilters } from "@/app/(dashboard)/dashboard/my/businesses/hooks/useBusinessFilters";
import { FilterSelect } from "@/components/dashboard/my/shared/FilterSelect";
import { ChannelPartnerPromoBanner } from "@/components/dashboard/my/shared/ChannelPartnerPromoBanner";

interface BusinessesHeaderProps {
    filters: BusinessFilters;
    totalCount: number;
    selectedCount: number;
    multiSelectMode: boolean;
    countries: string[];
    onFilterChange: <K extends keyof BusinessFilters>(key: K, value: BusinessFilters[K]) => void;
    onResetFilters: () => void;
    onToggleMultiSelect: () => void;
    onBulkDelete: () => void;
    onAddBusiness: () => void;
}

export function BusinessesHeader({
    filters, totalCount, selectedCount, multiSelectMode, countries,
    onFilterChange, onResetFilters, onToggleMultiSelect, onBulkDelete, onAddBusiness,
}: BusinessesHeaderProps) {
    const hasActiveFilters =
        filters.search !== "" ||
        filters.country !== "all" ||
        filters.hasKey !== "all" ||
        filters.hasPartner !== "all";

    return (
        <div className="space-y-4">
            {/* Channel partner promo — renders nothing once the user is already a partner */}
            <ChannelPartnerPromoBanner orientation="horizontal" />

            {/* Title row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-[18px] font-semibold" style={{ color: "var(--foreground)" }}>
                        Businesses
                    </h2>
                    <p className="mt-0.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
                        {totalCount} business{totalCount !== 1 ? "es" : ""} found
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
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
                        onClick={onAddBusiness}
                        className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-white transition-all"
                        style={{ background: "var(--brand)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                    >
                        <PlusIcon />
                        Add business
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
                        placeholder="Search name, ID, manager…"
                        className="h-9 w-full rounded-lg border bg-white py-0 pl-8 pr-3 text-[13px] focus:outline-none transition-colors"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                </div>

                {/* Country — searchable when many */}
                <FilterSelect
                    value={filters.country}
                    onChange={(v) => onFilterChange("country", v)}
                    options={[
                        { value: "all", label: "All countries" },
                        ...countries.map((c) => ({ value: c, label: c })),
                    ]}
                    searchThreshold={4}
                />

                {/* Key status */}
                <FilterSelect
                    value={filters.hasKey}
                    onChange={(v) => onFilterChange("hasKey", v as BusinessFilters["hasKey"])}
                    options={[
                        { value: "all", label: "Any key status" },
                        { value: "linked", label: "Key linked" },
                        { value: "unlinked", label: "No key" },
                    ]}
                />

                {/* Channel partner */}
                <FilterSelect
                    value={filters.hasPartner}
                    onChange={(v) => onFilterChange("hasPartner", v as BusinessFilters["hasPartner"])}
                    options={[
                        { value: "all", label: "Any partner status" },
                        { value: "yes", label: "Has channel partner" },
                        { value: "no", label: "No partner" },
                    ]}
                />

                {/* Sort */}
                <FilterSelect
                    value={`${filters.sortField}:${filters.sortDir}`}
                    onChange={(v) => {
                        const [field, dir] = v.split(":") as [BusinessFilters["sortField"], BusinessFilters["sortDir"]];
                        onFilterChange("sortField", field);
                        onFilterChange("sortDir", dir);
                    }}
                    options={[
                        { value: "created_on:desc", label: "Newest first" },
                        { value: "created_on:asc", label: "Oldest first" },
                        { value: "updated_on:desc", label: "Recently updated" },
                        { value: "name:asc", label: "Name A–Z" },
                        { value: "name:desc", label: "Name Z–A" },
                        { value: "country:asc", label: "Country A–Z" },
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