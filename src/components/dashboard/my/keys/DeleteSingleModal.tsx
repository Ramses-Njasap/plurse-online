"use client";

import { useEffect } from "react";
import { formatDate, maskKeyCode, formatAmount, getExpiryStatus } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
import { AccessKey } from "@/types/users.types";

interface DeleteSingleModalProps {
    keyItem: AccessKey;
    onConfirm: (k: AccessKey) => void;
    onCancel: () => void;
}

export function DeleteSingleModal({ keyItem, onConfirm, onCancel }: DeleteSingleModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onCancel]);

    const status = getExpiryStatus(keyItem);

    return (
        <>
            <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onCancel} />

            <div
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl"
                style={{ background: "var(--surface)" }}
            >
                {/* Icon */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(239,68,68,0.10)" }}>
                    <TrashIcon />
                </div>

                <h3 className="mb-1 text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                    Delete access key?
                </h3>
                <p className="mb-5 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    This action cannot be undone. The key will be immediately revoked and any services
                    using it will lose access.
                </p>

                {/* Key details */}
                <div className="mb-3 space-y-2 rounded-xl p-4" style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Key details</p>
                    <InfoRow label="Key code" value={<span className="font-mono text-[12px]">{maskKeyCode(keyItem.key_code)}</span>} />
                    <InfoRow label="Type" value={<TypePill type={keyItem.key_type} />} />
                    <InfoRow label="Status" value={<StatusPill status={status} />} />
                    <InfoRow label="Amount" value={formatAmount(keyItem.amount)} />
                    <InfoRow label="Trial fee" value={keyItem.key_type === "TRIAL" ? (keyItem.deduct_trial_fee ? "Yes" : "No") : "—"} />
                    <InfoRow label="Expires at" value={keyItem.expires_at ? formatDate(keyItem.expires_at) : "Never"} />
                    <InfoRow label="Activated" value={keyItem.activated_at ? formatDate(keyItem.activated_at) : "Not activated"} />
                    <InfoRow label="Created on" value={formatDate(keyItem.created_on)} />
                </div>

                {/* Linked business */}
                {keyItem.business ? (
                    <div className="mb-5 space-y-2 rounded-xl p-4" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#d97706" }}>Linked business</p>
                        <InfoRow label="Name" value={keyItem.business.name} />
                        <InfoRow label="Location" value={`${keyItem.business.region_city}, ${keyItem.business.country}`} />
                        <InfoRow label="Created" value={formatDate(keyItem.business.created_on)} />
                    </div>
                ) : (
                    <div className="mb-5 rounded-xl p-3 text-[12px]" style={{ background: "var(--surface-muted)", color: "var(--text-subtle)" }}>
                        This key is not linked to any business.
                    </div>
                )}

                <div className="flex gap-3">
                    <button type="button" onClick={onCancel}
                        className="h-[40px] flex-1 rounded-lg border text-[13px] font-medium transition-all"
                        style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                    >
                        Cancel
                    </button>
                    <button type="button" onClick={() => onConfirm(keyItem)}
                        className="h-[40px] flex-1 rounded-lg text-[13px] font-medium text-white transition-all"
                        style={{ background: "#ef4444" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
                    >
                        Yes, delete key
                    </button>
                </div>
            </div>
        </>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>{label}</span>
            <span className="text-right text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{value}</span>
        </div>
    );
}

function TypePill({ type }: { type: string }) {
    return (
        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={type === "LIFETIME"
                ? { background: "rgba(59,130,246,0.10)", color: "#3b82f6" }
                : { background: "rgba(245,158,11,0.10)", color: "#d97706" }}>
            {type === "LIFETIME" ? "Lifetime" : "Trial"}
        </span>
    );
}

function StatusPill({ status }: { status: string }) {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        active: { label: "Active", color: "#16a34a", bg: "rgba(34,197,94,0.10)" },
        expiring_soon: { label: "Expiring soon", color: "#d97706", bg: "rgba(245,158,11,0.10)" },
        expired: { label: "Expired", color: "#dc2626", bg: "rgba(239,68,68,0.10)" },
        never: { label: "Never expires", color: "#6366f1", bg: "rgba(99,102,241,0.10)" },
        inactive: { label: "Inactive", color: "#64748b", bg: "rgba(100,116,139,0.12)" },
    };
    const s = map[status] ?? map.active;
    return (
        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

function TrashIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
    );
}