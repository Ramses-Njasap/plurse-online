"use client";

import { getExpiryStatus, formatDate, maskKeyCode, formatAmount } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
import type { AccessKey } from "@/types/users.types";
import { KeyRowMenu } from "./KeyRowMenu";
import { DisabledKeyCheckbox } from "../shared/DisabledCheckbox";


interface KeysTableProps {
    keys: AccessKey[];
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    multiSelectMode: boolean;
    selectedIds: Set<string>;
    onSelectOne: (id: string) => void;
    onSelectAll: () => void;
    onPageChange: (p: number) => void;
    onView: (k: AccessKey) => void;
    onEdit: (k: AccessKey) => void;
    onDelete: (k: AccessKey) => void;
}

/* ── Status badge config ── */
const EXPIRY_BADGE: Record<string, { label: string; bg: string; color: string }> = {
    active: { label: "Active", bg: "rgba(34,197,94,0.10)", color: "#16a34a" },
    expiring_soon: { label: "Expiring soon", bg: "rgba(245,158,11,0.10)", color: "#d97706" },
    expired: { label: "Expired", bg: "rgba(239,68,68,0.10)", color: "#dc2626" },
    never: { label: "Never expires", bg: "rgba(99,102,241,0.10)", color: "#6366f1" },
    inactive: { label: "Inactive", bg: "rgba(100,116,139,0.12)", color: "#64748b" },
};

const KEY_TYPE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
    TRIAL: { label: "Trial", bg: "rgba(245,158,11,0.10)", color: "#d97706" },
    LIFETIME: { label: "Lifetime", bg: "rgba(59,130,246,0.10)", color: "#3b82f6" },
};

export function KeysTable({
    keys, page, totalPages, totalCount, pageSize,
    multiSelectMode, selectedIds, onSelectOne, onSelectAll,
    onPageChange, onView, onEdit, onDelete,
}: KeysTableProps) {
    const allOnPageSelected = keys.length > 0 && keys.every((k) => selectedIds.has(k.id));
    const someSelected = keys.some((k) => selectedIds.has(k.id));
    const startIndex = (page - 1) * pageSize;

    return (
        <div
            className="overflow-hidden rounded-xl border"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-muted)" }}>
                            {multiSelectMode && (
                                <th className="w-10 py-3 pl-4 pr-0">
                                    <input
                                        type="checkbox"
                                        checked={allOnPageSelected}
                                        ref={(el) => { if (el) el.indeterminate = someSelected && !allOnPageSelected; }}
                                        onChange={onSelectAll}
                                        className="h-4 w-4 cursor-pointer rounded"
                                        style={{ accentColor: "var(--brand)" }}
                                        aria-label="Select all on page"
                                    />
                                </th>
                            )}
                            <Th>#</Th>
                            <Th>Key code</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th>Amount</Th>
                            <Th>Trial fee</Th>
                            <Th>Expires at</Th>
                            <Th>Activated</Th>
                            <Th>Business</Th>
                            <Th>Created on</Th>
                            <th className="w-12" />
                        </tr>
                    </thead>

                    <tbody>
                        {keys.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={multiSelectMode ? 12 : 11}
                                    className="py-16 text-center text-[13px]"
                                    style={{ color: "var(--text-subtle)" }}
                                >
                                    No keys match your filters.
                                </td>
                            </tr>
                        ) : (
                            keys.map((k, i) => {
                                const expiryStatus = getExpiryStatus(k);
                                const expiryBadge = EXPIRY_BADGE[expiryStatus];
                                const typeBadge = KEY_TYPE_BADGE[k.key_type];
                                const isSelected = selectedIds.has(k.id);

                                return (
                                    <tr
                                        key={k.id}
                                        className="transition-colors"
                                        style={{
                                            borderBottom: "1px solid var(--border)",
                                            background: isSelected ? "var(--brand-light)" : "transparent",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = "var(--surface-muted)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = isSelected ? "var(--brand-light)" : "transparent";
                                        }}
                                    >
                                        {multiSelectMode && (
                                            <td className="py-3.5 pl-4 pr-0">
                                                <DisabledKeyCheckbox
                                                    isSelected={isSelected}
                                                    isRowDisabled={!!(k.channel_partner_id && k.from_company === false)}
                                                    onSelectOne={onSelectOne}
                                                    keyId={k.id}
                                                />
                                            </td>
                                        )}

                                        {/* SN */}
                                        <td className="px-4 py-3.5 font-mono font-medium" style={{ color: "var(--text-subtle)" }}>
                                            #{startIndex + i + 1}
                                        </td>

                                        {/* Key code */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-mono text-[12px]" style={{ color: "var(--foreground)" }}>
                                                {maskKeyCode(k.key_code)}
                                            </span>
                                        </td>

                                        {/* Key type */}
                                        <td className="px-4 py-3.5">
                                            <span
                                                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                                style={{ background: typeBadge.bg, color: typeBadge.color }}
                                            >
                                                {typeBadge.label}
                                            </span>
                                        </td>

                                        {/* Expiry status */}
                                        <td className="px-4 py-3.5">
                                            <span
                                                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                                style={{ background: expiryBadge.bg, color: expiryBadge.color }}
                                            >
                                                {expiryBadge.label}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-3.5 font-medium tabular-nums" style={{ color: "var(--foreground)" }}>
                                            {formatAmount(k.amount)}
                                        </td>

                                        {/* Deduct trial fee */}
                                        <td className="px-4 py-3.5">
                                            {k.key_type === "TRIAL" ? (
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                                                    style={
                                                        k.deduct_trial_fee
                                                            ? { background: "rgba(239,68,68,0.08)", color: "#dc2626" }
                                                            : { background: "rgba(34,197,94,0.08)", color: "#16a34a" }
                                                    }
                                                >
                                                    {k.deduct_trial_fee ? "Yes" : "No"}
                                                </span>
                                            ) : (
                                                <span style={{ color: "var(--text-subtle)" }}>—</span>
                                            )}
                                        </td>

                                        {/* Expires at */}
                                        <td className="px-4 py-3.5" style={{ color: "var(--text-muted)" }}>
                                            {k.expires_at ? formatDate(k.expires_at) : "—"}
                                        </td>

                                        {/* Activated at */}
                                        <td className="px-4 py-3.5" style={{ color: "var(--text-muted)" }}>
                                            {k.activated_at ? formatDate(k.activated_at) : (
                                                <span style={{ color: "var(--text-subtle)" }}>Not activated</span>
                                            )}
                                        </td>

                                        {/* Business */}
                                        <td className="px-4 py-3.5">
                                            {k.business ? (
                                                <div>
                                                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                                                        {k.business.name}
                                                    </p>
                                                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                                        {k.business.region_city}, {k.business.country}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span style={{ color: "var(--text-subtle)" }}>—</span>
                                            )}
                                        </td>

                                        {/* Created on */}
                                        <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                            {formatDate(k.created_on)}
                                        </td>

                                        {/* Row menu */}
                                        <td className="px-3 py-3.5">
                                            {k.channel_partner_id && k.from_company === false && (
                                                <KeyRowMenu keyItem={k} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderTop: "1px solid var(--border)" }}
            >
                <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                    Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of {totalCount}
                </p>

                <div className="flex items-center gap-1">
                    <PageBtn label="«" disabled={page === 1} onClick={() => onPageChange(1)} aria="First page" />
                    <PageBtn label="‹" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria="Previous page" />
                    {pageNumbers(page, totalPages).map((p, i) =>
                        p === "…" ? (
                            <span key={`d${i}`} className="px-1.5 text-[12px]" style={{ color: "var(--text-subtle)" }}>…</span>
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
                    <PageBtn label="›" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} aria="Next page" />
                    <PageBtn label="»" disabled={page === totalPages} onClick={() => onPageChange(totalPages)} aria="Last page" />
                </div>
            </div>
        </div>
    );
}

function Th({ children }: { children?: React.ReactNode }) {
    return (
        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--text-subtle)" }}>
            {children}
        </th>
    );
}

function PageBtn({ label, disabled, onClick, aria }: { label: string; disabled: boolean; onClick: () => void; aria: string }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} aria-label={aria}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--surface-muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
            {label}
        </button>
    );
}

function pageNumbers(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "…", current - 1, current, current + 1, "…", total];
}