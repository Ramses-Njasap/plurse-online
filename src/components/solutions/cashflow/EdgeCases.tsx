// EdgeCases.tsx — Zone 6
// In-kind payments, cancellations, transfers, price overrides

import { EDGE_CASES } from "@/data/solutions/cashflow/data";


const EdgeCases = () => {
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
                        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=85"
                        alt="Business handling complex transactions and edge cases"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
                    />
                    {/* Floating badge */}
                    <div
                        className="absolute flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{
                            bottom: "16px",
                            left: "16px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                        }}
                    >
                        <span className="text-[16px]">🛡️</span>
                        <span className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Full audit trail, always
                        </span>
                    </div>
                </div>

                {/* Right: text + edge case cards */}
                <div className="flex flex-col">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        The Messy Parts
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Business isn't always clean.
                        <br /><span style={{ color: "var(--brand)" }}>Plurse handles the rest.</span>
                    </h2>
                    <p className="text-[15px] leading-[1.75] mb-8" style={{ color: "var(--text-muted)" }}>
                        Refunds, in-kind payments, account transfers, price overrides —
                        real businesses deal with all of these. Plurse records them all
                        properly so your cashflow is always complete and honest.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {EDGE_CASES.map((ec, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-3 p-4 rounded-xl"
                                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                            >
                                <span className="text-[24px]">{ec.icon}</span>
                                <p className="text-[13.5px] font-bold" style={{ color: "var(--foreground)" }}>
                                    {ec.title}
                                </p>
                                <p className="text-[12.5px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>
                                    {ec.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EdgeCases;