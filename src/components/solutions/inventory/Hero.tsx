// InventoryHero.tsx — Zone 1

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
                className="max-w-6xl mx-auto h-full flex flex-col md:grid md:items-center gap-10 md:gap-16"
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
                    <div
                        className="flex items-center gap-2 mb-6"
                        style={{ fontSize: "12px", color: "var(--text-subtle)" }}
                    >
                        <Link href="/solutions" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 500 }}>
                            Solutions
                        </Link>
                        <span>/</span>
                        <span>Inventory Control</span>
                    </div>

                    {/* Eyebrow */}
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 self-start"
                        style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                        <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
                        <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--brand)" }}>
                            Inventory Control
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
                        Every product.
                        <br />Every variant.
                        <br /><span style={{ color: "var(--brand)" }}>Always in sync.</span>
                    </h1>

                    {/* Sub */}
                    <p
                        className="text-[15px] sm:text-[16px] leading-[1.75] mb-8"
                        style={{ color: "var(--text-muted)", maxWidth: "480px" }}
                    >
                        Plurse organises your entire inventory into a clean, hierarchical structure —
                        from broad categories down to individual SKUs — so you always know
                        exactly what you have, where it is, and what it cost.
                    </p>

                    {/* CTAs */}
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

                {/* ── Right: hero image ── */}
                <div
                    className="relative rounded-2xl overflow-hidden w-full"
                    style={{
                        aspectRatio: "4/3",
                        boxShadow: "0 32px 80px rgba(15,23,42,0.12), 0 4px 16px rgba(59,130,246,0.08)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=85"
                        alt="Organised warehouse shelving and inventory management"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 55%)" }}
                    />
                    {/* Floating stat chip */}
                    <div
                        className="absolute flex flex-col gap-0.5 px-4 py-3 rounded-xl"
                        style={{
                            bottom: "16px", right: "16px",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 4px 16px rgba(15,23,42,0.1)",
                        }}
                    >
                        <span
                            className="text-[20px] font-bold"
                            style={{ color: "var(--brand)", fontFamily: "var(--font-geist-mono)" }}
                        >
                            100%
                        </span>
                        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                            Stock accuracy
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;