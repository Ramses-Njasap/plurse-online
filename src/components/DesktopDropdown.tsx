"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SLIDES } from "@/data/home/goals";

interface DesktopDropdownProps {
    solutionIcons: Record<string, React.ReactNode>;
}

// ── Dropdown Content (Now safely inside the Client boundary) ──
function SolutionsDropdown({ onClose, solutionIcons }: { onClose: () => void; solutionIcons: Record<string, React.ReactNode> }) {
    return (
        <div
            className="absolute mt-2 z-50"
            style={{
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "720px",
                background: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                boxShadow: "0 16px 48px rgba(15,23,42,0.1), 0 4px 16px rgba(15,23,42,0.06)",
                overflow: "hidden",
            }}
        >
            <div className="grid" style={{ gridTemplateColumns: "220px 1fr" }}>
                <div className="flex flex-col justify-between p-6" style={{ borderRight: "1px solid var(--border)", background: "var(--surface-muted)" }}>
                    <div>
                        <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "var(--brand)" }}>Solutions</p>
                        <h3 className="text-[17px] font-bold tracking-[-0.02em] leading-[1.3] mb-3" style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}>Everything your business needs to grow.</h3>
                        <p className="text-[13px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>Explore what Plurse can do for your inventory, cashflow, sales and team.</p>
                    </div>
                    <Link href="/solutions" onClick={onClose} className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-6" style={{ color: "var(--brand)", textDecoration: "none" }}>
                        View all solutions
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                </div>

                <div className="grid p-3" style={{ gridTemplateColumns: "1fr 1fr", gap: "2px", alignContent: "start" }}>
                    {SLIDES.map(slide => (
                        <Link key={slide.id} href={`/solutions/${slide.id}`} onClick={onClose} className="flex items-start gap-3 p-3 rounded-xl transition-all" style={{ textDecoration: "none" }}>
                            <span className="flex items-center justify-center rounded-lg mt-0.5" style={{ width: "28px", height: "28px", flexShrink: 0, background: "rgba(100,116,139,0.08)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                                {solutionIcons[slide.id]}
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-semibold leading-snug" style={{ color: "var(--foreground)" }}>{slide.tag}</span>
                                <span className="text-[11.5px] leading-[1.5] mt-0.5" style={{ color: "var(--text-subtle)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{slide.headline}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main Trigger Link ──
export function DesktopDropdown({ solutionIcons }: DesktopDropdownProps) {
    const [solutionsOpen, setSolutionsOpen] = useState(false);
    const solutionsRef = useRef<HTMLLIElement>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
                setSolutionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const openSolutions = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setSolutionsOpen(true);
    };

    const closeSolutions = () => {
        hoverTimeout.current = setTimeout(() => setSolutionsOpen(false), 120);
    };

    return (
        <li
            ref={solutionsRef}
            className="relative"
            onMouseEnter={openSolutions}
            onMouseLeave={closeSolutions}
        >
            <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[15px] font-medium transition-colors duration-150"
                style={{ color: solutionsOpen ? "var(--foreground)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
            >
                Solutions
                <svg
                    width="13" height="13" viewBox="0 0 16 16" fill="none"
                    style={{ transform: solutionsOpen ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
                >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {solutionsOpen && (
                <SolutionsDropdown onClose={() => setSolutionsOpen(false)} solutionIcons={solutionIcons} />
            )}
        </li>
    );
}