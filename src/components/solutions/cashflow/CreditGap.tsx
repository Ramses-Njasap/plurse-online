// CreditGap.tsx — Zone 4
// Outstanding credit vs collected revenue

import { CREDIT_GAP } from "@/data/solutions/cashflow/data";


const CreditGap = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: image */}
                <div
                    className="relative rounded-2xl overflow-hidden w-full"
                    style={{
                        aspectRatio: "4/3",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.1)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=85"
                        alt="Business financial records and outstanding payments"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
                    />
                </div>

                {/* Right: text + credit gap visual */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        The Credit Gap
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Revenue earned.
                        <br /><span style={{ color: "var(--brand)" }}>Revenue collected. Not the same thing.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Most cashflow tools show credit sales as if they're already cash.
                        Plurse separates what you've actually collected from what you're still owed
                        — so you never confuse revenue with liquidity.
                    </p>

                    {/* Split bar */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                                Total Revenue: {CREDIT_GAP.totalRevenue}
                            </span>
                        </div>
                        <div className="w-full rounded-full overflow-hidden flex" style={{ height: "12px", background: "var(--border)" }}>
                            <div
                                style={{
                                    width: `${CREDIT_GAP.collectedPct}%`,
                                    height: "100%",
                                    background: "#10b981",
                                    borderRadius: "999px 0 0 999px",
                                    transition: "width 800ms ease",
                                }}
                            />
                            <div
                                style={{
                                    width: `${CREDIT_GAP.outstandingPct}%`,
                                    height: "100%",
                                    background: "#f59e0b",
                                    borderRadius: "0 999px 999px 0",
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-5 mt-2.5">
                            <div className="flex items-center gap-1.5">
                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    Collected ({CREDIT_GAP.collectedPct}%) — {CREDIT_GAP.collected}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    Outstanding ({CREDIT_GAP.outstandingPct}%) — {CREDIT_GAP.outstanding}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Debtor list */}
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-1" style={{ color: "var(--text-subtle)" }}>
                            Outstanding debtors
                        </p>
                        {CREDIT_GAP.debtors.map((d, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between px-4 py-3 rounded-xl"
                                style={{
                                    background: d.overdue ? "rgba(239,68,68,0.05)" : "var(--background)",
                                    border: `1px solid ${d.overdue ? "rgba(239,68,68,0.2)" : "var(--border)"}`,
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center justify-center rounded-full text-[11px] font-bold text-white shrink-0"
                                        style={{ width: "28px", height: "28px", background: "var(--brand)" }}
                                    >
                                        {d.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{d.name}</p>
                                        <p className="text-[11px]" style={{ color: d.overdue ? "#ef4444" : "var(--text-subtle)" }}>
                                            Due: {d.due} {d.overdue ? "· OVERDUE" : ""}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className="text-[13px] font-bold"
                                    style={{ color: d.overdue ? "#ef4444" : "var(--foreground)", fontFamily: "var(--font-geist-mono)" }}
                                >
                                    {d.owed}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreditGap;