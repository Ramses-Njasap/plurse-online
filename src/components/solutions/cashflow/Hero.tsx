// Hero.tsx — Zone 1
// Split layout — headline left, live summary card right

"use client";
import Link from "next/link";
import { HERO_SUMMARY } from "@/data/solutions/cashflow/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Hero = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8"
            style={{ minHeight: SECTION_MIN_H, background: "var(--background)" }}
        >
            <div
                className="max-w-6xl mx-auto flex flex-col md:grid md:items-center gap-10 md:gap-16"
                style={{
                    minHeight: SECTION_MIN_H,
                    gridTemplateColumns: "1fr 1fr",
                    paddingTop: "clamp(3rem, 8vh, 5rem)",
                    paddingBottom: "clamp(3rem, 8vh, 5rem)",
                }}
            >
                {/* ── Left: text ── */}
                <div className="flex flex-col">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6" style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
                        <Link href="/solutions" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 500 }}>
                            Solutions
                        </Link>
                        <span>/</span>
                        <span>Cash Flow Clarity</span>
                    </div>

                    {/* Eyebrow */}
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 self-start"
                        style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                        <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
                        <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--brand)" }}>
                            Cash Flow Clarity
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="font-bold tracking-[-0.03em] leading-[1.08] mb-5"
                        style={{
                            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                            color: "var(--foreground)",
                            fontFamily: "var(--font-geist-sans)",
                        }}
                    >
                        From first purchase
                        <br />to final payment.
                        <br />
                        <span style={{ color: "var(--brand)" }}>Every franc accounted for.</span>
                    </h1>

                    <p
                        className="text-[15px] sm:text-[16px] leading-[1.75] mb-8"
                        style={{ color: "var(--text-muted)", maxWidth: "460px" }}
                    >
                        Plurse tracks every cashin, cashout and transfer across your business —
                        from what you pay suppliers to what customers owe you — so you always
                        know your real financial position.
                    </p>

                    <div className="flex flex-wrap gap-3">
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
                </div>

                {/* ── Right: live summary card mockup ── */}
                <div
                    className="flex flex-col rounded-2xl overflow-hidden w-full"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 24px 64px rgba(15,23,42,0.1), 0 4px 16px rgba(59,130,246,0.06)",
                    }}
                >
                    {/* Card top bar */}
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
                            Cash Flow — November 2025
                        </span>
                        <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
                        >
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                            Live
                        </div>
                    </div>

                    {/* Summary grid */}
                    <div className="grid grid-cols-2 gap-0">
                        {Object.values(HERO_SUMMARY).map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-1 p-5"
                                style={{
                                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                                    borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none",
                                }}
                            >
                                <span className="text-[11px] font-medium" style={{ color: "var(--text-subtle)" }}>
                                    {item.label}
                                </span>
                                <span
                                    className="font-bold tracking-[-0.02em]"
                                    style={{
                                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                                        color: item.color,
                                        fontFamily: "var(--font-geist-mono)",
                                    }}
                                >
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Mini bar chart */}
                    <div className="px-5 pb-5 pt-3">
                        <p className="text-[11px] font-semibold mb-3" style={{ color: "var(--text-subtle)" }}>
                            This month vs last month
                        </p>
                        <div className="flex items-end gap-1.5" style={{ height: "56px" }}>
                            {[65, 72, 58, 80, 75, 88, 70, 92, 68, 84, 78, 95].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-sm"
                                    style={{
                                        height: `${h}%`,
                                        background: i >= 6
                                            ? "var(--brand)"
                                            : "rgba(59,130,246,0.2)",
                                        borderRadius: "2px 2px 0 0",
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>Last month</span>
                            <span className="text-[10px]" style={{ color: "var(--brand)", fontWeight: 600 }}>This month ↑</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;