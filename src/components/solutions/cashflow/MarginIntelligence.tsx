// MarginIntelligence.tsx — Zone 5
// Cost price snapshots + margin per product + price override flags

import { MARGIN_DATA, MARGIN_STATUS_CONFIG } from "@/data/solutions/cashflow/data";


const MarginIntelligence = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: text */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Margin Intelligence
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Not just revenue.
                        <br /><span style={{ color: "var(--brand)" }}>Actual profit — per product.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-6" style={{ color: "var(--text-muted)" }}>
                        Plurse captures a cost price snapshot at the moment of every sale.
                        Even if you restock at a different price later, the margin on past
                        sales is always historically accurate.
                    </p>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        And when a sale goes below the minimum selling price, Plurse flags it,
                        requires a reason, and can escalate to a manager — protecting your
                        business at every transaction.
                    </p>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3">
                        {Object.values(MARGIN_STATUS_CONFIG).map((cfg, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-3 py-1"
                                style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                            >
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
                                {cfg.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: margin table mockup */}
                <div
                    className="flex flex-col rounded-2xl overflow-hidden"
                    style={{ border: "1px solid var(--border)", background: "var(--surface)", boxShadow: "0 16px 48px rgba(15,23,42,0.08)" }}
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
                            Margin per Sale
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Today</span>
                    </div>

                    {/* Column headers */}
                    <div
                        className="grid px-5 py-2.5"
                        style={{ gridTemplateColumns: "1fr auto auto auto", borderBottom: "1px solid var(--border)", background: "var(--background)" }}
                    >
                        {["Product", "Cost", "Sold at", "Margin"].map(h => (
                            <span key={h} className="text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--text-subtle)" }}>
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Rows */}
                    {MARGIN_DATA.map((row, i) => {
                        const cfg = MARGIN_STATUS_CONFIG[row.status as keyof typeof MARGIN_STATUS_CONFIG];
                        const isLast = i === MARGIN_DATA.length - 1;
                        return (
                            <div
                                key={i}
                                className="grid items-center px-5 py-3"
                                style={{
                                    gridTemplateColumns: "1fr auto auto auto",
                                    borderBottom: isLast ? "none" : "1px solid var(--border)",
                                    gap: "8px",
                                }}
                            >
                                <span className="text-[12px] font-medium truncate" style={{ color: "var(--foreground)" }}>
                                    {row.product}
                                </span>
                                <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", textAlign: "right" }}>
                                    {row.costSnapshot}
                                </span>
                                <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", textAlign: "right" }}>
                                    {row.soldAt}
                                </span>
                                <span
                                    className="text-[10px] font-bold rounded-full text-center"
                                    style={{
                                        padding: "3px 8px",
                                        background: cfg.bg,
                                        border: `1px solid ${cfg.border}`,
                                        color: cfg.color,
                                        fontFamily: "var(--font-geist-mono)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {row.margin}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default MarginIntelligence;