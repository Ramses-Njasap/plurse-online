// AboutPillars.tsx — Zone 3
// Four pillars of what Plurse is building — numbered, editorial

import { PILLARS } from "@/data/about/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Pillars = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ minHeight: SECTION_MIN_H, background: "var(--background)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center" }}
        >
            <div className="max-w-6xl mx-auto w-full">

                {/* Header */}
                <div className="mb-16">
                    <p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                        style={{ color: "var(--brand)" }}
                    >
                        What we're building
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <h2
                            className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.12]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
                        >
                            Four pillars.
                            <br />
                            <span style={{ color: "var(--brand)" }}>One platform.</span>
                        </h2>
                        <p
                            className="text-[14px] leading-[1.7] sm:text-right"
                            style={{ color: "var(--text-muted)", maxWidth: "320px", margin: 0, flexShrink: 0 }}
                        >
                            Plurse is growing toward becoming the most complete business
                            platform in Africa — software, intelligence, education and community.
                        </p>
                    </div>
                </div>

                {/* Pillars grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0" style={{ border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
                    {PILLARS.map((pillar, i) => (
                        <div
                            key={pillar.id}
                            className="flex flex-col p-7 sm:p-8 gap-5"
                            style={{
                                borderRight: i < PILLARS.length - 1 ? "1px solid var(--border)" : "none",
                                background: "var(--surface)",
                                position: "relative",
                            }}
                        >
                            {/* Number */}
                            <span
                                className="font-bold"
                                style={{
                                    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                                    color: i === 0 ? "var(--brand)" : "var(--border-strong)",
                                    fontFamily: "var(--font-geist-mono)",
                                    lineHeight: 1,
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                {pillar.number}
                            </span>

                            {/* Label */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <p
                                        className="text-[15px] font-bold tracking-[-0.01em]"
                                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                                    >
                                        {pillar.label}
                                    </p>
                                </div>
                                <p
                                    className="text-[13.5px] leading-[1.7]"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {pillar.desc}
                                </p>
                            </div>

                            {/* Status badge */}
                            <div className="mt-auto">
                                {pillar.status === "live" ? (
                                    <span
                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                                        style={{
                                            background: "rgba(16,185,129,0.08)",
                                            border: "1px solid rgba(16,185,129,0.2)",
                                            color: "#10b981",
                                        }}
                                    >
                                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                                        Available now
                                    </span>
                                ) : (
                                    <span
                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                                        style={{
                                            background: "var(--brand-light)",
                                            border: "1px solid rgba(59,130,246,0.2)",
                                            color: "var(--brand)",
                                        }}
                                    >
                                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--brand)", display: "inline-block" }} />
                                        Coming soon
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Pillars;