"use client";

/* ─────────────────────────────────────────────────────────────────
   Shared modal primitives — shell, label, input, toggle, field row
   ───────────────────────────────────────────────────────────────── */

import { useEffect } from "react";

/* ── Modal shell ── */
interface ModalShellProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
    width?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    /** Optional left-side back button */
    onBack?: () => void;
    /** Current / total steps for the step indicator */
    step?: number;
    totalSteps?: number;
}

export function ModalShell({
    title, subtitle, onClose, onBack,
    width = "480px", children, footer,
    step, totalSteps,
}: ModalShellProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50"
                style={{ background: "rgba(0,0,0,0.45)" }}
                // onClick={onClose}
            />

            {/* Panel */}
            <div
                className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl shadow-2xl"
                style={{ maxWidth: width, background: "var(--surface)" }}
            >
                {/* Header */}
                <div
                    className="flex shrink-0 items-start justify-between border-b px-6 py-5"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
                                style={{ color: "var(--text-muted)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                aria-label="Back"
                            >
                                <ChevronLeftIcon />
                            </button>
                        )}
                        <div>
                            {step !== undefined && totalSteps !== undefined && (
                                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.10em]" style={{ color: "var(--brand)" }}>
                                    Step {step} of {totalSteps}
                                </p>
                            )}
                            <h3 className="text-[16px] font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
                        style={{ color: "var(--text-subtle)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        aria-label="Close"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Step progress bar */}
                {step !== undefined && totalSteps !== undefined && (
                    <div className="flex shrink-0 gap-1 px-6 pt-3">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[2px] flex-1 rounded-full transition-all duration-500"
                                style={{ background: i < step ? "var(--brand)" : "rgba(15,15,15,0.10)" }}
                            />
                        ))}
                    </div>
                )}

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="shrink-0 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
}

/* ── Field wrapper ── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[12px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                {label}
            </label>
            {children}
            {hint && <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{hint}</p>}
        </div>
    );
}

/* ── Text input ── */
export function TextInput({
    value, onChange, placeholder, disabled = false, type = "text", readOnly = false,
}: {
    value: string;
    onChange?: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className="h-[42px] w-full rounded-lg border px-3 text-[13px] transition-colors focus:outline-none disabled:opacity-50"
            style={{
                borderColor: "var(--border)",
                background: readOnly || disabled ? "var(--surface-muted)" : "white",
                color: "var(--foreground)",
                cursor: readOnly ? "default" : "text",
            }}
            onFocus={(e) => { if (!readOnly && !disabled) e.currentTarget.style.borderColor = "var(--brand)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
    );
}

/* ── Toggle ── */
export function Toggle({
    checked, onChange, disabled = false,
}: {
    checked: boolean;
    onChange?: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: checked ? "var(--brand)" : "var(--border)" }}
        >
            <span
                className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
            />
        </button>
    );
}

/* ── Read-only info row (for summary display) ── */
export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>{label}</span>
            <span className="text-right text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{value}</span>
        </div>
    );
}

/* ── Primary + secondary button row ── */
export function ButtonRow({
    primary, secondary, loading = false,
}: {
    primary: { label: string; onClick: () => void; disabled?: boolean };
    secondary?: { label: string; onClick: () => void };
    loading?: boolean;
}) {
    return (
        <div className="flex gap-3">
            {secondary && (
                <button
                    type="button"
                    onClick={secondary.onClick}
                    className="h-[42px] flex-1 rounded-xl border text-[13px] font-medium transition-all"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                >
                    {secondary.label}
                </button>
            )}
            <button
                type="button"
                onClick={primary.onClick}
                disabled={primary.disabled || loading}
                className="h-[42px] flex-1 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--brand)" }}
                onMouseEnter={(e) => { if (!primary.disabled && !loading) e.currentTarget.style.background = "var(--brand-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--brand)"; }}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Spinner /> Processing…
                    </span>
                ) : primary.label}
            </button>
        </div>
    );
}

/* ── Icons ── */
export function XIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}
export function ChevronLeftIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}
export function Spinner({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
}