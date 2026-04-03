// Hero.tsx — Zone 1
// Full-width centered hero with three ghosted background stats

"use client";
import Link from "next/link";
import { HERO_STATS } from "@/data/solutions/sales/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Hero = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 overflow-hidden"
            style={{ minHeight: SECTION_MIN_H, background: "var(--background)" }}
        >
            {/* ── Ghosted background stats ── */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden
            >
                <div className="flex items-center gap-8 sm:gap-16">
                    {HERO_STATS.map((s, i) => (
                        <span
                            key={i}
                            className="font-bold tracking-[-0.04em]"
                            style={{
                                fontSize: "clamp(4rem, 14vw, 11rem)",
                                color: "var(--brand)",
                                opacity: 0.045,
                                fontFamily: "var(--font-geist-sans)",
                                lineHeight: 1,
                            }}
                        >
                            {s.value}{s.suffix}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div
                className="relative max-w-6xl mx-auto flex flex-col items-center justify-center text-center"
                style={{ minHeight: SECTION_MIN_H, paddingTop: "clamp(3rem, 8vh, 5rem)", paddingBottom: "clamp(3rem, 8vh, 5rem)" }}
            >
                {/* Breadcrumb */}
                <div
                    className="flex items-center gap-2 mb-6"
                    style={{ fontSize: "12px", color: "var(--text-subtle)" }}
                >
                    <Link href="/solutions" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 500 }}>
                        Solutions
                    </Link>
                    <span>/</span>
                    <span>Sales Intelligence</span>
                </div>

                {/* Eyebrow */}
                <div
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 select-none"
                    style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                    <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
                    <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--brand)" }}>
                        Sales Intelligence
                    </span>
                </div>

                {/* Headline */}
                <h1
                    className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
                    style={{
                        fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
                        color: "var(--foreground)",
                        fontFamily: "var(--font-geist-sans)",
                        maxWidth: "760px",
                    }}
                >
                    Stop recording sales.
                    <br />
                    <span style={{ color: "var(--brand)" }}>Start understanding them.</span>
                </h1>

                {/* Sub */}
                <p
                    className="text-[15px] sm:text-[17px] leading-[1.75] mb-10"
                    style={{ color: "var(--text-muted)", maxWidth: "520px" }}
                >
                    Every sale, every customer, every payment method, every credit deal —
                    tracked, analysed and turned into decisions that grow your business.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                    <Link
                        href="/download"
                        className="btn-primary"
                        style={{ fontSize: "15px", padding: "0.75rem 1.75rem", borderRadius: "0.625rem", textDecoration: "none" }}
                    >
                        Get started
                    </Link>
                    <Link
                        href="/download"
                        className="inline-flex items-center font-medium rounded-xl"
                        style={{
                            fontSize: "15px", padding: "0.75rem 1.75rem",
                            border: "1px solid var(--border-strong)", color: "var(--foreground)",
                            textDecoration: "none", transition: "border-color 150ms, color 150ms",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--brand)";
                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-strong)";
                            (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                        }}
                    >
                        Download Plurse
                    </Link>
                </div>

                {/* Stat strip */}
                <div
                    className="flex flex-wrap items-center justify-center gap-8 sm:gap-14"
                    style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", width: "100%", maxWidth: "600px" }}
                >
                    {HERO_STATS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <span
                                className="font-bold tracking-[-0.03em]"
                                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                            >
                                {s.value}{s.suffix}
                            </span>
                            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;