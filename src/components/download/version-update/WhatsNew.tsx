"use client";

// WhatsNew.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Version number + release date always visible.
// Changelog is collapsed by default — user expands to read it.
// All data from whats-new-data.ts — nothing hardcoded here.

import { useState } from "react";
import { WHATS_NEW, TYPE_CONFIG } from "@/data/download/whats-new";

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

const countByType = (type: "new" | "improved" | "fix") =>
  WHATS_NEW.changelog.filter(e => e.type === type).length;

interface Props {
    sectionMinH: string;
}

const WhatsNew = ({ sectionMinH }: Props) => {
  const [open, setOpen] = useState(false);
  const { number, released, changelog } = WHATS_NEW;

  const totalChanges = changelog.length;

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: sectionMinH,
        padding:   "clamp(40px, 6vh, 80px) 0",
      }}
    >

      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: "var(--brand)" }}
        >
          Release Notes
        </p>
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
        >
          <h2
            className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
          >
            What's new in
            <br />
            <span style={{ color: "var(--brand)" }}>Plurse v{number}.</span>
          </h2>
          <p
            className="text-[14px] sm:text-right"
            style={{ color: "var(--text-muted)", margin: 0, flexShrink: 0 }}
          >
            Released {formatDate(released)}
          </p>
        </div>
      </div>

      {/* ── Version card + summary stats ── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl p-6 sm:p-8 mb-6"
        style={{
          background: "var(--surface)",
          border:     "1px solid var(--border)",
        }}
      >
        {/* Version badge — scaled to not compete with headline */}
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-4"
          style={{
            background: "var(--brand-light)",
            border:     "1px solid rgba(59,130,246,0.2)",
            flexShrink: 0,
          }}
        >
          <span
            className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1"
            style={{ color: "var(--brand)" }}
          >
            Version
          </span>
          {/* Version number — deliberately modest, headline stays dominant */}
          <span
            className="font-bold tracking-[-0.02em]"
            style={{
              fontSize:   "1.25rem",
              color:      "var(--brand)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {number}
          </span>
        </div>

        {/* Divider */}
        <div
          className="hidden sm:block self-stretch"
          style={{ width: "1px", background: "var(--border)" }}
        />

        {/* Summary stats */}
        <div className="flex flex-wrap gap-6 flex-1">
          {(["new", "improved", "fix"] as const).map(type => {
            const cfg   = TYPE_CONFIG[type];
            const count = countByType(type);
            if (count === 0) return null;
            return (
              <div key={type} className="flex flex-col gap-0.5">
                <span
                  className="text-[18px] font-bold tracking-[-0.02em]"
                  style={{ color: cfg.color, fontFamily: "var(--font-geist-sans)" }}
                >
                  {count}
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cfg.label}{count !== 1 ? (type === "fix" ? "es" : "s") : ""}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expand / collapse trigger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="inline-flex items-center gap-2 rounded-lg font-medium self-end sm:self-auto"
          style={{
            padding:    "9px 16px",
            fontSize:   "13px",
            background: open ? "var(--brand-light)" : "var(--surface-muted)",
            border:     `1px solid ${open ? "rgba(59,130,246,0.25)" : "var(--border-strong)"}`,
            color:      open ? "var(--brand)" : "var(--text-muted)",
            cursor:     "pointer",
            flexShrink: 0,
            transition: "all 200ms ease",
            fontFamily: "var(--font-geist-sans)",
          }}
          onMouseEnter={e => {
            if (!open) {
              e.currentTarget.style.borderColor = "var(--brand)";
              e.currentTarget.style.color       = "var(--brand)";
            }
          }}
          onMouseLeave={e => {
            if (!open) {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.color       = "var(--text-muted)";
            }
          }}
          aria-expanded={open}
          aria-controls="changelog-panel"
        >
          {open ? "Hide" : `View all ${totalChanges} changes`}
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            style={{
              transform:  open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 280ms ease",
            }}
            aria-hidden
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Changelog — collapsed by default, expands smoothly ── */}
      <div
        id="changelog-panel"
        role="region"
        aria-label="Changelog entries"
        style={{
          display:    "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 380ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Inner wrapper — overflow hidden clips the collapsed state */}
        <div style={{ overflow: "hidden" }}>
          <div
            className="flex flex-col rounded-2xl overflow-hidden"
            style={{
              border:     "1px solid var(--border)",
              background: "var(--surface)",
              opacity:    open ? 1 : 0,
              transform:  open ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 320ms ease 60ms, transform 320ms ease 60ms",
            }}
          >
            {changelog.map((entry, i) => {
              const cfg    = TYPE_CONFIG[entry.type];
              const isLast = i === changelog.length - 1;

              return (
                <div
                  key={i}
                  className="flex items-start gap-4 px-6 py-4"
                  style={{
                    borderBottom: isLast ? "none" : "1px solid var(--border)",
                  }}
                >
                  {/* Type pill */}
                  <span
                    className="inline-flex items-center justify-center rounded-md text-[10px] font-bold tracking-[0.08em] uppercase"
                    style={{
                      padding:    "3px 9px",
                      background: cfg.background,
                      border:     `1px solid ${cfg.border}`,
                      color:      cfg.color,
                      flexShrink: 0,
                      minWidth:   "64px",
                      fontFamily: "var(--font-geist-sans)",
                    }}
                  >
                    {cfg.label}
                  </span>

                  {/* Message */}
                  <p
                    className="text-[14px] leading-[1.65]"
                    style={{
                      color:      "var(--foreground)",
                      fontFamily: "var(--font-geist-sans)",
                      paddingTop: "2px",
                    }}
                  >
                    {entry.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

export default WhatsNew;