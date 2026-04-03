// SolutionsHero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Hero zone for the /solutions overview page.
// Centered, minimal — lets the grid below do the heavy lifting.

import { SOLUTION_CARDS } from "@/data/solutions/data";

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;

export default function SolutionsHero() {
  return (
    <section
      className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8"
      style={{ minHeight: SECTION_MIN_H }}
    >
      {/* Eyebrow */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 select-none"
        style={{
          background: "var(--brand-light)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <span className="block w-3 h-[1.5px] rounded-full" style={{ background: "var(--brand)" }} />
        <span
          className="text-[11px] font-bold tracking-[0.18em] uppercase"
          style={{ color: "var(--brand)" }}
        >
          {SOLUTION_CARDS.length} solutions
        </span>
      </div>

      {/* Headline */}
      <h1
        className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
        style={{
          fontSize: "clamp(2.4rem, 6vw, 4rem)",
          color: "var(--foreground)",
          fontFamily: "var(--font-geist-sans)",
          maxWidth: "680px",
        }}
      >
        One platform.
        <br />
        <span style={{ color: "var(--brand)" }}>Every solution your business needs.</span>
      </h1>

      {/* Subline */}
      <p
        style={{
          fontSize: "clamp(15px, 2vw, 17px)",
          lineHeight: "1.75",
          color: "var(--text-muted)",
          maxWidth: "460px",
          marginBottom: "0",
        }}
      >
        From inventory to cashflow, sales to your team —
        explore what Plurse can do for your business.
      </p>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: 0.45 }}
      >
        <span
          className="text-[10px] tracking-[0.16em] uppercase"
          style={{ color: "var(--text-subtle)" }}
        >
          Explore
        </span>
        <svg
          width="16" height="20" viewBox="0 0 16 20" fill="none"
          style={{ animation: "heroBounce 1.5s ease infinite" }}
        >
          <path d="M8 2v12M4 10l4 6 4-6" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @keyframes heroBounce {
          0%, 100% { transform: translateY(0);   opacity: 0.4; }
          50%       { transform: translateY(5px); opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}