"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section
      className="relative z-10 px-5 sm:px-8 py-24 sm:py-32 md:py-40"
      style={{ background: "var(--background)" }}
    >
      <div
        className="flex flex-col items-center text-center mx-auto"
        style={{ maxWidth: "600px" }}
      >

        {/* ── Eyebrow ── */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 select-none"
          style={{
            background: "var(--brand-light)",
            border:     "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <span
            className="block w-3 h-[1.5px] rounded-full"
            style={{ background: "var(--brand)" }}
          />
          <span
            className="text-[11px] font-bold tracking-[0.18em] uppercase"
            style={{ color: "var(--brand)" }}
          >
            Start today
          </span>
        </div>

        {/* ── Headline — story close ── */}
        {/* Picks up from "TRACK SMART. GROW FASTER." in the hero
            and closes the arc: you now know what Plurse does — here's the payoff */}
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.1] mb-6"
          style={{
            fontSize:   "clamp(2.2rem, 5.5vw, 3.75rem)",
            color:      "var(--foreground)",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          Track smarter · Grow faster
          {/* <br /> */}
           {/* Grow faster. */}
          <br />
          <span style={{ color: "var(--brand)" }}>Starting right now.</span>
        </h2>

        {/* ── Subline ── */}
        <p
          className="mb-12 text-center"
          style={{
            fontSize:   "clamp(15px, 2vw, 17px)",
            lineHeight: "1.75",
            color:      "var(--text-muted)",
            maxWidth:   "440px",
          }}
        >
          Everything you've seen on this page — the inventory control, the cash flow clarity,
          the customer insight — is ready for your business today.
        </p>

        {/* ── Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* PRIMARY — Download, pulsing ring focus animation */}
          <Link
            href="/download"
            className="inline-flex items-center gap-2.5 font-semibold rounded-xl"
            style={{
              padding:        "14px 32px",
              fontSize:       "16px",
              background:     "var(--brand)",
              color:          "white",
              textDecoration: "none",
              animation:      "ctaPulse 2.4s ease-in-out infinite",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.animation = "none";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--brand-hover)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.animation  = "ctaPulse 2.4s ease-in-out infinite";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--brand)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download
          </Link>

          {/* SECONDARY — Get started, ghost */}
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 font-medium rounded-xl"
            style={{
              padding:        "14px 32px",
              fontSize:       "16px",
              color:          "var(--foreground)",
              textDecoration: "none",
              border:         "1px solid var(--border-strong)",
              transition:     "border-color 150ms ease, color 150ms ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--brand)";
              (e.currentTarget as HTMLAnchorElement).style.color       = "var(--brand)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-strong)";
              (e.currentTarget as HTMLAnchorElement).style.color       = "var(--foreground)";
            }}
          >
            Get started
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* ── Platform note ── */}
        <p
          className="mt-8 text-[12px]"
          style={{
            color:      "var(--text-subtle)",
            fontFamily: "var(--font-geist-mono)",
            letterSpacing: "0.02em",
          }}
        >
          Windows · macOS · Linux · Get Started Today
        </p>

      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ctaPulse {
          0%, 100% {
            box-shadow: 0 0 0 0px rgba(59,130,246,0.55),
                        0 1px 6px rgba(59,130,246,0.25);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59,130,246,0),
                        0 1px 6px rgba(59,130,246,0.25);
          }
        }
      `}</style>
    </section>
  );
}