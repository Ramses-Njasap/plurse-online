// src/components/dashboard/my/transactions/ViewTransactionModal.tsx

"use client";

import { useEffect } from "react";
import type { Transaction } from "@/types/users.types";
import {
    formatDateTime, formatAmount, describeTransaction,
} from "@/app/(dashboard)/dashboard/my/transactions/data/mockTransactions";
import { StatusBadge, TargetBadge, STATUS_STYLES } from "./TransactionBadges";

interface ViewTransactionModalProps {
    transaction: Transaction;
    onClose: () => void;
    onRetry: (t: Transaction) => void;
}

export function ViewTransactionModal({ transaction: t, onClose, onRetry }: ViewTransactionModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />

            {/* Panel */}
            <div
                className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-32px)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl shadow-2xl"
                style={{ background: "var(--surface)" }}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: STATUS_STYLES[t.status].background, color: STATUS_STYLES[t.status].color }}
                        >
                            <ReceiptIcon />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                                {describeTransaction(t)}
                            </h3>
                            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                {formatAmount(t.amount)}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        style={{ color: "var(--text-subtle)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        aria-label="Close"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                    {t.status === "Failed" && t.error_message && (
                        <div
                            className="rounded-xl border px-4 py-3 text-[12px]"
                            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)", color: "#dc2626" }}
                        >
                            <p className="font-semibold">Payment failed</p>
                            <p className="mt-0.5">{t.error_message}</p>
                        </div>
                    )}

                    <SubSection label="Payment">
                        <Row label="Transaction ID" value={<Mono>{t.id}</Mono>} />
                        <Row label="Status" value={<StatusBadge status={t.status} size="sm" />} />
                        <Row label="Amount" value={formatAmount(t.amount)} />
                        <Row label="Type" value={<TargetBadge target={t.target_entity} />} />
                        <Row label="Retries" value={t.retry_count} />
                        <Row label="Created" value={formatDateTime(t.created_on)} />
                        <Row label="Updated" value={formatDateTime(t.updated_on)} />
                    </SubSection>

                    <SubSection label="Related">
                        <Row label="Business" value={t.business?.name ?? "—"} />
                        <Row label="Business ID" value={t.business_id ? <Mono>{t.business_id}</Mono> : "—"} />
                        <Row label="Paid by (user ID)" value={t.user_id ? <Mono>{t.user_id}</Mono> : "—"} />
                    </SubSection>

                    <SubSection label="Payload">
                        {t.payload ? (
                            <pre
                                className="overflow-x-auto font-mono text-[11px] leading-relaxed"
                                style={{ color: "var(--foreground)" }}
                            >
                                {JSON.stringify(t.payload, null, 2)}
                            </pre>
                        ) : (
                            <p className="py-1 text-[12px]" style={{ color: "var(--text-subtle)" }}>No payload recorded.</p>
                        )}
                    </SubSection>
                </div>

                {/* Footer */}
                {t.status === "Failed" && (
                    <div className="flex shrink-0 justify-end gap-2 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 rounded-lg border px-3 text-[13px] font-medium transition-all"
                            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => onRetry(t)}
                            className="h-9 rounded-lg px-3 text-[13px] font-medium text-white transition-all"
                            style={{ background: "var(--brand)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                        >
                            Retry payment
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

/* ── Primitives ── */

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-subtle)" }}>
                {label}
            </p>
            <div
                className="space-y-1.5 rounded-xl p-3"
                style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
                {children}
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-0.5">
            <span className="shrink-0 text-[12px]" style={{ color: "var(--text-subtle)" }}>{label}</span>
            <span className="break-all text-right text-[12px] font-medium" style={{ color: "var(--foreground)" }}>{value}</span>
        </div>
    );
}

function Mono({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-[11px]">{children}</span>;
}

function ReceiptIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-1 .7-3-2-3 2-3-2-3 2-3-2z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>;
}
function XIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}