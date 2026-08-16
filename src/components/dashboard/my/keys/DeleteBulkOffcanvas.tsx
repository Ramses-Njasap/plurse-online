"use client";

import { useEffect, useState } from "react";
import { type AccessKey, formatDate, maskKeyCode, formatAmount, getExpiryStatus } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";

interface DeleteBulkOffcanvasProps {
    keys: AccessKey[];
    onConfirm: (ids: string[]) => void;
    onCancel: () => void;
}

export function DeleteBulkOffcanvas({ keys, onConfirm, onCancel }: DeleteBulkOffcanvasProps) {
    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(keys.map((k) => k.id)));
    const [visible, setVisible] = useState(false);

    useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") handleClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    function handleClose() {
        setVisible(false);
        setTimeout(onCancel, 300);
    }

    function handleConfirm() {
        setVisible(false);
        setTimeout(() => onConfirm([...checkedIds]), 300);
    }

    function toggleId(id: string) {
        setCheckedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    const toDelete = checkedIds.size;

    return (
        <>
            <div
                className="fixed inset-0 z-50 transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.45)", opacity: visible ? 1 : 0 }}
                onClick={handleClose}
            />

            <div
                className="fixed bottom-0 right-0 top-0 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out"
                style={{
                    width: "min(88vw, 660px)",
                    background: "var(--surface)",
                    transform: visible ? "translateX(0)" : "translateX(100%)",
                }}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
                    <div>
                        <h3 className="text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Confirm bulk deletion
                        </h3>
                        <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                            {keys.length} key{keys.length !== 1 ? "s" : ""} selected — uncheck any you want to keep.
                        </p>
                    </div>
                    <button type="button" onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        style={{ color: "var(--text-subtle)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        aria-label="Close"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Warning */}
                <div className="mx-6 mt-4 shrink-0 rounded-xl px-4 py-3 text-[12px] leading-relaxed"
                    style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                    <strong>This action is irreversible.</strong> All checked keys will be permanently deleted
                    and any linked businesses will immediately lose access.
                </div>

                {/* Scrollable list */}
                <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
                    {keys.map((k) => {
                        const isChecked = checkedIds.has(k.id);
                        const expiryStatus = getExpiryStatus(k);

                        return (
                            <div
                                key={k.id}
                                className="rounded-xl border p-4 transition-all"
                                style={{
                                    borderColor: isChecked ? "rgba(239,68,68,0.35)" : "var(--border)",
                                    background: isChecked ? "rgba(239,68,68,0.04)" : "var(--surface-muted)",
                                    opacity: isChecked ? 1 : 0.45,
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleId(k.id)}
                                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded"
                                        style={{ accentColor: "#ef4444" }}
                                    />

                                    <div className="min-w-0 flex-1 space-y-2.5">
                                        {/* Key info */}
                                        <div className="rounded-lg p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <TypePill type={k.key_type} />
                                                <StatusPill status={expiryStatus} />
                                            </div>
                                            <p className="mb-1 font-mono text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                                                {maskKeyCode(k.key_code)}
                                            </p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                <span>Amount: {formatAmount(k.amount)}</span>
                                                {k.key_type === "TRIAL" && <span>Trial fee: {k.deduct_trial_fee ? "Yes" : "No"}</span>}
                                                <span>Expires: {k.expires_at ? formatDate(k.expires_at) : "Never"}</span>
                                                <span>Activated: {k.activated_at ? formatDate(k.activated_at) : "Not activated"}</span>
                                                <span>Created: {formatDate(k.created_on)}</span>
                                            </div>
                                        </div>

                                        {/* Business */}
                                        {k.business ? (
                                            <div className="rounded-lg p-3" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}>
                                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#d97706" }}>
                                                    Linked business
                                                </p>
                                                <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{k.business.name}</p>
                                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                    {k.business.region_city}, {k.business.country}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Not linked to any business.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
                    <p className="mb-3 text-center text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {toDelete === 0
                            ? "No keys selected for deletion."
                            : `${toDelete} of ${keys.length} key${keys.length !== 1 ? "s" : ""} will be permanently deleted.`}
                    </p>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleClose}
                            className="h-[42px] flex-1 rounded-xl border text-[13px] font-medium transition-all"
                            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                        >
                            Cancel
                        </button>
                        <button type="button" onClick={handleConfirm} disabled={toDelete === 0}
                            className="h-[42px] flex-1 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: "#ef4444" }}
                            onMouseEnter={(e) => { if (toDelete > 0) e.currentTarget.style.background = "#dc2626"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#ef4444"; }}
                        >
                            Delete {toDelete > 0 ? `${toDelete} key${toDelete !== 1 ? "s" : ""}` : ""}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function TypePill({ type }: { type: string }) {
    return (
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
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
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

function XIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}