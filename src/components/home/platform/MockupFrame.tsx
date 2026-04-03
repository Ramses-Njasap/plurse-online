"use client";

// ── GridIcon ──────────────────────────────────────────────
const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.75" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.75" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);

// Reliable Mixkit CDN direct video URLs (royalty-free, no hotlink restrictions)
// Primary: business analytics / data dashboard feel
const VIDEO_SRC_PRIMARY =
  "https://assets.mixkit.co/videos/preview/mixkit-working-on-a-computer-with-data-graphs-44513-large.mp4";
// Fallback: business office / inventory context
const VIDEO_SRC_FALLBACK =
  "https://assets.mixkit.co/videos/preview/mixkit-computer-screen-with-a-digital-dashboard-32574-large.mp4";

interface Props {
  onGalleryOpen: () => void;
}

export default function MockupFrame({ onGalleryOpen }: Props) {
  return (
    <div
      className="relative mx-auto rounded-2xl overflow-visible"
      style={{
        maxWidth: "960px",
        boxShadow:
          "0 32px 80px rgba(15,23,42,0.13), 0 8px 24px rgba(59,130,246,0.07)",
      }}
    >
      {/* ── Browser chrome bar ── */}
      <div
        className="flex items-center px-4 rounded-t-2xl"
        style={{
          height: "40px",
          background: "#f1f5f9",
          border: "1px solid var(--border)",
          borderBottom: "none",
        }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-[6px]">
          <span className="w-[11px] h-[11px] rounded-full" style={{ background: "#fc5c57" }} />
          <span className="w-[11px] h-[11px] rounded-full" style={{ background: "#fdbc2c" }} />
          <span className="w-[11px] h-[11px] rounded-full" style={{ background: "#33c748" }} />
        </div>

        {/* URL bar */}
        <div
          className="flex items-center gap-1.5 px-3 mx-auto rounded-md"
          style={{
            height: "24px",
            background: "#e2e8f0",
            width: "clamp(160px, 30%, 300px)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45, flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="#64748b" strokeWidth="1.5"/>
            <path d="M8 5v2.5L9.5 9" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span
            className="text-[10px] truncate"
            style={{ color: "#94a3b8", fontFamily: "var(--font-geist-mono)" }}
          >
            https://plurse.com
          </span>
        </div>
      </div>

      {/* ── Video area ── */}
      <div
        className="relative overflow-hidden rounded-b-2xl"
        style={{
          background: "#0f172a",
          aspectRatio: "16/9",
          border: "1px solid var(--border)",
          borderTop: "none",
        }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: 0.88 }}
        >
          <source src={VIDEO_SRC_PRIMARY} type="video/mp4" />
          <source src={VIDEO_SRC_FALLBACK} type="video/mp4" />
          {/* Ultimate fallback — static image */}
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85"
            alt="Plurse dashboard"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Subtle brand tint overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.09) 0%, transparent 55%)",
          }}
        />

        {/* Bottom vignette for depth */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "30%",
            background:
              "linear-gradient(0deg, rgba(15,23,42,0.5) 0%, transparent 100%)",
          }}
        />

        {/* ── Gallery trigger button — top right edge ── */}
        <button
          onClick={onGalleryOpen}
          aria-label="Open screenshot gallery"
          className="absolute flex items-center gap-2"
          style={{
            top: "14px",
            right: "14px",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "rgba(15,23,42,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "white",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "var(--font-geist-sans)",
            cursor: "pointer",
            letterSpacing: "0.01em",
            transition: "background 180ms ease, transform 120ms ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(59,130,246,0.72)";
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(15,23,42,0.55)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <GridIcon />
          Gallery
        </button>
      </div>
    </div>
  );
}