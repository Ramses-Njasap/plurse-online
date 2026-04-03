"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GALLERY_IMAGES, GalleryImage } from "@/data/home/gallery";

interface ExpandedState {
  img: GalleryImage;
  rect: DOMRect;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GalleryModal({ open, onClose }: Props) {
  const [visible, setVisible]           = useState(false);
  const [expanded, setExpanded]         = useState<ExpandedState | null>(null);
  const [expandedFull, setExpandedFull] = useState(false);
  const overlayRef                      = useRef<HTMLDivElement>(null);

  // Fade in on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (expanded) collapseImage();
        else handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, expanded]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 320);
  }, [onClose]);

  // Click image → capture its DOM rect → animate expand
  const handleImageClick = (img: GalleryImage, e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setExpanded({ img, rect });
    // small tick then go full
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setExpandedFull(true));
    });
  };

  const collapseImage = () => {
    setExpandedFull(false);
    setTimeout(() => setExpanded(null), 420);
  };

  if (!open) return null;

  // Masonry: split into 3 columns manually for organic heights
  const col1 = [GALLERY_IMAGES[0], GALLERY_IMAGES[3], GALLERY_IMAGES[6]];
  const col2 = [GALLERY_IMAGES[1], GALLERY_IMAGES[4], GALLERY_IMAGES[7]];
  const col3 = [GALLERY_IMAGES[2], GALLERY_IMAGES[5]];

  return (
    <>
      {/* ══ OVERLAY ══════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed inset-0 flex flex-col"
        style={{
          zIndex: 200,
          background: "#080e1c",
          opacity: visible ? 1 : 0,
          transition: "opacity 320ms ease",
        }}
      >
        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between px-6 sm:px-10 shrink-0"
          style={{
            height: "56px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center w-6 h-6 rounded-[5px] text-white text-[11px] font-bold select-none"
              style={{ background: "var(--brand)" }}
            >
              P
            </span>
            <span
              className="text-[13.5px] font-medium"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-geist-sans)" }}
            >
              Screenshots
            </span>
          </div>

          <span
            className="text-[12px] tracking-[0.06em]"
            style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-geist-mono)" }}
          >
            {GALLERY_IMAGES.length} images
          </span>

          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              transition: "background 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            aria-label="Close gallery"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Masonry grid ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              alignItems: "start",
            }}
          >
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              {col1.filter(Boolean).map(img => (
                <MasonryItem
                  key={img.id}
                  img={img}
                  tall={img.tall}
                  onClick={handleImageClick}
                />
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              {col2.filter(Boolean).map(img => (
                <MasonryItem
                  key={img.id}
                  img={img}
                  tall={img.tall}
                  onClick={handleImageClick}
                />
              ))}
            </div>

            {/* Column 3 — fewer items = more negative space */}
            <div className="flex flex-col gap-3">
              {col3.filter(Boolean).map(img => (
                <MasonryItem
                  key={img.id}
                  img={img}
                  tall={img.tall}
                  onClick={handleImageClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ EXPANDED IMAGE — Google Photos style ══════════════════ */}
      {expanded && (
        <ExpandedImage
          img={expanded.img}
          originRect={expanded.rect}
          full={expandedFull}
          onCollapse={collapseImage}
        />
      )}
    </>
  );
}

// ── Masonry tile ─────────────────────────────────────────────────────────────
function MasonryItem({
  img,
  tall,
  onClick,
}: {
  img: GalleryImage;
  tall?: boolean;
  onClick: (img: GalleryImage, e: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <button
      className="relative overflow-hidden rounded-xl w-full group"
      style={{
        aspectRatio: tall ? "3/4" : "4/3",
        cursor: "zoom-in",
        border: "none",
        padding: 0,
        display: "block",
        background: "#1e293b",
      }}
      onClick={e => onClick(img, e)}
      aria-label={`View ${img.label}`}
    >
      <img
        src={img.src}
        alt={img.label}
        className="w-full h-full object-cover"
        style={{
          transition: "transform 400ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 300ms ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
        }}
      />
      {/* Label on hover */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end pb-3 px-3"
        style={{
          background: "linear-gradient(0deg, rgba(8,14,28,0.75) 0%, transparent 100%)",
          height: "60%",
          opacity: 0,
          transition: "opacity 250ms ease",
          pointerEvents: "none",
        }}
        ref={el => {
          // show label on parent hover via CSS sibling trick isn't possible in inline,
          // we handle via group hover with a data attribute instead
        }}
      >
        <span
          className="text-[12px] font-medium"
          style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-geist-sans)" }}
        >
          {img.label}
        </span>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          transition: "background 250ms ease",
          pointerEvents: "none",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.08)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      />
    </button>
  );
}

// ── Expanded image (Google Photos style) ────────────────────────────────────
function ExpandedImage({
  img,
  originRect,
  full,
  onCollapse,
}: {
  img: GalleryImage;
  originRect: DOMRect;
  full: boolean;
  onCollapse: () => void;
}) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Start: match the thumbnail's position/size exactly
  const startStyle = {
    position: "fixed" as const,
    left: originRect.left,
    top: originRect.top,
    width: originRect.width,
    height: originRect.height,
    borderRadius: "12px",
    objectFit: "cover" as const,
    zIndex: 300,
    cursor: "zoom-out",
    transition: full
      ? "left 420ms cubic-bezier(0.4,0,0.2,1), top 420ms cubic-bezier(0.4,0,0.2,1), width 420ms cubic-bezier(0.4,0,0.2,1), height 420ms cubic-bezier(0.4,0,0.2,1), border-radius 420ms ease"
      : "left 380ms cubic-bezier(0.4,0,0.2,1), top 380ms cubic-bezier(0.4,0,0.2,1), width 380ms cubic-bezier(0.4,0,0.2,1), height 380ms cubic-bezier(0.4,0,0.2,1), border-radius 380ms ease",
  };

  // End: full screen (with padding)
  const pad = 48;
  const targetW = vw - pad * 2;
  const targetH = vh - pad * 2;

  const fullStyle = {
    left: pad,
    top: pad,
    width: targetW,
    height: targetH,
    borderRadius: "16px",
  };

  const currentStyle = full
    ? { ...startStyle, ...fullStyle }
    : startStyle;

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 250,
          background: "rgba(4,8,18,0.92)",
          opacity: full ? 1 : 0,
          transition: "opacity 380ms ease",
          cursor: "zoom-out",
        }}
        onClick={onCollapse}
      />

      {/* The image itself — animates from thumb position to fullscreen */}
      <img
        src={img.src}
        alt={img.label}
        style={currentStyle}
        onClick={onCollapse}
      />

      {/* Label — fades in when full */}
      <div
        className="fixed flex items-center gap-3"
        style={{
          zIndex: 310,
          bottom: pad + 20,
          left: pad + 16,
          opacity: full ? 1 : 0,
          transition: "opacity 300ms ease 200ms",
          pointerEvents: "none",
        }}
      >
        <span
          className="px-3 py-1.5 rounded-lg text-[13px] font-medium"
          style={{
            background: "rgba(8,14,28,0.65)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          {img.label}
        </span>
      </div>

      {/* Close hint */}
      <button
        onClick={onCollapse}
        className="fixed flex items-center justify-center w-9 h-9 rounded-lg"
        style={{
          zIndex: 310,
          top: pad + 8,
          right: pad + 8,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          cursor: "pointer",
          opacity: full ? 1 : 0,
          transition: "opacity 300ms ease 180ms, background 150ms",
        }}
        aria-label="Close expanded image"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  );
}