// src/components/dashboard/my/shared/TablePagination.tsx

"use client";

interface TablePaginationProps {
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (p: number) => void;
}

export function TablePagination({ page, totalPages, totalCount, pageSize, onPageChange }: TablePaginationProps) {
    return (
        <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid var(--border)" }}
        >
            <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                Showing {totalCount === 0 ? 0 : Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
                <PBtn label="«" disabled={page === 1} onClick={() => onPageChange(1)} aria="First" />
                <PBtn label="‹" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria="Prev" />
                {pageNums(page, totalPages).map((p, i) =>
                    p === "…" ? (
                        <span key={`d${i}`} className="px-1 text-[12px]" style={{ color: "var(--text-subtle)" }}>…</span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPageChange(p as number)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-medium transition-colors"
                            style={p === page ? { background: "var(--brand)", color: "#fff" } : { color: "var(--text-muted)" }}
                            onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "var(--surface-muted)"; }}
                            onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = "transparent"; }}
                        >
                            {p}
                        </button>
                    )
                )}
                <PBtn label="›" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} aria="Next" />
                <PBtn label="»" disabled={page === totalPages} onClick={() => onPageChange(totalPages)} aria="Last" />
            </div>
        </div>
    );
}

export function PBtn({ label, disabled, onClick, aria }: { label: string; disabled: boolean; onClick: () => void; aria: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={aria}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--surface-muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
            {label}
        </button>
    );
}

export function pageNums(cur: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (cur >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "…", cur - 1, cur, cur + 1, "…", total];
}