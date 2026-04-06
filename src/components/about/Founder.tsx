// AboutFounder.tsx — Zone 5
// Personal, direct — founder's note, not a corporate bio

import { FOUNDER } from "@/data/about/data";
import Link from "next/link";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Founder = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
            style={{ minHeight: SECTION_MIN_H, background: "var(--background)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center" }}
        >
            <div
                className="max-w-6xl mx-auto w-full flex flex-col md:grid gap-12 md:gap-24 items-start"
                style={{ gridTemplateColumns: "1fr 1.2fr" }}
            >
                {/* Left: photo + identity */}
                <div className="flex flex-col gap-6">
                    <div
                        className="relative rounded-2xl overflow-hidden w-full"
                        style={{
                            aspectRatio: "3/4",
                            border: "1px solid var(--border)",
                            boxShadow: "0 24px 64px rgba(15,23,42,0.08)",
                        }}
                    >
                        <img
                            src={FOUNDER.photo}
                            alt={FOUNDER.name}
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "linear-gradient(180deg, transparent 60%, rgba(15,23,42,0.4) 100%)" }}
                        />
                    </div>

                    {/* Name + role + linkedin */}
                    <div className="flex flex-col gap-1">
                        <p
                            className="text-[18px] font-bold tracking-[-0.02em]"
                            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
                        >
                            {FOUNDER.name}
                        </p>
                        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                            {FOUNDER.role}
                        </p>
                        <Link
                            href={FOUNDER.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 text-[12.5px] font-medium"
                            style={{ color: "var(--brand)", textDecoration: "none", width: "fit-content" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                            LinkedIn
                        </Link>
                    </div>
                </div>

                {/* Right: founder's note */}
                <div className="flex flex-col justify-center">
                    <p
                        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6"
                        style={{ color: "var(--brand)" }}
                    >
                        A note from the founder
                    </p>

                    <div className="flex flex-col gap-5">
                        {FOUNDER.note.map((paragraph, i) => (
                            <p
                                key={i}
                                className="leading-[1.85]"
                                style={{
                                    fontSize: i === 0 ? "17px" : "15px",
                                    color: i === 0 ? "var(--foreground)" : "var(--text-muted)",
                                    fontFamily: "var(--font-geist-sans)",
                                }}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Signature line */}
                    <div
                        className="flex items-center gap-4 mt-10 pt-8"
                        style={{ borderTop: "1px solid var(--border)" }}
                    >
                        <div
                            className="flex items-center justify-center rounded-full text-[14px] font-bold shrink-0"
                            style={{
                                width: "40px",
                                height: "40px",
                                background: "var(--brand-light)",
                                color: "var(--brand)",
                                border: "1px solid rgba(59,130,246,0.2)",
                            }}
                        >
                            {FOUNDER.name[0]}
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                                {FOUNDER.name}
                            </p>
                            <p className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                                {FOUNDER.role} · Plurse
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Founder;