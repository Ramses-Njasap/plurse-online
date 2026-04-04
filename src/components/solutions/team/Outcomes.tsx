// Outcomes.tsx — Zone 6

"use client";
import { OUTCOMES } from "@/data/solutions/team/data";


const Outcomes = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brand)" }}>
                        Why it matters
                    </p>
                    <h2
                        className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.025em] leading-[1.12]"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                    >
                        What team control does
                        <br className="hidden sm:block" />
                        <span style={{ color: "var(--brand)" }}> for your business.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {OUTCOMES.map((outcome, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-4 p-6 rounded-2xl"
                            style={{
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                transition: "border-color 200ms, box-shadow 200ms",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.3)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(59,130,246,0.08)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                            }}
                        >
                            <span
                                className="flex items-center justify-center rounded-xl text-[22px] self-start"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "var(--brand-light)",
                                    border: "1px solid rgba(59,130,246,0.18)",
                                }}
                            >
                                {outcome.icon}
                            </span>
                            <p className="text-[15px] font-bold tracking-[-0.01em]" style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}>
                                {outcome.title}
                            </p>
                            <p className="text-[13.5px] leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                                {outcome.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Outcomes;