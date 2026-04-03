"use client";

// CreditInstallments.tsx — Zone 4
// The signature zone — credit decision prompt + installment tracker

import { CREDIT_PROMPT, INSTALLMENT_EXAMPLE } from "@/data/solutions/sales/data";


const CreditInstallments = () => {
    const inst = INSTALLMENT_EXAMPLE;
    const paidPct = Math.round((inst.paid / inst.total) * 100);

    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-14">
                    <p
                        className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
                        style={{ color: "var(--brand)" }}
                    >
                        Credit & Installments
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <h2
                            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
                        >
                            Sell on credit — safely.
                            <br />
                            <span style={{ color: "var(--brand)" }}>Get paid — reliably.</span>
                        </h2>
                        <p
                            className="text-[14px] leading-[1.7] sm:text-right"
                            style={{ color: "var(--text-muted)", maxWidth: "300px", margin: 0, flexShrink: 0 }}
                        >
                            Plurse protects your margins before the sale and tracks every
                            payment after it — including automated reminders for both parties.
                        </p>
                    </div>
                </div>

                {/* Two mockups side by side */}
                <div
                    className="flex flex-col md:grid gap-8"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                >

                    {/* ── Left: Credit decision prompt ── */}
                    <div
                        className="flex flex-col rounded-2xl overflow-hidden"
                        style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                    >
                        {/* Mock header bar */}
                        <div
                            className="flex items-center gap-2 px-5 py-3"
                            style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
                        >
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fc5c57" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fdbc2c" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#33c748" }} />
                            <span
                                className="text-[11px] font-medium ml-2"
                                style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
                            >
                                New Credit Sale
                            </span>
                        </div>

                        <div className="p-5 sm:p-6 flex flex-col gap-5">
                            {/* Sale summary */}
                            <div className="flex flex-col gap-2">
                                {[
                                    { l: "Customer", v: CREDIT_PROMPT.customer },
                                    { l: "Product", v: CREDIT_PROMPT.product },
                                    { l: "Quantity", v: String(CREDIT_PROMPT.qty) },
                                    { l: "Sale value", v: CREDIT_PROMPT.totalValue },
                                    { l: "Deadline", v: CREDIT_PROMPT.deadline },
                                ].map(row => (
                                    <div
                                        key={row.l}
                                        className="flex items-center justify-between"
                                        style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}
                                    >
                                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{row.l}</span>
                                        <span className="text-[12.5px] font-semibold" style={{ color: "var(--foreground)" }}>
                                            {row.v}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Margin comparison */}
                            <div
                                className="flex items-center justify-between gap-4 rounded-xl p-4"
                                style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
                            >
                                <div className="text-center">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: "var(--text-subtle)" }}>
                                        Normal margin
                                    </p>
                                    <p className="text-[20px] font-bold" style={{ color: "#10b981", fontFamily: "var(--font-geist-mono)" }}>
                                        {CREDIT_PROMPT.normalMargin}
                                    </p>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-subtle)", flexShrink: 0 }}>
                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="text-center">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: "var(--text-subtle)" }}>
                                        Credit margin
                                    </p>
                                    <p className="text-[20px] font-bold" style={{ color: "#f59e0b", fontFamily: "var(--font-geist-mono)" }}>
                                        {CREDIT_PROMPT.creditMargin}
                                    </p>
                                </div>
                            </div>

                            {/* Warning */}
                            <div
                                className="flex items-start gap-3 rounded-xl p-4"
                                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#f59e0b", flexShrink: 0, marginTop: "1px" }}>
                                    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-[12.5px] leading-[1.6]" style={{ color: "var(--foreground)" }}>
                                    {CREDIT_PROMPT.warningMessage}
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 rounded-lg font-semibold text-[13px] py-2.5"
                                    style={{ background: "var(--brand)", color: "white", border: "none", cursor: "pointer" }}
                                >
                                    Proceed anyway
                                </button>
                                <button
                                    className="flex-1 rounded-lg font-semibold text-[13px] py-2.5"
                                    style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border-strong)", cursor: "pointer" }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Installment tracker ── */}
                    <div
                        className="flex flex-col rounded-2xl overflow-hidden"
                        style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                    >
                        {/* Mock header */}
                        <div
                            className="flex items-center gap-2 px-5 py-3"
                            style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
                        >
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fc5c57" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fdbc2c" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#33c748" }} />
                            <span
                                className="text-[11px] font-medium ml-2"
                                style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
                            >
                                Credit Repayment
                            </span>
                        </div>

                        <div className="p-5 sm:p-6 flex flex-col gap-5">
                            {/* Customer + total */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>
                                        {inst.customer}
                                    </p>
                                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                                        Deadline: {inst.deadline}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Total owed</p>
                                    <p
                                        className="text-[16px] font-bold"
                                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-mono)" }}
                                    >
                                        {inst.currency} {inst.total.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-[11px] font-semibold" style={{ color: "#10b981" }}>
                                        {inst.currency} {inst.paid.toLocaleString()} paid
                                    </span>
                                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                        {paidPct}% complete
                                    </span>
                                </div>
                                <div
                                    className="w-full rounded-full overflow-hidden"
                                    style={{ height: "8px", background: "var(--border)" }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${paidPct}%`,
                                            background: "linear-gradient(90deg, #10b981, #3b82f6)",
                                            borderRadius: "999px",
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                        Remaining: {inst.currency} {inst.remaining.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Installment timeline */}
                            <div className="flex flex-col gap-3">
                                {inst.installments.map((ip, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                                        style={{
                                            background: ip.done ? "rgba(16,185,129,0.06)" : "var(--surface)",
                                            border: `1px solid ${ip.done ? "rgba(16,185,129,0.2)" : "var(--border)"}`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Check / circle */}
                                            <div
                                                className="flex items-center justify-center rounded-full"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    background: ip.done ? "#10b981" : "var(--border)",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {ip.done ? (
                                                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                                        <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-subtle)" }} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                                                    {ip.label}
                                                </p>
                                                <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{ip.date}</p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-[12.5px] font-bold"
                                            style={{
                                                color: ip.done ? "#10b981" : "var(--foreground)",
                                                fontFamily: "var(--font-geist-mono)",
                                            }}
                                        >
                                            {inst.currency} {ip.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Reminder note */}
                            <div
                                className="flex items-center gap-3 rounded-xl px-4 py-3"
                                style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand)", flexShrink: 0 }}>
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-[12px]" style={{ color: "var(--brand)" }}>
                                    Auto-reminder scheduled for {inst.installments[2].date} — sent to both parties
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreditInstallments;