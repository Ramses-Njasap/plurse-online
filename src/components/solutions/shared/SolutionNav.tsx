// SolutionNav.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Prev / Next navigation strip shown at the bottom of every solution page.
// Shared across all 5 solution pages — only data changes per page.
"use client";
import Link from "next/link";
import type { SolutionNavItem } from "@/data/solutions/data";

interface Props {
  prev: SolutionNavItem | null;
  next: SolutionNavItem | null;
}

const SolutionNav = ({ prev, next }: Props) => {
  return (
    <div
      className="relative z-10 px-5 sm:px-8 py-12 sm:py-16"
      style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* ── Prev ── */}
        {prev ? (
          <Link
            href={prev.href}
            className="group flex items-center gap-3 text-left"
            style={{ textDecoration: "none", flex: 1 }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width:      "40px",
                height:     "40px",
                border:     "1px solid var(--border-strong)",
                transition: "border-color 150ms, background 150ms",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--brand)";
                (e.currentTarget as HTMLDivElement).style.background  = "var(--brand-light)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)";
                (e.currentTarget as HTMLDivElement).style.background  = "transparent";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8l4 4" stroke="var(--text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text-subtle)" }}>
                Previous solution
              </p>
              <p
                className="text-[14px] font-semibold"
                style={{ color: "var(--foreground)", transition: "color 150ms" }}
              >
                {prev.tag}
              </p>
            </div>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {/* ── Center: solution list dots ── */}
        <div className="hidden sm:flex items-center gap-2">
          {["inventory","cashflow","sales","customers","team"].map(id => (
            <div
              key={id}
              style={{
                width:        id === prev?.id || id === next?.id ? "6px" : "6px",
                height:       "6px",
                borderRadius: "50%",
                background:   id !== prev?.id && id !== next?.id && id !== prev?.id
                  ? "var(--brand)"
                  : "var(--border-strong)",
              }}
            />
          ))}
        </div>

        {/* ── Next ── */}
        {next ? (
          <Link
            href={next.href}
            className="group flex items-center gap-3 text-right justify-end"
            style={{ textDecoration: "none", flex: 1 }}
          >
            <div>
              <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text-subtle)" }}>
                Next solution
              </p>
              <p
                className="text-[14px] font-semibold"
                style={{ color: "var(--foreground)", transition: "color 150ms" }}
              >
                {next.tag}
              </p>
            </div>
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width:      "40px",
                height:     "40px",
                border:     "1px solid var(--border-strong)",
                transition: "border-color 150ms, background 150ms",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--brand)";
                (e.currentTarget as HTMLDivElement).style.background  = "var(--brand-light)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)";
                (e.currentTarget as HTMLDivElement).style.background  = "transparent";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="var(--text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>
    </div>
  );
}

export default SolutionNav;