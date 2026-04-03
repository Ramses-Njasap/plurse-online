"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SLIDES } from "@/data/home/goals";

// ── Nav links — "Features" replaced by "Solutions" dropdown ───────────────────
const NAV_LINKS = [
  { label: "Download", href: "/download" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Solution icons — one per slide id ─────────────────────────────────────────
const SOLUTION_ICONS: Record<string, React.ReactNode> = {
  inventory: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  cashflow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  sales: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  customers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  ),
  team: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
};

// ── Solutions dropdown ─────────────────────────────────────────────────────────
function SolutionsDropdown({ onClose }: { onClose: () => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = SLIDES.find(s => s.id === hoveredId) ?? null;

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
        animation: "dropdownIn 200ms cubic-bezier(0.22,1,0.36,1) both",
        overflow: "hidden",
      }}
    >
      <div className="grid" style={{ gridTemplateColumns: "220px 1fr" }}>

        {/* ── Left: intro panel ── */}
        <div
          className="flex flex-col justify-between p-6"
          style={{ borderRight: "1px solid var(--border)", background: "var(--surface-muted)" }}
        >
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "var(--brand)" }}
            >
              Solutions
            </p>
            <h3
              className="text-[17px] font-bold tracking-[-0.02em] leading-[1.3] mb-3"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              {hovered ? hovered.headline : "Everything your business needs to grow."}
            </h3>
            <p
              className="text-[13px] leading-[1.65]"
              style={{ color: "var(--text-muted)" }}
            >
              {hovered
                ? hovered.body.slice(0, 100) + "…"
                : "Explore what Plurse can do for your inventory, cashflow, sales and team."}
            </p>
          </div>

          {/* CTA to solutions overview */}
          <Link
            href="/solutions"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-6"
            style={{ color: "var(--brand)", textDecoration: "none" }}
          >
            View all solutions
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── Right: solution items — two columns ── */}
        <div
          className="grid p-3"
          style={{ gridTemplateColumns: "1fr 1fr", gap: "2px", alignContent: "start" }}
        >
          {SLIDES.map(slide => (
            <Link
              key={slide.id}
              href={`/solutions/${slide.id}`}
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl transition-all duration-150"
              style={{
                textDecoration: "none",
                background: hoveredId === slide.id ? "var(--surface-muted)" : "transparent",
              }}
              onMouseEnter={() => setHoveredId(slide.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Icon — brand light on hover, muted at rest */}
              <span
                className="flex items-center justify-center rounded-lg mt-0.5"
                style={{
                  width: "28px",
                  height: "28px",
                  flexShrink: 0,
                  background: hoveredId === slide.id ? "var(--brand-light)" : "rgba(100,116,139,0.08)",
                  color: hoveredId === slide.id ? "var(--brand)" : "var(--text-muted)",
                  border: `1px solid ${hoveredId === slide.id ? "rgba(59,130,246,0.2)" : "var(--border)"}`,
                  transition: "all 150ms ease",
                }}
              >
                {SOLUTION_ICONS[slide.id]}
              </span>

              {/* Text */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-[13px] font-semibold leading-snug"
                    style={{
                      color: hoveredId === slide.id ? "var(--brand)" : "var(--foreground)",
                      transition: "color 150ms ease",
                    }}
                  >
                    {slide.tag}
                  </span>
                </div>
                <span
                  className="text-[11.5px] leading-[1.5] mt-0.5"
                  style={{
                    color: "var(--text-subtle)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {slide.headline}
                </span>
                {/* Learn more — slides in on hover */}
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium mt-1"
                  style={{
                    color: "var(--brand)",
                    opacity: hoveredId === slide.id ? 1 : 0,
                    transform: hoveredId === slide.id ? "translateY(0)" : "translateY(3px)",
                    transition: "opacity 150ms ease, transform 150ms ease",
                  }}
                >
                  Learn more
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolOpen, setMobileSolOpen] = useState(false);
  const solutionsRef = useRef<HTMLLIElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close dropdown when clicking outside
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
    <>
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          transition: "background 250ms ease, border-color 250ms ease, box-shadow 250ms ease",
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
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0"
              aria-label="Plurse home"
            >
              <span
                className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] text-white text-[14px] font-bold tracking-tight select-none"
                style={{ background: "var(--brand)", boxShadow: "0 2px 6px var(--brand-ring)" }}
              >
                P
              </span>
              <span
                className="text-[17px] font-semibold tracking-[-0.025em]"
                style={{ color: "var(--foreground)" }}
              >
                Plurse
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">

              {/* Solutions — dropdown trigger */}
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
                  <SolutionsDropdown onClose={() => setSolutionsOpen(false)} />
                )}
              </li>

              {/* Regular links */}
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="px-4 py-2 rounded-md text-[15px] font-medium transition-colors duration-150"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link href="/login" className="btn-ghost" style={{ fontSize: "15px", padding: "0.55rem 1.2rem" }}>
                Log in
              </Link>
              <Link href="/signup" className="btn-primary" style={{ fontSize: "15px", padding: "0.55rem 1.2rem" }}>
                Get started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-[5.5px]"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{ background: menuOpen ? "var(--surface-muted)" : "transparent" }}
            >
              <span className="block rounded-full" style={{ width: "18px", height: "1.5px", background: "var(--foreground)", transition: "transform 280ms cubic-bezier(.4,0,.2,1)", transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none", transformOrigin: "center" }} />
              <span className="block rounded-full" style={{ width: "12px", height: "1.5px", background: "var(--foreground)", transition: "opacity 180ms ease", opacity: menuOpen ? 0 : 1, alignSelf: "flex-start", marginLeft: "3px" }} />
              <span className="block rounded-full" style={{ width: "18px", height: "1.5px", background: "var(--foreground)", transition: "transform 280ms cubic-bezier(.4,0,.2,1)", transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none", transformOrigin: "center" }} />
            </button>
          </nav>
        </div>
      </header>

      {/* ── Mobile menu ── */}
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

            {/* Solutions — accordion on mobile */}
            <li style={{ borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={() => setMobileSolOpen(v => !v)}
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

              {/* Accordion content */}
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: mobileSolOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 300ms ease",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div className="flex flex-col pb-2">
                    {SLIDES.map(slide => (
                      <Link
                        key={slide.id}
                        href={`/solutions/${slide.id}`}
                        onClick={() => { setMenuOpen(false); setMobileSolOpen(false); }}
                        className="flex items-center gap-3 py-3 px-1"
                        style={{ textDecoration: "none" }}
                      >
                        <span
                          className="flex items-center justify-center rounded-lg"
                          style={{ width: "28px", height: "28px", flexShrink: 0, background: "var(--brand-light)", color: "var(--brand)", border: "1px solid rgba(59,130,246,0.18)" }}
                        >
                          {SOLUTION_ICONS[slide.id]}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>{slide.tag}</span>
                          <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>{slide.headline.slice(0, 48)}…</span>
                        </div>
                      </Link>
                    ))}

                    <Link
                      href="/solutions"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-2 mb-1 px-1"
                      style={{ color: "var(--brand)", textDecoration: "none" }}
                    >
                      View all solutions
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            {/* Regular links */}
            {NAV_LINKS.map(({ label, href }, i) => (
              <li
                key={label}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transform: menuOpen ? "translateY(0)" : "translateY(8px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 280ms ease ${(i + 1) * 45 + 60}ms, opacity 280ms ease ${(i + 1) * 45 + 60}ms`,
                }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-[16px] font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-subtle)" }}>
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div
            className="flex flex-col gap-3 mt-auto"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(8px)",
              opacity: menuOpen ? 1 : 0,
              transition: "transform 280ms ease 280ms, opacity 280ms ease 280ms",
            }}
          >
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center" }}>
              Get started
            </Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-ghost w-full py-3.5 rounded-xl text-[15px]" style={{ justifyContent: "center", background: "var(--surface-muted)", color: "var(--foreground)" }}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;