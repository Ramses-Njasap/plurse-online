"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/app/(dashboard)/dashboard/my/businesses/data/mockBusinessData";
import type { Business } from "@/types/users.types";
import { BusinessRowMenu } from "./BusinessRowMenu";

interface BusinessesTableProps {
    businesses: Business[];
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    multiSelectMode: boolean;
    selectedIds: Set<string>;
    onSelectOne: (id: string) => void;
    onSelectAll: () => void;
    onPageChange: (p: number) => void;
    onView: (b: Business) => void;
    onEdit: (b: Business) => void;
    onDelete: (b: Business) => void;
    /** Opens the payment flow to upgrade this business's TRIAL access key to LIFETIME. */
    onUpgradeKey: (b: Business) => void;
}

export function BusinessesTable({
    businesses, page, totalPages, totalCount, pageSize,
    multiSelectMode, selectedIds, onSelectOne, onSelectAll,
    onPageChange, onView, onEdit, onDelete, onUpgradeKey,
}: BusinessesTableProps) {
    const allOnPageSelected = businesses.length > 0 && businesses.every((b) => selectedIds.has(b.id));
    const someSelected = businesses.some((b) => selectedIds.has(b.id));
    const startIndex = (page - 1) * pageSize;

    // Fix 1: Suppress initial mismatch by delaying layout mount if needed, 
    // or rely on our UTC-stable formatDate helper above.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                                    />
                                </th>
                            )}
                            <Th>#</Th>
                            <Th>Business</Th>
                            <Th>Manager</Th>
                            <Th>Location</Th>
                            <Th>Access key</Th>
                            <Th>Partner</Th>
                            <Th>Created</Th>
                            <Th>Updated</Th>
                            <th className="w-12" />
                        </tr>
                    </thead>

                    <tbody>
                        {businesses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={multiSelectMode ? 10 : 9}
                                    className="py-16 text-center text-[13px]"
                                    style={{ color: "var(--text-subtle)" }}
                                >
                                    No businesses match your filters.
                                </td>
                            </tr>
                        ) : (
                            businesses.map((b, i) => {
                                const isSelected = selectedIds.has(b.id);

                                const managerName = b.manager_profile?.full_name || "Unknown Manager";
                                const managerEmail = b.manager_user?.email || "No email available";
                                const locationString = b.region_city && b.country ? `${b.region_city}, ${b.country}` : "No Location";
                                const partnerName = b.channel_partner?.profile?.full_name || "—";
                                return (
                                    <tr
                                        key={b.id}
                                        className="transition-colors"
                                        style={{
                                            borderBottom: "1px solid var(--border)",
                                            background: isSelected ? "var(--brand-light)" : "transparent",
                                        }}
                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--surface-muted)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "var(--brand-light)" : "transparent"; }}
                                    >
                                        {multiSelectMode && (
                                            <td className="py-3.5 pl-4 pr-0">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => onSelectOne(b.id)}
                                                    className="h-4 w-4 cursor-pointer rounded"
                                                    style={{ accentColor: "var(--brand)" }}
                                                />
                                            </td>
                                        )}

                                        {/* SN */}
                                        <td className="px-4 py-3.5 font-mono font-medium" style={{ color: "var(--text-subtle)" }}>
                                            #{startIndex + i + 1}
                                        </td>

                                        {/* Business */}
                                        <td className="px-4 py-3.5">
                                            <p className="font-semibold" style={{ color: "var(--foreground)" }}>{b.name || "Unnamed Business"}</p>
                                            {!b.channel_partner && !b.access_key?.channel_partner_id && (
                                                <p className="font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                                    {/* {b.id} */}
                                                    Your business
                                                </p>
                                            )}
                                        </td>

                                        {/* Manager */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar name={managerName} />
                                                <div>
                                                    <p className="font-medium whitespace-nowrap" style={{ color: "var(--foreground)" }}>
                                                        {managerName}
                                                    </p>
                                                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                                        {managerEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                            {locationString}
                                        </td>

                                        {/* Access key */}
                                        <td className="px-4 py-3.5">
                                            {b.access_key ? (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                                        style={
                                                            b.access_key.key_type === "LIFETIME"
                                                                ? { background: "rgba(59,130,246,0.10)", color: "#3b82f6" }
                                                                : { background: "rgba(245,158,11,0.10)", color: "#d97706" }
                                                        }
                                                    >
                                                        {b.access_key.key_type === "LIFETIME" ? "Lifetime" : "Trial"}
                                                    </span>

                                                    {b.access_key.key_type === "TRIAL" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onUpgradeKey(b)}
                                                            title="Upgrade to a Lifetime access key"
                                                            className="flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-semibold transition-colors"
                                                            style={{ borderColor: "var(--brand)", color: "var(--brand)", background: "transparent" }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--brand-light)"; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                                        >
                                                            <UpgradeIcon />
                                                            Upgrade
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span style={{ color: "var(--text-subtle)" }}>—</span>
                                            )}
                                        </td>

                                        {/* Channel partner */}
                                        <td className="px-4 py-3.5">
                                            {b.channel_partner ? (
                                                <div>
                                                    <p className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                                                        {partnerName}
                                                    </p>
                                                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                                        Active partner
                                                    </p>
                                                </div>
                                            ) : (
                                                <span style={{ color: "var(--text-subtle)" }}>—</span>
                                            )}
                                        </td>

                                        {/* Created */}
                                        <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                            {mounted ? formatDate(b.created_on) : "..."}
                                        </td>

                                        {/* Updated */}
                                        <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                            {mounted ? formatDate(b.updated_on) : "..."}
                                        </td>

                                        {/* Row menu */}
                                        <td className="px-3 py-3.5">
                                            <BusinessRowMenu
                                                business={b}
                                                onView={onView}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
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

function PBtn({ label, disabled, onClick, aria }: { label: string; disabled: boolean; onClick: () => void; aria: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={aria}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--surface-muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
            {label}
        </button>
    );
}

function pageNums(cur: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (cur >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "…", cur - 1, cur, cur + 1, "…", total];
}

function Avatar({ name }: { name: string }) {
    const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: color }}
        >
            {initials}
        </div>
    );
}

function UpgradeIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
    );
}