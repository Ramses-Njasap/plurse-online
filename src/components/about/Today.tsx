// AboutToday.tsx — Zone 4
// Where Plurse is today — honest, no fabricated stats

import { TODAY, VALUES } from "@/data/about/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Today = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ minHeight: SECTION_MIN_H, background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center" }}
        >
            <div
                className="max-w-6xl mx-auto w-full flex flex-col md:grid gap-12 md:gap-20 items-start"
                style={{ gridTemplateColumns: "1fr 1fr" }}
            >
                {/* Left: today */}
                <div className="flex flex-col">
                    <p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5"
                        style={{ color: "var(--brand)" }}
                    >
                        Where we are today
                    </p>

                    <h2
                        className="font-bold tracking-[-0.025em] leading-[1.12] mb-6"
                        style={{
                            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                            color: "var(--foreground)",
                            fontFamily: "var(--font-geist-sans)",
                        }}
                    >
                        {TODAY.headline}
                    </h2>

                    <p className="text-[15px] leading-[1.8] mb-8" style={{ color: "var(--text-muted)" }}>
                        {TODAY.body}
                    </p>

                    {/* Version + platform strip */}
                    <div
                        className="flex flex-wrap gap-3 p-5 rounded-2xl"
                        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                    >
                        <div
                            className="flex flex-col gap-0.5 pr-5"
                            style={{ borderRight: "1px solid var(--border)" }}
                        >
                            <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "var(--text-subtle)" }}>
                                Version
                            </span>
                            <span
                                className="text-[18px] font-bold"
                                style={{ color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                            >
                                {TODAY.version}
                            </span>
                        </div>
                        <div
                            className="flex flex-col gap-0.5 px-5"
                            style={{ borderRight: "1px solid var(--border)" }}
                        >
                            <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "var(--text-subtle)" }}>
                                Released
                            </span>
                            <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                                {TODAY.released}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5 pl-5">
                            <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "var(--text-subtle)" }}>
                                Platforms
                            </span>
                            <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                                {TODAY.platforms.join(" · ")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: values */}
                <div className="flex flex-col">
                    <p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6"
                        style={{ color: "var(--brand)" }}
                    >
                        What we believe
                    </p>

                    <div className="flex flex-col gap-0">
                        {VALUES.map((v, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-2 py-6"
                                style={{ borderBottom: i < VALUES.length - 1 ? "1px solid var(--border)" : "none" }}
                            >
                                <p
                                    className="text-[15px] font-bold tracking-[-0.01em]"
                                    style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                                >
                                    {v.label}
                                </p>
                                <p
                                    className="text-[13.5px] leading-[1.7]"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Today;