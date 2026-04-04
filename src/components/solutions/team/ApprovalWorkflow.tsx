// ApprovalWorkflow.tsx — Zone 4 — The signature visual
// Price override approval chain — minimal, clean mockup

import { APPROVAL_REQUEST } from "@/data/solutions/team/data";


const ApprovalWorkflow = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: approval mockup */}
                <div
                    className="flex flex-col rounded-2xl overflow-hidden w-full"
                    style={{ border: "1px solid var(--border)", background: "var(--background)", boxShadow: "0 16px 48px rgba(15,23,42,0.08)" }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-5 py-3.5"
                        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-muted)" }}
                    >
                        <div className="flex items-center gap-2">
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fc5c57" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fdbc2c" }} />
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#33c748" }} />
                        </div>
                        <span className="text-[11px] font-medium" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}>
                            Approval Request
                        </span>
                        <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                                background: "rgba(245,158,11,0.08)",
                                color: "#f59e0b",
                                border: "1px solid rgba(245,158,11,0.2)",
                            }}
                        >
                            Pending
                        </span>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col gap-5">
                        {/* Requester */}
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center rounded-full text-[12px] font-bold shrink-0"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    background: "var(--brand-light)",
                                    color: "var(--brand)",
                                    border: "1px solid rgba(59,130,246,0.2)",
                                }}
                            >
                                {APPROVAL_REQUEST.requestedBy[0]}
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                                    {APPROVAL_REQUEST.requestedBy}
                                    <span
                                        className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded"
                                        style={{ background: "var(--surface-muted)", color: "var(--text-subtle)", border: "1px solid var(--border)" }}
                                    >
                                        {APPROVAL_REQUEST.role}
                                    </span>
                                </p>
                                <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                    {APPROVAL_REQUEST.time}
                                </p>
                            </div>
                        </div>

                        {/* Sale details */}
                        <div className="flex flex-col gap-2" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                            {[
                                { l: "Action", v: APPROVAL_REQUEST.action },
                                { l: "Product", v: APPROVAL_REQUEST.product },
                                { l: "Normal price", v: APPROVAL_REQUEST.normalPrice },
                                { l: "Requested at", v: APPROVAL_REQUEST.requestedAt },
                                { l: "Margin impact", v: APPROVAL_REQUEST.marginImpact },
                            ].map(row => (
                                <div
                                    key={row.l}
                                    className="flex items-start justify-between gap-4"
                                    style={{ paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}
                                >
                                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{row.l}</span>
                                    <span
                                        className="text-[12px] font-semibold text-right"
                                        style={{ color: row.l === "Margin impact" ? "#f59e0b" : "var(--foreground)" }}
                                    >
                                        {row.v}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Reason */}
                        <div
                            className="rounded-xl p-4"
                            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                        >
                            <p className="text-[10px] font-bold tracking-[0.1em] uppercase mb-1.5" style={{ color: "var(--text-subtle)" }}>
                                Reason provided
                            </p>
                            <p className="text-[12.5px] leading-[1.6]" style={{ color: "var(--foreground)" }}>
                                {APPROVAL_REQUEST.reason}
                            </p>
                        </div>

                        {/* Approval actions */}
                        <div className="flex gap-3">
                            <button
                                className="flex-1 rounded-lg font-semibold text-[13px] py-2.5"
                                style={{ background: "var(--brand)", color: "white", border: "none", cursor: "pointer" }}
                            >
                                Approve
                            </button>
                            <button
                                className="flex-1 rounded-lg font-semibold text-[13px] py-2.5"
                                style={{
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                    border: "1px solid var(--border-strong)",
                                    cursor: "pointer",
                                }}
                            >
                                Reject
                            </button>
                        </div>

                        <p className="text-[11px] text-center" style={{ color: "var(--text-subtle)" }}>
                            Approver: {APPROVAL_REQUEST.approver}
                        </p>
                    </div>
                </div>

                {/* Right: text */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Approval Workflow
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Your rules enforced,
                        <br /><span style={{ color: "var(--brand)" }}>even when you're not there.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-6" style={{ color: "var(--text-muted)" }}>
                        When a sale goes below your minimum margin threshold, Plurse
                        stops the transaction, flags it, and routes it to a manager
                        for approval — automatically.
                    </p>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        The cashier provides a reason. The manager reviews and approves
                        or rejects. Every step is logged. Nothing slips through.
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            "Margin threshold configurable per business",
                            "Approval request includes reason and full sale details",
                            "Approved, rejected and pending states all logged",
                            "Manager notified immediately when a request is raised",
                        ].map((c, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span
                                    className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                                    style={{
                                        width: "20px", height: "20px",
                                        background: "var(--brand-light)",
                                        border: "1px solid rgba(59,130,246,0.2)",
                                    }}
                                >
                                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8l4 4 6-7" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-[13.5px] leading-[1.6]" style={{ color: "var(--foreground)" }}>{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ApprovalWorkflow;