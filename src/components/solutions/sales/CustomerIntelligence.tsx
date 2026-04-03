// CustomerIntelligence.tsx — Zone 2

import { CUSTOMER_SEGMENTS } from "@/data/solutions/sales/data";


const CustomerIntelligence = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-12 md:gap-20"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: text */}
                <div className="flex flex-col">
                    <p
                        className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
                        style={{ color: "var(--brand)" }}
                    >
                        Customer Tracking
                    </p>
                    <h2
                        className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        Know your customers
                        <br />
                        <span style={{ color: "var(--brand)" }}>by name — and by habit.</span>
                    </h2>
                    <p
                        className="text-[15px] leading-[1.75] mb-8"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Customer tracking is optional — but for businesses that use it,
                        it transforms how they sell. Know who buys most, what they buy,
                        how often they come back, and who to call when you need to move stock fast.
                    </p>

                    {/* Segments */}
                    <div className="flex flex-col gap-4">
                        {CUSTOMER_SEGMENTS.map((seg, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-xl"
                                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                            >
                                <div
                                    className="flex items-center justify-center rounded-lg shrink-0"
                                    style={{
                                        width: "34px",
                                        height: "34px",
                                        background: "var(--brand-light)",
                                        border: "1px solid rgba(59,130,246,0.2)",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "var(--brand)",
                                        fontFamily: "var(--font-geist-mono)",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div>
                                    <p className="text-[13.5px] font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                                        {seg.label}
                                    </p>
                                    <p className="text-[12.5px] leading-[1.6] mb-1" style={{ color: "var(--text-muted)" }}>
                                        {seg.desc}
                                    </p>
                                    <p
                                        className="text-[11px] font-medium"
                                        style={{
                                            color: "var(--brand)",
                                            fontFamily: "var(--font-geist-mono)",
                                            background: "var(--brand-light)",
                                            padding: "2px 7px",
                                            borderRadius: "4px",
                                            display: "inline-block",
                                        }}
                                    >
                                        e.g. {seg.example}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: image */}
                <div
                    className="relative rounded-2xl overflow-hidden w-full"
                    style={{
                        aspectRatio: "4/3",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.1), 0 4px 16px rgba(59,130,246,0.06)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=85"
                        alt="Customer relationship management and tracking"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
                    />

                    {/* Floating optional badge */}
                    <div
                        className="absolute flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{
                            top: "16px",
                            right: "16px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                        }}
                    >
                        <span
                            style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                background: "#10b981", flexShrink: 0,
                            }}
                        />
                        <span className="text-[11px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Optional feature
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CustomerIntelligence;