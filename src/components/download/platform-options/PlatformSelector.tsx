"use client";

// PlatformSelector.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Left panel  — Activation key pill (top-right) + horizontal platform options
// Right panel — Primary file info + download button + other formats link
// Full section fills one viewport: minHeight = calc(100vh - 68px)

import Link from "next/link";
import { PLATFORMS, getPlatform } from "@/data/download/download";
import type { PlatformId } from "@/data/download/download";

// ── Platform icons ─────────────────────────────────────────────────────────────
const ICONS: Record<PlatformId, React.ReactNode> = {
  windows: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  ),
  macos: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  linux: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.336 3.59 2.856 2.65 6.848c-.27 1.183-.33 2.38-.189 3.555.142 1.176.495 2.308 1.003 3.286.508.978 1.163 1.79 1.877 2.369.17.14.353.264.54.374.187.111.376.205.568.284.192.08.386.143.578.19.193.046.388.076.583.088.196.012.393.013.593.002.2-.011.398-.035.596-.073.198-.038.396-.088.591-.151.196-.063.39-.138.582-.225.192-.088.382-.188.568-.299.376-.222.739-.486 1.079-.794.34-.308.658-.654.947-1.031.29-.378.552-.789.78-1.227.228-.438.419-.9.571-1.376.152-.476.263-.966.33-1.462.067-.496.09-1.003.067-1.514-.022-.51-.088-1.024-.193-1.535-.105-.51-.249-1.015-.428-1.508-.18-.494-.396-.973-.64-1.428-.245-.455-.52-.884-.815-1.278-.296-.394-.612-.756-.944-1.078-.332-.322-.679-.604-1.034-.846-.354-.242-.718-.445-1.085-.609-.367-.164-.74-.29-1.113-.376-.373-.086-.747-.133-1.122-.139z" />
    </svg>
  ),
};

interface Props {
  selectedPlatform: PlatformId;
  onPlatformChange: (id: PlatformId) => void;
  onDownload: () => void;
  sectionMinH: string;
}

const PlatformSelector = ({
  selectedPlatform,
  onPlatformChange,
  onDownload,
  sectionMinH,
}: Props) => {
  const platform = getPlatform(selectedPlatform);
  const primaryFile = platform.files[0];
  const otherFiles = platform.files.slice(1);

  return (
    <div
      className="flex flex-col md:grid items-center gap-12 md:gap-16 w-full h-full"
      style={{
        minHeight: sectionMinH,
        gridTemplateColumns: "1fr 1fr",
        padding: "clamp(40px, 6vh, 80px) 0",
      }}
    >

      {/* ══ LEFT PANEL ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col w-full">

        {/* ── Top row: label + activation key pill ── */}
        <div
          className="flex flex-col items-start justify-between gap-4 mb-8"
          // style={{ flexWrap: "wrap" }}
        >
          {/* Label */}
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--brand)" }}
            >
              Choose your platform
            </p>
            <h2
              className="text-[1.6rem] sm:text-[2rem] font-bold tracking-[-0.025em] leading-[1.12]"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              Download for
              <br />
              <span style={{ color: "var(--brand)" }}>{platform.label}.</span>
            </h2>
          </div>

          {/* Activation key pill — floats top-right */}
          <Link
            href="/activation"
            className="inline-flex items-center gap-2 rounded-full text-[12px] font-semibold"
            style={{
              padding: "8px 16px",
              background: "var(--brand-light)",
              border: "1px solid rgba(59,130,246,0.22)",
              color: "var(--brand)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 150ms, border-color 150ms",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(59,130,246,0.14)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.38)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--brand-light)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.22)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            Get activation key
          </Link>
        </div>

        {/* ── Platform options — horizontal ── */}
        <div
          className="flex gap-3 flex-wrap"
          role="radiogroup"
          aria-label="Select platform"
        >
          {PLATFORMS.map(p => {
            const active = p.id === selectedPlatform;
            return (
              <button
                key={p.id}
                role="radio"
                aria-checked={active}
                onClick={() => onPlatformChange(p.id)}
                className="flex items-center gap-2.5 rounded-xl font-medium"
                style={{
                  padding: "11px 20px",
                  fontSize: "14px",
                  background: active ? "var(--brand)" : "var(--surface)",
                  color: active ? "white" : "var(--text-muted)",
                  border: active
                    ? "1px solid var(--brand)"
                    : "1px solid var(--border-strong)",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  boxShadow: active
                    ? "0 2px 12px var(--brand-ring)"
                    : "none",
                  fontFamily: "var(--font-geist-sans)",
                }}
                onMouseEnter={e => {
                  if (active) return;
                  e.currentTarget.style.borderColor = "var(--brand)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
                onMouseLeave={e => {
                  if (active) return;
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                <span style={{ opacity: active ? 1 : 0.65, display: "flex" }}>
                  {ICONS[p.id]}
                </span>
                {p.label}
              </button>
            );
          })}
        </div>

        {/* ── Detected badge ── */}
        <p
          className="mt-4 text-[12px]"
          style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
        >
          ✓ Auto-detected — switch above if needed
        </p>
      </div>

      {/* ══ RIGHT PANEL ══════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col w-full rounded-2xl p-8 sm:p-10"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Platform icon + name */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "44px",
              height: "44px",
              background: "var(--brand-light)",
              border: "1px solid rgba(59,130,246,0.18)",
              color: "var(--brand)",
              flexShrink: 0,
            }}
          >
            {ICONS[selectedPlatform]}
          </span>
          <div>
            <p
              className="text-[15px] font-bold"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              Plurse for {platform.label}
            </p>
            <p
              className="text-[12px]"
              style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
            >
              v{platform.version} · {new Date(platform.released).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px" }} />

        {/* Primary file details */}
        <div className="flex flex-col gap-2 mb-8">
          <p
            className="text-[12px] font-bold tracking-[0.12em] uppercase"
            style={{ color: "var(--text-subtle)" }}
          >
            Recommended
          </p>
          <p
            className="text-[15px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {primaryFile.label}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-[12px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              {primaryFile.filename}
            </span>
            <span style={{ color: "var(--border-strong)", fontSize: "10px" }}>·</span>
            <span
              className="text-[12px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              {primaryFile.size}
            </span>
            <span style={{ color: "var(--border-strong)", fontSize: "10px" }}>·</span>
            <span
              className="text-[12px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              {primaryFile.arch}
            </span>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2.5 font-semibold rounded-xl mb-4"
          style={{
            padding: "14px 24px",
            fontSize: "15px",
            background: "var(--brand)",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "background 150ms ease, transform 120ms ease",
            boxShadow: "0 2px 12px var(--brand-ring)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--brand-hover)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "var(--brand)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download for {platform.label}
        </button>

        {/* Other formats — only shown if platform has multiple files */}
        {otherFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            <p
              className="text-[11px] font-semibold tracking-[0.1em] uppercase"
              style={{ color: "var(--text-subtle)" }}
            >
              Other formats
            </p>
            <div className="flex flex-wrap gap-2">
              {otherFiles.map(f => (
                <a
                  key={f.filename}
                  href={f.url}
                  download={f.filename}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium rounded-lg"
                  style={{
                    padding: "5px 10px",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                    background: "var(--surface-muted)",
                    textDecoration: "none",
                    transition: "color 150ms, border-color 150ms",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "var(--brand)";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 2v8M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default PlatformSelector;
