// CustomersHero.tsx — Zone 1
// Warm, human — image right, text left

"use client";
import Link from "next/link";

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
                        <span>Customer Relationships</span>
                    </div>

                    {/* Eyebrow */}
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 self-start"
                        style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                        <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
                        <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--brand)" }}>
                            Customer Relationships
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
                        Know your customers
                        <br />by name.
                        <br />
                        <span style={{ color: "var(--brand)" }}>And by habit.</span>
                    </h1>

                    <p
                        className="text-[15px] sm:text-[16px] leading-[1.75] mb-8"
                        style={{ color: "var(--text-muted)", maxWidth: "440px" }}
                    >
                        Build detailed customer profiles automatically. Track purchase
                        history, credit behaviour and buying patterns — and use that
                        knowledge to serve them better every single time.
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

                {/* ── Right: human image ── */}
                <div className="relative">
                    <div
                        className="relative rounded-2xl overflow-hidden w-full"
                        style={{
                            aspectRatio: "4/3",
                            boxShadow: "0 32px 80px rgba(15,23,42,0.1), 0 4px 16px rgba(59,130,246,0.06)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85"
                            alt="Business owner building customer relationships"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "linear-gradient(180deg, transparent 50%, rgba(15,23,42,0.35) 100%)" }}
                        />
                    </div>

                    {/* Floating stat */}
                    <div
                        className="absolute flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{
                            bottom: "16px",
                            left: "16px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                        }}
                    >
                        <div className="flex flex-col">
                            <span
                                className="font-bold"
                                style={{ fontSize: "18px", color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                            >
                                847
                            </span>
                            <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                                Customers tracked
                            </span>
                        </div>
                        <div
                            style={{ width: "1px", height: "32px", background: "var(--border)", flexShrink: 0 }}
                        />
                        <div className="flex flex-col">
                            <span
                                className="font-bold"
                                style={{ fontSize: "18px", color: "var(--foreground)", fontFamily: "var(--font-geist-mono)" }}
                            >
                                94%
                            </span>
                            <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                                Return rate
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;