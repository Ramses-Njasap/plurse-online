"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SLIDES } from "@/data/home/goals";

interface MobileMenuProps {
    loggedIn: boolean;
    navLinks: Array<{ label: string; href: string }>;
    solutionIcons: Record<string, React.ReactNode>;
}

export function MobileMenu({ loggedIn, navLinks, solutionIcons }: MobileMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileSolOpen, setMobileSolOpen] = useState(false);

    // Clean helper to reset all mobile states at once when closing the drawer
    const closeAllMenus = () => {
        setMenuOpen(false);
        setMobileSolOpen(false);
    };

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-[5.5px]"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                style={{ background: menuOpen ? "var(--surface-muted)" : "transparent" }}
            >
                <span className="block rounded-full" style={{ width: "18px", height: "1.5px", background: "var(--foreground)", transition: "transform 280ms cubic-bezier(.4,0,.2,1)", transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none", transformOrigin: "center" }} />
                <span className="block rounded-full" style={{ width: "12px", height: "1.5px", background: "var(--foreground)", transition: "opacity 180ms ease", opacity: menuOpen ? 0 : 1, alignSelf: "flex-start", marginLeft: "3px" }} />
                <span className="block rounded-full" style={{ width: "18px", height: "1.5px", background: "var(--foreground)", transition: "transform 280ms cubic-bezier(.4,0,.2,1)", transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none", transformOrigin: "center" }} />
            </button>

            {/* Drawer Overlay Panel */}
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
                aria-hidden={!menuOpen}
            >
                <div className="h-[68px] shrink-0 border-b" style={{ borderColor: "var(--border)" }} />

                <div className="flex flex-col flex-1 px-5 pt-4 pb-8 overflow-y-auto">
                    <ul className="flex flex-col mb-6">

                        {/* Solutions Accordion Section */}
                        <li style={{ borderBottom: "1px solid var(--border)" }}>
                            <button
                                onClick={() => setMobileSolOpen((v) => !v)}
                                className="flex items-center justify-between w-full py-4 text-[16px] font-medium"
                                style={{ color: "var(--foreground)", background: "none", border: "none", cursor: "pointer" }}
                            >
                                Solutions
                                <svg
                                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    style={{ color: "var(--text-subtle)", transform: mobileSolOpen ? "rotate(180deg)" : "none", transition: "transform 250ms ease" }}
                                >
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <div style={{ display: "grid", gridTemplateRows: mobileSolOpen ? "1fr" : "0fr", transition: "grid-template-rows 300ms ease" }}>
                                <div style={{ overflow: "hidden" }}>
                                    <div className="flex flex-col pb-2">
                                        {SLIDES.map((slide) => (
                                            <Link
                                                key={slide.id}
                                                href={`/solutions/${slide.id}`}
                                                onClick={closeAllMenus} // Instantly closes overlay on transition selection
                                                className="flex items-center gap-3 py-3 px-1"
                                                style={{ textDecoration: "none" }}
                                            >
                                                <span className="flex items-center justify-center rounded-lg" style={{ width: "28px", height: "28px", flexShrink: 0, background: "var(--brand-light)", color: "var(--brand)", border: "1px solid rgba(59,130,246,0.18)" }}>
                                                    {solutionIcons[slide.id]}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>{slide.tag}</span>
                                                    <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>{slide.headline.slice(0, 48)}…</span>
                                                </div>
                                            </Link>
                                        ))}

                                        <Link href="/solutions" onClick={closeAllMenus} className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-2 mb-1 px-1" style={{ color: "var(--brand)", textDecoration: "none" }}>
                                            View all solutions
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* General Static Links */}
                        {navLinks.map(({ label, href }, i) => (
                            <li key={label} style={{ borderBottom: "1px solid var(--border)", transform: menuOpen ? "translateY(0)" : "translateY(8px)", opacity: menuOpen ? 1 : 0, transition: `transform 280ms ease ${(i + 1) * 45 + 60}ms, opacity 280ms ease ${(i + 1) * 45 + 60}ms` }}>
                                <Link href={href} onClick={closeAllMenus} className="flex items-center justify-between py-4 text-[16px] font-medium" style={{ color: "var(--foreground)" }}>
                                    {label}
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-subtle)" }}>
                                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* User Account State CTAs */}
                    <div className="flex flex-col gap-3 mt-auto" style={{ transform: menuOpen ? "translateY(0)" : "translateY(8px)", opacity: menuOpen ? 1 : 0, transition: "transform 280ms ease 280ms, opacity 280ms ease 280ms" }}>
                        {loggedIn ? (
                            <Link href="/dashboard" onClick={closeAllMenus} className="btn-primary w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center" }}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/signup" onClick={closeAllMenus} className="btn-primary w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center" }}>
                                    Get started
                                </Link>
                                <Link href="/login" onClick={closeAllMenus} className="btn-ghost w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center", background: "var(--surface-muted)", color: "var(--foreground)" }}>
                                    Log in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}