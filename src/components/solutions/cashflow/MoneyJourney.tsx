// MoneyJourney.tsx — Zone 2
// Horizontal flow diagram showing the complete money journey

import { MONEY_JOURNEY } from "@/data/solutions/cashflow/data";

const TYPE_COLORS = {
    cashin: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
    cashout: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
    transfer: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
    neutral: { color: "var(--foreground)", bg: "var(--surface-muted)", border: "var(--border-strong)" },
};


const MoneyJourney = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-14">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        The Full Picture
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <h2
                            className="text-[2rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
                        >
                            How money moves
                            <br /><span style={{ color: "var(--brand)" }}>through your business.</span>
                        </h2>
                        <p
                            className="text-[14px] leading-[1.7] sm:text-right"
                            style={{ color: "var(--text-muted)", maxWidth: "300px", margin: 0, flexShrink: 0 }}
                        >
                            Plurse sits at every step — recording every purchase, sale,
                            payment and transfer so nothing falls through the cracks.
                        </p>
                    </div>
                </div>

                {/* Flow diagram — horizontal on desktop, vertical on mobile */}
                <div className="flex flex-col md:flex-row items-center gap-0 mb-16">
                    {MONEY_JOURNEY.map((step, i) => {
                        const cfg = TYPE_COLORS[step.type as keyof typeof TYPE_COLORS];
                        const isLast = i === MONEY_JOURNEY.length - 1;
                        return (
                            <div key={step.id} className="flex flex-col md:flex-row items-center flex-1 w-full">
                                {/* Step card */}
                                <div
                                    className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl w-full md:flex-1"
                                    style={{
                                        background: cfg.bg,
                                        border: `1px solid ${cfg.border}`,
                                        minHeight: "140px",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span className="text-[28px]">{step.icon}</span>
                                    <div>
                                        <p
                                            className="text-[13.5px] font-bold mb-1"
                                            style={{ color: cfg.color, fontFamily: "var(--font-geist-sans)" }}
                                        >
                                            {step.label}
                                        </p>
                                        <p className="text-[12px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>
                                            {step.desc}
                                        </p>
                                    </div>
                                    {/* Type badge */}
                                    <span
                                        className="text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                                    >
                                        {step.type}
                                    </span>
                                </div>

                                {/* Arrow connector — hidden on last */}
                                {!isLast && (
                                    <div
                                        className="flex items-center justify-center"
                                        style={{ padding: "0 8px", flexShrink: 0 }}
                                    >
                                        <svg
                                            className="rotate-90 md:rotate-0"
                                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            style={{ color: "var(--border-strong)" }}
                                        >
                                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Plurse sits in the middle callout */}
                <div
                    className="flex flex-col sm:flex-row items-center gap-4 p-6 sm:p-8 rounded-2xl text-center sm:text-left"
                    style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                    <div
                        className="flex items-center justify-center rounded-2xl shrink-0"
                        style={{
                            width: "56px",
                            height: "56px",
                            background: "var(--brand)",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: 800,
                            fontFamily: "var(--font-geist-sans)",
                        }}
                    >
                        P
                    </div>
                    <div>
                        <p className="text-[15px] font-bold mb-1" style={{ color: "var(--foreground)" }}>
                            Plurse records every step automatically.
                        </p>
                        <p className="text-[13.5px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>
                            Every purchase, sale, payment and transfer is logged in real time.
                            You see the full picture — not just the parts that are convenient to show.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MoneyJourney;