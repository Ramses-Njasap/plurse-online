"use client";

/* ─────────────────────────────────────────────────────────────────
   KeyDeliveryModal
   Shown immediately after successful key creation on the download page.

   - Auto-downloads a .txt file containing the key on mount
   - Copy-to-clipboard button with visual confirmation
   - Warning: this is the only time the full key is shown
   ───────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import type { AccessKey } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";

interface KeyDeliveryModalProps {
    accessKey: AccessKey;
    platform: string;   // e.g. "Linux" — shown in copy tip
    onClose: () => void;
}

export function KeyDeliveryModal({ accessKey, platform, onClose }: KeyDeliveryModalProps) {
    const [copied, setCopied] = useState(false);

    /* ── Auto-download .txt on mount ── */
    useEffect(() => {
        downloadKeyFile(accessKey);
    }, []);

    /* ── ESC to close ── */
    useEffect(() => {
        function handler(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    /* ── Lock scroll ── */
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(accessKey.key_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            /* Fallback for browsers without clipboard API */
            const ta = document.createElement("textarea");
            ta.value = accessKey.key_code;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    }

    function handleRedownload() {
        downloadKeyFile(accessKey);
    }

    return (
        <>
            {/* Scrim */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center px-5"
                style={{
                    background: "rgba(15,23,42,0.55)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    animation: "scrimFadeIn 250ms ease both",
                }}
                onClick={onClose}
            >
                {/* Panel */}
                <div
                    className="relative flex w-full flex-col"
                    style={{
                        maxWidth: "480px",
                        background: "var(--surface)",
                        borderRadius: "20px",
                        padding: "36px 32px 32px",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.2), 0 4px 16px rgba(15,23,42,0.08)",
                        animation: "modalSlideUp 280ms cubic-bezier(0.22,1,0.36,1) both",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute flex items-center justify-center rounded-lg transition-all"
                        style={{
                            top: "16px", right: "16px",
                            width: "28px", height: "28px",
                            background: "var(--surface-muted)",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--brand-light)";
                            e.currentTarget.style.color = "var(--brand)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--surface-muted)";
                            e.currentTarget.style.color = "var(--text-muted)";
                        }}
                        aria-label="Close"
                    >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Success icon */}
                    <div
                        className="mb-5 flex items-center justify-center self-start rounded-2xl"
                        style={{
                            width: "48px", height: "48px",
                            background: "rgba(34,197,94,0.12)",
                            border: "1px solid rgba(34,197,94,0.2)",
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h3
                        className="mb-1.5 font-bold tracking-[-0.02em]"
                        style={{ fontSize: "20px", color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Your activation key is ready.
                    </h3>
                    <p
                        className="mb-6 text-[14px] leading-[1.7]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        A text file with your key has been downloaded automatically.
                        Copy the key below and paste it when Plurse asks for activation on {platform}.
                    </p>

                    {/* Warning banner */}
                    <div
                        className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3 text-[12.5px] leading-relaxed"
                        style={{
                            background: "rgba(245,158,11,0.08)",
                            border: "1px solid rgba(245,158,11,0.22)",
                            color: "#92400e",
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ marginTop: "1px", flexShrink: 0 }}
                        >
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>
                            <strong>Save this key now.</strong> For security, it won't be shown again in full after you close this window.
                        </span>
                    </div>

                    {/* Key display */}
                    <div
                        className="mb-2 overflow-hidden rounded-xl"
                        style={{ border: "1px solid var(--border)" }}
                    >
                        {/* Key type + meta strip */}
                        <div
                            className="flex items-center justify-between px-4 py-2.5"
                            style={{
                                background: "var(--surface-muted)",
                                borderBottom: "1px solid var(--border)",
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                                    style={
                                        accessKey.key_type === "lifetime"
                                            ? { background: "rgba(59,130,246,0.10)", color: "#3b82f6" }
                                            : { background: "rgba(245,158,11,0.10)", color: "#d97706" }
                                    }
                                >
                                    {accessKey.key_type}
                                </span>
                                <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                    {new Intl.NumberFormat("fr-CM", {
                                        style: "currency", currency: "XAF", maximumFractionDigits: 0,
                                    }).format(accessKey.amount)}
                                </span>
                            </div>
                            <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                ID: <span className="font-mono">{accessKey.id.slice(0, 12)}…</span>
                            </span>
                        </div>

                        {/* Key code */}
                        <div
                            className="flex items-center justify-between gap-3 px-4 py-4"
                            style={{ background: "var(--surface)" }}
                        >
                            <code
                                className="flex-1 break-all font-mono text-[14px] font-semibold tracking-wide"
                                style={{ color: "var(--foreground)" }}
                            >
                                {accessKey.key_code}
                            </code>

                            {/* Copy button */}
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all"
                                style={
                                    copied
                                        ? { background: "rgba(34,197,94,0.12)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }
                                        : { background: "var(--brand-light)", color: "var(--brand)", border: "1px solid rgba(59,130,246,0.2)" }
                                }
                            >
                                {copied ? (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Re-download nudge */}
                    <p className="mb-6 text-center text-[12px]" style={{ color: "var(--text-subtle)" }}>
                        Didn't get the file?{" "}
                        <button
                            type="button"
                            onClick={handleRedownload}
                            className="font-medium underline underline-offset-2 transition-colors"
                            style={{ color: "var(--brand)", background: "none", border: "none", cursor: "pointer" }}
                        >
                            Download again
                        </button>
                    </p>

                    {/* Done button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl py-3.5 text-[14.5px] font-semibold text-white transition-all"
                        style={{ background: "var(--brand)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                    >
                        Done — continue to activation
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scrimFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────
   downloadKeyFile — generates and triggers a .txt download
   ───────────────────────────────────────────────────────────────── */
function downloadKeyFile(key: AccessKey) {
    const lines = [
        "═══════════════════════════════════════════",
        "  PLURSE ACTIVATION KEY",
        "═══════════════════════════════════════════",
        "",
        `  Key code   : ${key.key_code}`,
        `  Key type   : ${key.key_type}`,
        `  Key ID     : ${key.id}`,
        `  Amount     : ${key.amount.toLocaleString()} XAF`,
        `  Created    : ${new Date(key.created_on).toUTCString()}`,
        "",
        "───────────────────────────────────────────",
        "  IMPORTANT",
        "───────────────────────────────────────────",
        "  Keep this file safe. Your activation key",
        "  is required to run Plurse and will not   ",
        "  be shown again in full after first view. ",
        "",
        "  To activate: open Plurse → Enter key     ",
        "  when prompted on first launch.           ",
        "",
        "  Support: support@plurse.com              ",
        "═══════════════════════════════════════════",
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `plurse-activation-key-${key.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}