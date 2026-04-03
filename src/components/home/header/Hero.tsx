"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const HEADLINE = "TRACK SMART. GROW FASTER.";
const TYPE_SPEED = 55;
const NAVBAR_H = 68; // must match navbar height in px

const Hero = () => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const [showRest, setShowRest]   = useState(false);

  useEffect(() => {
    if (displayed.length < HEADLINE.length) {
      const t = setTimeout(() => {
        setDisplayed(HEADLINE.slice(0, displayed.length + 1));
      }, TYPE_SPEED);
      return () => clearTimeout(t);
    } else {
      setDone(true);
      const t = setTimeout(() => setShowRest(true), 320);
      return () => clearTimeout(t);
    }
  }, [displayed]);

  return (
    <section
      className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8"
      style={{
        minHeight: `calc(100vh - ${NAVBAR_H}px)`,
        paddingTop: "clamp(3rem, 8vh, 6rem)",
        paddingBottom: "clamp(2rem, 6vh, 4rem)",
      }}
    >
      {/* ── TOP: eyebrow + headline + subtext + buttons ── */}
      <div className="flex flex-col items-center flex-1 justify-center w-full">

        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full select-none mb-8"
          style={{
            background: "var(--brand-light)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
          <span
            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "var(--brand)" }}
          >
            Business Intelligence
          </span>
        </div>

        {/* Typewriter headline */}
        <h1
          className="font-bold leading-[1.08] mb-8 w-full"
          style={{
            color: "var(--foreground)",
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            fontFamily: "var(--font-geist-sans)",
            letterSpacing: "-0.01em",
          }}
        >
          {displayed}
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "3px",
              height: "0.82em",
              background: "var(--brand)",
              marginLeft: "5px",
              verticalAlign: "middle",
              borderRadius: "2px",
              animation: done ? "blink 1s step-start infinite" : "none",
            }}
          />
        </h1>

        {/* Subtext + buttons — fade in after typing */}
        <div
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 550ms ease, transform 550ms ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Subheadline */}
          <p
            className="max-w-lg text-[17px] sm:text-[18px] leading-[1.75] mx-auto mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Inventory, cashflow and growth —{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
              all in one place.
            </span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/download"
              className="btn-primary"
              style={{
                fontSize: "15.5px",
                padding: "0.8rem 1.875rem",
                borderRadius: "0.625rem",
                boxShadow: "0 2px 16px var(--brand-ring)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden style={{ marginRight: "6px" }}>
                <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download
            </Link>
            <Link
              href="/signup"
              className="btn-ghost"
              style={{
                fontSize: "15.5px",
                padding: "0.8rem 1.875rem",
                borderRadius: "0.625rem",
                border: "1px solid var(--border-strong)",
                color: "var(--foreground)",
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: social proof pinned near the bottom ── */}
      <div
        style={{
          opacity: showRest ? 1 : 0,
          transition: "opacity 550ms ease 200ms",
          width: "100%",
          paddingTop: "clamp(2rem, 4vh, 3rem)",
        }}
      >
        {/* Thin divider line */}
        <div
          className="mx-auto mb-6"
          style={{
            width: "40px",
            height: "1px",
            background: "var(--border-strong)",
            borderRadius: "1px",
          }}
        />

        <div
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13px]"
          style={{ color: "var(--text-subtle)" }}
        >
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" fill="var(--brand)"/>
            </svg>
            Trusted by businesses
          </span>
          <span className="hidden sm:block" style={{ color: "var(--border-strong)" }}>·</span>
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="2" y="2" width="12" height="12" rx="2.5" stroke="var(--brand)" strokeWidth="1.5"/>
              <path d="M5 8h6M8 5v6" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Windows · macOS · Linux
          </span>
          <span className="hidden sm:block" style={{ color: "var(--border-strong)" }}>·</span>
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="8" cy="8" r="6" stroke="var(--brand)" strokeWidth="1.5"/>
              <path d="M8 5v3.5l2.5 1.5" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Free to get started
          </span>
        </div>
      </div>

    </section>
  );
};

export default Hero;