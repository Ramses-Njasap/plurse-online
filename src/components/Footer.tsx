"use client";

import { useState } from "react";
import Link from "next/link";

// ── Data ───────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Download", href: "/download" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  {
    label: "X / Twitter",
    href: "https://twitter.com/plurse",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/plurse",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/plurse",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

const PLATFORMS = [
  {
    label: "Windows",
    href: "/download#windows",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    ),
  },
  {
    label: "macOS",
    href: "/download#macos",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    label: "Linux",
    href: "/download#linux",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.336 3.59 2.856 2.65 6.848c-.27 1.183-.33 2.38-.189 3.555.142 1.176.495 2.308 1.003 3.286.508.978 1.163 1.79 1.877 2.369.17.14.353.264.54.374.187.111.376.205.568.284.192.08.386.143.578.19.193.046.388.076.583.088.196.012.393.013.593.002.2-.011.398-.035.596-.073.198-.038.396-.088.591-.151.196-.063.39-.138.582-.225.192-.088.382-.188.568-.299.376-.222.739-.486 1.079-.794.34-.308.658-.654.947-1.031.29-.378.552-.789.78-1.227.228-.438.419-.9.571-1.376.152-.476.263-.966.33-1.462.067-.496.09-1.003.067-1.514-.022-.51-.088-1.024-.193-1.535-.105-.51-.249-1.015-.428-1.508-.18-.494-.396-.973-.64-1.428-.245-.455-.52-.884-.815-1.278-.296-.394-.612-.756-.944-1.078-.332-.322-.679-.604-1.034-.846-.354-.242-.718-.445-1.085-.609-.367-.164-.74-.29-1.113-.376-.373-.086-.747-.133-1.122-.139z" />
      </svg>
    ),
  },
];

// ── Newsletter form ────────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p
        className="text-[13px]"
        style={{ color: "var(--brand)", fontFamily: "var(--font-geist-sans)" }}
      >
        ✓ You're on the list — we'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="your@email.com"
          aria-label="Email address"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "8px 12px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border-strong)",
            background: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            fontFamily: "var(--font-geist-sans)",
            transition: "border-color 150ms ease",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--brand)")}
          onBlur={e => (e.target.style.borderColor = "var(--border-strong)")}
        />
        <button
          type="submit"
          style={{
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "8px",
            background: "var(--brand)",
            color: "white",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            fontFamily: "var(--font-geist-sans)",
            transition: "background 150ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--brand-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--brand)")}
        >
          Subscribe
        </button>
      </div>
      {error && (
        <p className="text-[11px]" style={{ color: "#ef4444" }}>{error}</p>
      )}
    </form>
  );
}

// ── Main footer ────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer style={{ background: "#F3F4F5" }}>

      {/* ── Top divider ── */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* ── Main grid ── */}
      <div
        className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px 48px",
          alignItems: "start",
        }}
      >

        {/* ── Brand column ── */}
        <div
          className="flex flex-col gap-4"
          style={{ gridColumn: "span 2" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center rounded-[8px] text-white text-[14px] font-bold select-none"
              style={{
                width: "32px",
                height: "32px",
                background: "var(--brand)",
                flexShrink: 0,
              }}
            >
              P
            </span>
            <span
              className="text-[17px] font-semibold tracking-[-0.025em]"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              Plurse
            </span>
          </div>

          {/* Tagline */}
          <p
            className="text-[13px] font-semibold tracking-[-0.01em]"
            style={{ color: "var(--foreground)" }}
          >
            Track Smart. Grow Faster.
          </p>

          {/* Description */}
          <p
            className="text-[13px] leading-[1.7]"
            style={{ color: "var(--text-muted)", maxWidth: "240px" }}
          >
            Business intelligence for every business — inventory, cashflow and growth, all in one place.
          </p>

          {/* Platform badges */}
          <div className="flex flex-wrap gap-2 mt-1">
            {PLATFORMS.map(p => (
              <Link
                key={p.label}
                href={p.href}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-md"
                style={{
                  padding: "4px 9px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 150ms, border-color 150ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.35)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                }}
              >
                {p.icon}
                {p.label}
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3 mt-1">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  transition: "color 150ms, border-color 150ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.35)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Quick links ── */}
        <div className="flex flex-col gap-3">
          <p
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1"
            style={{ color: "var(--text-subtle)" }}
          >
            Product
          </p>
          {QUICK_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13.5px] font-medium w-fit"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── Legal ── */}
        <div className="flex flex-col gap-3">
          <p
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1"
            style={{ color: "var(--text-subtle)" }}
          >
            Legal
          </p>
          {LEGAL_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13.5px] font-medium w-fit"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── Newsletter ── */}
        <div className="flex flex-col gap-4">
          <p
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1"
            style={{ color: "var(--text-subtle)" }}
          >
            Stay updated
          </p>
          <p
            className="text-[13px] leading-[1.65]"
            style={{ color: "var(--text-muted)" }}
          >
            Get the latest updates, tips and new features — straight to your inbox.
          </p>
          <NewsletterForm />
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p
            className="text-[12px] text-center sm:text-left"
            style={{ color: "var(--text-subtle)" }}
          >
            © {new Date().getFullYear()} Plurse. All rights reserved.
          </p>

          <p
            className="text-[12px] text-center"
            style={{ color: "var(--text-subtle)" }}
          >
            Designed & built by{" "}
            <a
              href="https://linkedin.com/in/ramses-njasap"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--foreground)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 150ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--brand)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--foreground)")}
            >
              Ramses Njasap
            </a>
          </p>

          <p
            className="text-[11px]"
            style={{
              color: "var(--text-subtle)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}