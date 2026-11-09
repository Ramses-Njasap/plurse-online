// src/components/dashboard/my/settings/businesses/BusinessesPagination.tsx

"use client";

import { PBtn, pageNums } from "@/components/dashboard/my/shared/TablePagination";

interface BusinessesPaginationProps {
    page: number;
    totalPages: number;
    totalCount: number;
    startIndex: number;
    endIndex: number;
    onPageChange: (p: number) => void;
}

export function BusinessesPagination({
    page, totalPages, totalCount, startIndex, endIndex, onPageChange,
}: BusinessesPaginationProps) {
    /* Nothing to paginate: keep small portfolios clean */
    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Businesses pagination"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                Showing{" "}
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                    {startIndex + 1}–{endIndex}
                </span>{" "}
                of {totalCount} business{totalCount !== 1 ? "es" : ""}
            </p>

            <div className="flex items-center gap-1">
                <PBtn label="«" disabled={page === 1} onClick={() => onPageChange(1)} aria="First page" />
                <PBtn label="‹" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria="Previous page" />
                {pageNums(page, totalPages).map((p, i) =>
                    p === "…" ? (
                        <span key={`d${i}`} className="px-1 text-[12px]" style={{ color: "var(--text-subtle)" }}>…</span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPageChange(p as number)}
                            aria-current={p === page ? "page" : undefined}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-medium transition-colors"
                            style={p === page ? { background: "var(--brand)", color: "#fff" } : { color: "var(--text-muted)" }}
                            onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "var(--surface-muted)"; }}
                            onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = "transparent"; }}
                        >
                            {p}
                        </button>
                    )
                )}
                <PBtn label="›" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} aria="Next page" />
                <PBtn label="»" disabled={page === totalPages} onClick={() => onPageChange(totalPages)} aria="Last page" />
            </div>
        </nav>
    );
}