"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SLIDES } from "@/data/home/goals";

const NAV_LINKS = [
    { label: "Download", href: "/download" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const SOLUTION_ICONS: Record<string, React.ReactNode> = {
    inventory: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
    ),
    cashflow: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    ),
    sales: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
    ),
    customers: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" /></svg>
    ),
    team: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
    ),
};

export default function NavbarClient({ loggedIn }: { loggedIn: boolean }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [solutionsOpen, setSolutionsOpen] = useState(false);
    const [mobileSolOpen, setMobileSolOpen] = useState(false);

    const solutionsRef = useRef<HTMLLIElement>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
                setSolutionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setSolutionsOpen(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setSolutionsOpen(false), 120);
    };

    return (
        <header
            className="fixed top-0 inset-x-0 z-50 transition-all duration-250"
            style={{
                background: scrolled ? "rgba(250,250,249,0.9)" : "transparent",
                backdropFilter: scrolled ? "blur(16px) saturate(1.6)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.6)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(59,130,246,0.12)" : "transparent"}`,
                boxShadow: scrolled ? "0 1px 24px rgba(15,23,42,0.05)" : "none",
            }}
        >
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <nav className="h-[68px] flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 shrink-0 relative z-50">
                        <span className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] text-white text-[14px] font-bold tracking-tight select-none" style={{ background: "var(--brand)", boxShadow: "0 2px 6px var(--brand-ring)" }}>P</span>
                        <span className="text-[17px] font-semibold tracking-[-0.025em]" style={{ color: "var(--foreground)" }}>Plurse</span>
                    </Link>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        <li ref={solutionsRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
                            <button
                                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[15px] font-medium transition-colors duration-150"
                                style={{ color: solutionsOpen ? "var(--foreground)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                            >
                                Solutions
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ transform: solutionsOpen ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}>
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Desktop Dropdown Content */}
                            {solutionsOpen && (
                                <div className="absolute mt-2 z-50" style={{ top: "100%", left: "50%", transform: "translateX(-50%)", width: "720px", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 16px 48px rgba(15,23,42,0.1), 0 4px 16px rgba(15,23,42,0.06)", overflow: "hidden" }}>
                                    <div className="grid" style={{ gridTemplateColumns: "220px 1fr" }}>
                                        <div className="flex flex-col justify-between p-6" style={{ borderRight: "1px solid var(--border)", background: "var(--surface-muted)" }}>
                                            <div>
                                                <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "var(--brand)" }}>Solutions</p>
                                                <h3 className="text-[17px] font-bold tracking-[-0.02em] leading-[1.3] mb-3" style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}>Everything your business needs to grow.</h3>
                                                <p className="text-[13px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>Explore what Plurse can do for your inventory, cashflow, sales and team.</p>
                                            </div>
                                            <Link href="/solutions" onClick={() => setSolutionsOpen(false)} className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-6" style={{ color: "var(--brand)" }}>
                                                View all solutions
                                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </Link>
                                        </div>
                                        <div className="grid p-3" style={{ gridTemplateColumns: "1fr 1fr", gap: "2px", alignContent: "start" }}>
                                            {SLIDES.map(slide => (
                                                <Link key={slide.id} href={`/solutions/${slide.id}`} onClick={() => setSolutionsOpen(false)} className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-[var(--surface-muted)]">
                                                    <span className="flex items-center justify-center rounded-lg mt-0.5" style={{ width: "28px", height: "28px", flexShrink: 0, background: "rgba(100,116,139,0.08)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{SOLUTION_ICONS[slide.id]}</span>
                                                    <div className="flex flex-col min-w-0"><span className="text-[13px] font-semibold leading-snug" style={{ color: "var(--foreground)" }}>{slide.tag}</span><span className="text-[11.5px] leading-[1.5] mt-0.5" style={{ color: "var(--text-subtle)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{slide.headline}</span></div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>

                        {NAV_LINKS.map(({ label, href }) => (
                            <li key={label}>
                                <Link href={href} className="px-4 py-2 rounded-md text-[15px] font-medium transition-colors" style={{ color: "var(--text-muted)" }}>{label}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        {loggedIn ? (
                            <Link href="/dashboard" className="btn-ghost" style={{ fontSize: "15px", padding: "0.55rem 1.2rem" }}>Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn-ghost" style={{ fontSize: "15px", padding: "0.55rem 1.2rem" }}>Log in</Link>
                                <Link href="/signup" className="btn-primary" style={{ fontSize: "15px", padding: "0.55rem 1.2rem" }}>Get started</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-[5.5px] relative z-50"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        <span className="block rounded-full" style={{ width: "18px", height: "1.5px", background: "var(--foreground)", transition: "transform 280ms cubic-bezier(.4,0,.2,1)", transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none" }} />
                        <span className="block rounded-full" style={{ width: "12px", height: "1.5px", background: "var(--foreground)", transition: "opacity 180ms ease", opacity: menuOpen ? 0 : 1, alignSelf: "flex-start", marginLeft: "3px" }} />
                        <span className="block rounded-full" style={{ width: "18px", height: "1.5px", background: "var(--foreground)", transition: "transform 280ms cubic-bezier(.4,0,.2,1)", transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none" }} />
                    </button>

                    {/* Mobile Menu Overlay Drawer */}
                    <div
                        className="fixed inset-0 z-40 md:hidden flex flex-col"
                        style={{
                            background: "rgba(250,250,249,0.97)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            opacity: menuOpen ? 1 : 0,
                            pointerEvents: menuOpen ? "auto" : "none",
                            transition: "opacity 250ms ease",
                        }}
                    >
                        <div className="h-[68px] shrink-0 border-b" style={{ borderColor: "var(--border)" }} />
                        <div className="flex flex-col flex-1 px-5 pt-4 pb-8 overflow-y-auto">
                            <ul className="flex flex-col mb-6">
                                <li style={{ borderBottom: "1px solid var(--border)" }}>
                                    <button onClick={() => setMobileSolOpen(!mobileSolOpen)} className="flex items-center justify-between w-full py-4 text-[16px] font-medium" style={{ color: "var(--foreground)", background: "none", border: "none" }}>
                                        Solutions
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-subtle)", transform: mobileSolOpen ? "rotate(180deg)" : "none", transition: "transform 250ms ease" }}>
                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <div style={{ display: "grid", gridTemplateRows: mobileSolOpen ? "1fr" : "0fr", transition: "grid-template-rows 300ms ease" }}>
                                        <div style={{ overflow: "hidden" }}>
                                            <div className="flex flex-col pb-2">
                                                {SLIDES.map(slide => (
                                                    <Link key={slide.id} href={`/solutions/${slide.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-3 px-1">
                                                        <span className="flex items-center justify-center rounded-lg" style={{ width: "28px", height: "28px", flexShrink: 0, background: "var(--brand-light)", color: "var(--brand)", border: "1px solid rgba(59,130,246,0.18)" }}>{SOLUTION_ICONS[slide.id]}</span>
                                                        <div className="flex flex-col">
                                                            <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>{slide.tag}</span>
                                                            <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>{slide.headline.slice(0, 48)}…</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {NAV_LINKS.map(({ label, href }) => (
                                    <li key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <Link href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-4 text-[16px] font-medium" style={{ color: "var(--foreground)" }}>
                                            {label}
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-subtle)" }}><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col gap-3 mt-auto">
                                {loggedIn ? (
                                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn-primary w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center" }}>Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center" }}>Get started</Link>
                                        <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-ghost w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center", background: "var(--surface-muted)", color: "var(--foreground)" }}>Log in</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </nav>
            </div>
        </header>
    );
}