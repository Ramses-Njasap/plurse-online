// src/components/dashboard/my/transactions/TransactionRowMenu.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import type { Transaction } from "@/types/users.types";

interface TransactionRowMenuProps {
    transaction: Transaction;
    /** Open the menu upward — used for the last rows so it isn't clipped by the table container. */
    dropUp?: boolean;
    onView: (t: Transaction) => void;
    onRetry: (t: Transaction) => void;
    onCopyId: (t: Transaction) => void;
}

export function TransactionRowMenu({ transaction, dropUp = false, onView, onRetry, onCopyId }: TransactionRowMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative flex justify-end">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={{ color: "var(--text-subtle)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label="Row actions"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                </svg>
            </button>

            {open && (
                <div
                    className={`absolute right-0 z-50 w-44 overflow-hidden rounded-xl border py-1 shadow-lg ${dropUp ? "bottom-8" : "top-8"
                        }`}
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                    <MenuItem icon={<EyeIcon />} label="View details" onClick={() => { onView(transaction); setOpen(false); }} />
                    <MenuItem icon={<CopyIcon />} label="Copy transaction ID" onClick={() => { onCopyId(transaction); setOpen(false); }} />
                    {transaction.status === "Failed" && (
                        <>
                            <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
                            <MenuItem icon={<RetryIcon />} label="Retry payment" onClick={() => { onRetry(transaction); setOpen(false); }} brand />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function MenuItem({ icon, label, onClick, brand = false }: {
    icon: React.ReactNode; label: string; onClick: () => void; brand?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors"
            style={{ color: brand ? "var(--brand)" : "var(--foreground)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = brand ? "var(--brand-light)" : "var(--surface-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            {icon}{label}
        </button>
    );
}

function EyeIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function CopyIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}
function RetryIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>;
}