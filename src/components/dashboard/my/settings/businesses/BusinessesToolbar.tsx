// src/components/dashboard/my/settings/businesses/BusinessesToolbar.tsx

"use client";

import { SearchIcon, GridIcon, ListIcon, ChevronDownIcon } from "./BusinessIcons";

export type RoleFilter = "all" | "owner" | "partner";
export type ViewMode = "grid" | "list";

interface BusinessesToolbarProps {
    search: string;
    onSearchChange: (v: string) => void;
    role: RoleFilter;
    onRoleChange: (r: RoleFilter) => void;
    counts: Record<RoleFilter, number>;

    /** Layout controls only appear once there's enough to browse. */
    showLayoutControls: boolean;
    view: ViewMode;
    onViewChange: (v: ViewMode) => void;
    pageSize: number;
    pageSizeOptions: number[];
    onPageSizeChange: (n: number) => void;
}

const SEGMENTS: { id: RoleFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "owner", label: "Owned by me" },
    { id: "partner", label: "Managed" },
];

export function BusinessesToolbar({
    search, onSearchChange, role, onRoleChange, counts,
    showLayoutControls, view, onViewChange, pageSize, pageSizeOptions, onPageSizeChange,
}: BusinessesToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Role segmented control */}
            <div
                role="tablist"
                aria-label="Filter businesses by relationship"
                className="flex items-center gap-0.5 rounded-lg border p-0.5"
                style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
            >
                {SEGMENTS.map((s) => {
                    const active = role === s.id;
                    return (
                        <button
                            key={s.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => onRoleChange(s.id)}
                            className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[13px] font-medium transition-all"
                            style={{
                                background: active ? "var(--surface)" : "transparent",
                                color: active ? "var(--foreground)" : "var(--text-muted)",
                                boxShadow: active ? "0 1px 2px rgba(15,23,42,0.08)" : "none",
                            }}
                        >
                            {s.label}
                            <span className="text-[11px] font-semibold" style={{ color: active ? "var(--brand)" : "var(--text-subtle)" }}>
                                {counts[s.id]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative flex-1" style={{ minWidth: "220px", maxWidth: "320px" }}>
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }}>
                    <SearchIcon size={13} />
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search name, code, city, manager…"
                    className="h-9 w-full rounded-lg border bg-white py-0 pl-8 pr-3 text-[13px] transition-colors focus:outline-none"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
            </div>

            {/* Layout controls */}
            {showLayoutControls && (
                <div className="ml-auto flex items-center gap-2">
                    {/* View toggle */}
                    <div
                        role="group"
                        aria-label="Layout"
                        className="flex items-center gap-0.5 rounded-lg border p-0.5"
                        style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
                    >
                        {([
                            { id: "grid", label: "Card view", icon: <GridIcon size={14} /> },
                            { id: "list", label: "List view", icon: <ListIcon size={14} /> },
                        ] as const).map((v) => {
                            const active = view === v.id;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => onViewChange(v.id)}
                                    aria-label={v.label}
                                    aria-pressed={active}
                                    title={v.label}
                                    className="flex h-8 w-8 items-center justify-center rounded-md transition-all"
                                    style={{
                                        background: active ? "var(--surface)" : "transparent",
                                        color: active ? "var(--brand)" : "var(--text-muted)",
                                        boxShadow: active ? "0 1px 2px rgba(15,23,42,0.08)" : "none",
                                    }}
                                >
                                    {v.icon}
                                </button>
                            );
                        })}
                    </div>

                    {/* Page size */}
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            aria-label="Businesses per page"
                            className="h-9 cursor-pointer appearance-none rounded-lg border bg-transparent pl-3 pr-8 text-[13px] font-medium transition-colors focus:outline-none"
                            style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-muted)" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        >
                            {pageSizeOptions.map((n) => (
                                <option key={n} value={n}>{n} per page</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }}>
                            <ChevronDownIcon size={12} />
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}