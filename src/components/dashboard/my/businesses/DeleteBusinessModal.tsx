"use client";

import { useEffect } from "react";
import { formatDate, maskKeyCode } from "@/app/(dashboard)/dashboard/my/businesses/data/mockBusinessData";
import type { Business } from "@/types/users.types";

interface DeleteBusinessModalProps {
    business: Business;
    onConfirm: (b: Business) => void;
    onCancel: () => void;
}

export function DeleteBusinessModal({ business, onConfirm, onCancel }: DeleteBusinessModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onCancel]);

    const b = business;

    return (
        <>
            <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onCancel} />

            <div
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl"
                style={{ background: "var(--surface)" }}
            >
                {/* Icon */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(239,68,68,0.10)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                </div>

                <h3 className="mb-1 text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                    Delete business?
                </h3>
                <p className="mb-5 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    This will permanently remove the business and unlink it from its access key and channel partner.
                </p>

                {/* Business */}
                <div className="mb-3 space-y-1.5 rounded-xl p-4" style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Business</p>
                    <InfoRow label="Name" value={b.name} />
                    <InfoRow label="ID" value={<span className="font-mono text-[11px]">{b.id}</span>} />
                    <InfoRow label="Location" value={`${b.region_city}, ${b.country}`} />
                    <InfoRow label="Manager" value={b?.manager_profile?.full_name} />
                </div>

                {/* Access key */}
                {b.access_key && (
                    <div className="mb-3 space-y-1.5 rounded-xl p-4" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--brand)" }}>Linked access key</p>
                        <InfoRow label="Code" value={<span className="font-mono text-[11px]">{maskKeyCode(b.access_key.key_code)}</span>} />
                        <InfoRow label="Type" value={b.access_key.key_type === "LIFETIME" ? "Lifetime" : "Trial"} />
                        <InfoRow label="Expires" value={b.access_key.expires_at ? formatDate(b.access_key.expires_at) : "Never"} />
                    </div>
                )}

                {/* Channel partner */}
                {b.channel_partner && (
                    <div className="mb-5 space-y-1.5 rounded-xl p-4" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#d97706" }}>Channel partner</p>
                        <InfoRow label="Name" value={b.channel_partner.profile.full_name} />
                        <InfoRow label="Valid from" value={formatDate(b.channel_partner.valid_from)} />
                        <InfoRow label="Valid to" value={b.channel_partner.valid_to ? formatDate(b.channel_partner.valid_to) : "No expiry"} />
                    </div>
                )}

                {!b.access_key && !b.channel_partner && <div className="mb-5" />}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-[40px] flex-1 rounded-lg border text-[13px] font-medium transition-all"
                        style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(b)}
                        className="h-[40px] flex-1 rounded-lg text-[13px] font-medium text-white transition-all"
                        style={{ background: "#ef4444" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
                    >
                        Yes, delete business
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
            <span className="text-right text-[12px] font-medium" style={{ color: "var(--foreground)" }}>{value}</span>
        </div>
    );
}