"use client";

// DownloadHero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Header zone of the download page.
// Shows a bold headline, subheadline, and a Download button that reflects
// the currently selected platform (detected automatically, changeable later).

import Link from "next/link";
import type { PlatformId } from "@/data/download/download";
import { getPlatform } from "@/data/download/download";

// Platform icons — inline SVGs, no external dependency
const PLATFORM_ICONS: Record<PlatformId, React.ReactNode> = {
  windows: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>
  ),
  macos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  linux: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.336 3.59 2.856 2.65 6.848c-.27 1.183-.33 2.38-.189 3.555.142 1.176.495 2.308 1.003 3.286.508.978 1.163 1.79 1.877 2.369.17.14.353.264.54.374.187.111.376.205.568.284.192.08.386.143.578.19.193.046.388.076.583.088.196.012.393.013.593.002.2-.011.398-.035.596-.073.198-.038.396-.088.591-.151.196-.063.39-.138.582-.225.192-.088.382-.188.568-.299.376-.222.739-.486 1.079-.794.34-.308.658-.654.947-1.031.29-.378.552-.789.78-1.227.228-.438.419-.9.571-1.376.152-.476.263-.966.33-1.462.067-.496.09-1.003.067-1.514-.022-.51-.088-1.024-.193-1.535-.105-.51-.249-1.015-.428-1.508-.18-.494-.396-.973-.64-1.428-.245-.455-.52-.884-.815-1.278-.296-.394-.612-.756-.944-1.078-.332-.322-.679-.604-1.034-.846-.354-.242-.718-.445-1.085-.609-.367-.164-.74-.29-1.113-.376-.373-.086-.747-.133-1.122-.139z"/>
    </svg>
  ),
};

interface Props {
  selectedPlatform: PlatformId;
  onDownload:       () => void; // triggers download in parent
}

const Hero = ({ selectedPlatform, onDownload }: Props) => {
  const platform = getPlatform(selectedPlatform);
  const file     = platform.files[0]; // primary file for detected platform

  return (
    <div className="text-center flex flex-col items-center">

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
          Version {platform.version} — Now Available
        </span>
      </div>

      {/* ── Headline ── */}
      <h1
        className="font-bold tracking-[-0.03em] leading-[1.08] mb-5"
        style={{
          fontSize:   "clamp(2.4rem, 6vw, 4rem)",
          color:      "var(--foreground)",
          fontFamily: "var(--font-geist-sans)",
          maxWidth:   "680px",
        }}
      >
        Bigger business starts
        <br />
        <span style={{ color: "var(--brand)" }}>from a single download.</span>
      </h1>

      {/* ── Subheadline — platform name is dynamic, reflects detected OS ── */}
      <p
        className="mb-10"
        style={{
          fontSize:   "clamp(15px, 2vw, 17px)",
          lineHeight: "1.75",
          color:      "var(--text-muted)",
          maxWidth:   "480px",
        }}
      >
        Install Plurse on your{" "}
        <span style={{ color: "var(--foreground)" }}>
          {platform.label}
        </span>{" "}
        and start making decisions backed by real data — inventory,
        cash flow and growth, all visible from day one.
      </p>

      {/* ── Download button — reflects detected/selected platform ── */}
      <button
        onClick={onDownload}
        className="inline-flex items-center gap-3 font-semibold rounded-xl"
        style={{
          padding:    "15px 32px",
          fontSize:   "16px",
          background: "var(--brand)",
          color:      "white",
          border:     "none",
          cursor:     "pointer",
          animation:  "ctaPulse 2.4s ease-in-out infinite",
          transition: "background 150ms ease, transform 150ms ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.animation   = "none";
          e.currentTarget.style.background  = "var(--brand-hover)";
          e.currentTarget.style.transform   = "translateY(-1px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.animation   = "ctaPulse 2.4s ease-in-out infinite";
          e.currentTarget.style.background  = "var(--brand)";
          e.currentTarget.style.transform   = "translateY(0)";
        }}
      >
        {/* Platform icon */}
        <span style={{ display: "flex", alignItems: "center" }}>
          {PLATFORM_ICONS[selectedPlatform]}
        </span>

        {/* Label reflects detected OS */}
        Download for {platform.label}

        {/* Arrow */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── File info — size + arch ── */}
      <p
        className="mt-4 text-[12px]"
        style={{
          color:      "var(--text-subtle)",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        {file.filename} · {file.size} · {file.arch}
      </p>

      {/* ── Pulse keyframe — reused from CTA ── */}
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
    </div>
  );
}

export default Hero;