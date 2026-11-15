// src/components/dashboard/my/shared/TablePageSkeleton.tsx

import { SkeletonBlock } from "./SkeletonBlock";

interface TablePageSkeletonProps {
    /** Number of table columns (the first is rendered narrow, like the "#" column). */
    columns?: number;
    rows?: number;
    /** Number of filter pills after the search box. */
    filters?: number;
    /** Reserves space for an extra element next to the title (e.g. the referral link box). */
    showTitleExtra?: boolean;
    /** Number of buttons on the right of the title row (Select / New key…). Use 0 for none. */
    actions?: number;
    /** Number of summary cards between the filters and the table (e.g. transaction stats). */
    statCards?: number;
    label?: string;
}

/* Cycled so cells look naturally uneven without any randomness (no hydration drift). */
const CELL_WIDTHS = ["w-4/5", "w-3/5", "w-2/3", "w-1/2", "w-3/4"];
const FILTER_WIDTHS = ["w-24", "w-36", "w-32", "w-28", "w-24", "w-32"];
const ACTION_WIDTHS = ["w-[84px]", "w-[96px]", "w-[84px]"];

/**
 * Loading placeholder for any "header + filters (+ stats) + table + pagination" page.
 * Mirrors the real layout so nothing jumps when the data arrives.
 */
export function TablePageSkeleton({
    columns = 8,
    rows = 8,
    filters = 4,
    showTitleExtra = false,
    actions = 2,
    statCards = 0,
    label = "Loading",
}: TablePageSkeletonProps) {
    const gridTemplateColumns = `32px repeat(${Math.max(columns - 1, 1)}, minmax(0, 1fr))`;

    return (
        <div className="space-y-5" aria-busy="true" role="status" aria-label={label}>
            <div className="space-y-4">
                {/* Title row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="space-y-2">
                            <SkeletonBlock className="h-5 w-32 rounded" />
                            <SkeletonBlock className="h-3 w-24 rounded" />
                        </div>
                        {showTitleExtra && <SkeletonBlock className="h-[46px] w-[470px] max-w-full rounded-lg" />}
                    </div>
                    {actions > 0 && (
                        <div className="flex items-center gap-2">
                            {Array.from({ length: actions }).map((_, i) => (
                                <SkeletonBlock key={i} className={`h-9 rounded-lg ${ACTION_WIDTHS[i % ACTION_WIDTHS.length]}`} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-2">
                    <SkeletonBlock className="h-9 w-full max-w-[320px] flex-1 rounded-lg" style={{ minWidth: 220 }} />
                    {Array.from({ length: filters }).map((_, i) => (
                        <SkeletonBlock key={i} className={`h-9 rounded-lg ${FILTER_WIDTHS[i % FILTER_WIDTHS.length]}`} />
                    ))}
                </div>
            </div>

            {/* Summary cards */}
            {statCards > 0 && (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {Array.from({ length: statCards }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border px-4 py-3.5"
                            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                        >
                            <div className="flex items-center gap-2">
                                <SkeletonBlock className="h-2 w-2 rounded-full" />
                                <SkeletonBlock className="h-3 w-20 rounded" />
                            </div>
                            <SkeletonBlock className="mt-2.5 h-5 w-2/5 rounded" />
                            <SkeletonBlock className="mt-2 h-2.5 w-3/5 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div
                className="overflow-hidden rounded-xl border"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
                {/* Column headings */}
                <div
                    className="grid items-center gap-4 border-b px-4 py-3.5"
                    style={{ gridTemplateColumns, borderColor: "var(--border)", background: "var(--surface-muted)" }}
                >
                    {Array.from({ length: columns }).map((_, c) => (
                        <SkeletonBlock key={c} tone="strong" className={`h-2.5 rounded ${c === 0 ? "w-3" : "w-3/5"}`} />
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: rows }).map((_, r) => (
                    <div
                        key={r}
                        className="grid items-center gap-4 border-b px-4 py-[22px]"
                        style={{ gridTemplateColumns, borderColor: "var(--border)" }}
                    >
                        {Array.from({ length: columns }).map((__, c) => (
                            <SkeletonBlock
                                key={c}
                                className={`h-3 rounded ${c === 0 ? "w-4" : CELL_WIDTHS[(r + c) % CELL_WIDTHS.length]}`}
                            />
                        ))}
                    </div>
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3">
                    <SkeletonBlock className="h-3 w-32 rounded" />
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonBlock key={i} className="h-7 w-7 rounded-md" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}