"use client";

import { useEffect, useState } from "react";
import { formatDate, maskKeyCode } from "@/app/(dashboard)/dashboard/my/businesses/data/mockBusinessData";
import type { Business } from "@/types/users.types";

interface DeleteBulkOffcanvasProps {
    businesses: Business[];
    onConfirm: (ids: string[]) => void;
    onCancel: () => void;
}

export function DeleteBulkOffcanvas({ businesses, onConfirm, onCancel }: DeleteBulkOffcanvasProps) {
    const [checkedIds, setCheckedIds] = useState<Set<string>>(
        new Set(businesses.map((b) => b.id))
    );
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

    function toggle(id: string) {
        setCheckedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    const toDelete = checkedIds.size;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.45)", opacity: visible ? 1 : 0 }}
                onClick={handleClose}
            />

            {/* Panel */}
            <div
                className="fixed bottom-0 right-0 top-0 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out"
                style={{
                    width: "min(88vw, 660px)",
                    background: "var(--surface)",
                    transform: visible ? "translateX(0)" : "translateX(100%)",
                }}
            >
                {/* Header */}
                <div
                    className="flex shrink-0 items-center justify-between border-b px-6 py-5"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div>
                        <h3 className="text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Confirm bulk deletion
                        </h3>
                        <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                            {businesses.length} business{businesses.length !== 1 ? "es" : ""} selected — uncheck any you want to keep.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        style={{ color: "var(--text-subtle)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        aria-label="Close"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Warning banner */}
                <div
                    className="mx-6 mt-4 shrink-0 rounded-xl px-4 py-3 text-[12px] leading-relaxed"
                    style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
                >
                    <strong>This action is irreversible.</strong> All checked businesses will either be permanently deleted or 
                    your channel partner association will be removed, and their access keys unlinked.
                </div>

                {/* Scrollable list */}
                <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
                    {businesses.map((b) => {
                        const isChecked = checkedIds.has(b.id);
                        return (
                            <div
                                key={b.id}
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
                                        onChange={() => toggle(b.id)}
                                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded"
                                        style={{ accentColor: "#ef4444" }}
                                    />

                                    <div className="min-w-0 flex-1 space-y-2.5">
                                        {/* Business core */}
                                        <div
                                            className="rounded-lg p-3"
                                            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                                        >
                                            <div className="mb-1.5 flex items-center gap-2">
                                                <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                                                    {b.name}
                                                </p>
                                            </div>
                                            <p className="font-mono text-[10px]" style={{ color: "var(--text-subtle)" }}>
                                                {b.id}
                                            </p>
                                            <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                {b.region_city}, {b.country} · Created {formatDate(b.created_on)}
                                            </p>
                                        </div>

                                        {/* Manager */}
                                        <div
                                            className="rounded-lg p-3"
                                            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                                        >
                                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                                                Manager
                                            </p>
                                            <p className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                                                {b.manager_profile?.full_name ?? "..."}
                                            </p>
                                            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                {b.manager_user?.email ?? "..."} · {b.manager_user?.phone ?? "..."}
                                            </p>
                                        </div>

                                        {/* Access key */}
                                        {b.access_key && (
                                            <div
                                                className="rounded-lg p-3"
                                                style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}
                                            >
                                                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--brand)" }}>
                                                    Linked access key
                                                </p>
                                                <p className="font-mono text-[11px] font-medium" style={{ color: "var(--foreground)" }}>
                                                    {maskKeyCode(b.access_key.key_code)}
                                                </p>
                                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                    {b.access_key.key_type === "LIFETIME" ? "Lifetime" : "Trial"} ·{" "}
                                                    Expires: {b.access_key.expires_at ? formatDate(b.access_key.expires_at) : "Never"}
                                                </p>
                                            </div>
                                        )}

                                        {/* Channel partner */}
                                        {b.channel_partner && (
                                            <div
                                                className="rounded-lg p-3"
                                                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}
                                            >
                                                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#d97706" }}>
                                                    Channel partner
                                                </p>
                                                <p className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                                                    {b.channel_partner.profile.full_name}
                                                </p>
                                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                    Valid from {formatDate(b.channel_partner.valid_from)}
                                                    {b.channel_partner.valid_to ? ` → ${formatDate(b.channel_partner.valid_to)}` : " · No expiry"}
                                                </p>
                                            </div>
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
                            ? "No businesses selected for deletion."
                            : `${toDelete} of ${businesses.length} business${businesses.length !== 1 ? "es" : ""} will be permanently deleted.`}
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="h-[42px] flex-1 rounded-xl border text-[13px] font-medium transition-all"
                            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={toDelete === 0}
                            className="h-[42px] flex-1 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: "#ef4444" }}
                            onMouseEnter={(e) => { if (toDelete > 0) e.currentTarget.style.background = "#dc2626"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#ef4444"; }}
                        >
                            Delete {toDelete > 0 ? `${toDelete} business${toDelete !== 1 ? "es" : ""}` : ""}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function XIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}