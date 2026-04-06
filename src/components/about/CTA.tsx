// AboutCTA.tsx — Zone 6
// Different from product CTA — "Be part of what's being built"
// Two paths: download the app + get in touch

"use client";
import Link from "next/link";


const CTA = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
            <div className="max-w-6xl mx-auto">
                <div
                    className="flex flex-col md:grid gap-10 md:gap-16 items-center"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                    {/* Left: headline */}
                    <div className="flex flex-col">
                        <p
                            className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5"
                            style={{ color: "var(--brand)" }}
                        >
                            Get involved
                        </p>
                        <h2
                            className="font-bold tracking-[-0.03em] leading-[1.1] mb-5"
                            style={{
                                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                                color: "var(--foreground)",
                                fontFamily: "var(--font-geist-sans)",
                            }}
                        >
                            Be part of what's
                            <br />
                            <span style={{ color: "var(--brand)" }}>being built.</span>
                        </h2>
                        <p
                            className="text-[15px] leading-[1.8]"
                            style={{ color: "var(--text-muted)", maxWidth: "420px" }}
                        >
                            Whether you're a business owner ready to take control,
                            a partner who sees the vision, or someone who wants to
                            help build it — Plurse has a place for you.
                        </p>
                    </div>

                    {/* Right: two action cards */}
                    <div className="flex flex-col gap-4 w-full">

                        {/* Card 1 — Download */}
                        <Link
                            href="/download"
                            className="flex items-start gap-5 p-6 rounded-2xl group"
                            style={{
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                textDecoration: "none",
                                transition: "border-color 200ms, box-shadow 200ms",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.35)";
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(59,130,246,0.07)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                            }}
                        >
                            <div
                                className="flex items-center justify-center rounded-xl shrink-0"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    background: "var(--brand)",
                                    color: "white",
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-bold mb-1" style={{ color: "var(--foreground)" }}>
                                    Download Plurse
                                </p>
                                <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>
                                    Start using the operating system for your business today.
                                    Available on Windows, macOS and Linux.
                                </p>
                            </div>
                            <svg
                                width="16" height="16" viewBox="0 0 16 16" fill="none"
                                style={{ color: "var(--text-subtle)", flexShrink: 0, marginTop: "2px" }}
                            >
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        {/* Card 2 — Contact */}
                        <Link
                            href="/contact"
                            className="flex items-start gap-5 p-6 rounded-2xl"
                            style={{
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                textDecoration: "none",
                                transition: "border-color 200ms, box-shadow 200ms",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.35)";
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(59,130,246,0.07)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                            }}
                        >
                            <div
                                className="flex items-center justify-center rounded-xl shrink-0"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    background: "var(--brand-light)",
                                    color: "var(--brand)",
                                    border: "1px solid rgba(59,130,246,0.2)",
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-bold mb-1" style={{ color: "var(--foreground)" }}>
                                    Get in touch
                                </p>
                                <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>
                                    Partner with us, share feedback, or just tell us what
                                    your business needs. We read everything.
                                </p>
                            </div>
                            <svg
                                width="16" height="16" viewBox="0 0 16 16" fill="none"
                                style={{ color: "var(--text-subtle)", flexShrink: 0, marginTop: "2px" }}
                            >
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTA;