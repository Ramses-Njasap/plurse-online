"use client";

// SolutionCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Individual solution card.
// - Image + tag name visible at rest
// - On hover: overlay slides in from a random direction (set per card in data)
//   The overlay is white, almost full coverage, shows summary + navigate link
// - Direction is determined by the card's `direction` prop from data

import { useState } from "react";
import Link from "next/link";
import type { SolutionCard as SolutionCardType } from "@/data/solutions/data";

type Props = {
  card: SolutionCardType;
  tall?: boolean; // taller aspect ratio for full-width cards
};

// Translate values for each direction — overlay starts off-screen, slides to 0
const SLIDE_FROM: Record<string, { from: string; axis: "X" | "Y" }> = {
  left: { from: "-100%", axis: "X" },
  right: { from: "100%", axis: "X" },
  top: { from: "-100%", axis: "Y" },
  bottom: { from: "100%", axis: "Y" },
};

export default function SolutionCard({ card, tall = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const slide = SLIDE_FROM[card.direction];

  const overlayTransform = hovered
    ? "translate(0, 0)"
    : slide.axis === "X"
      ? `translateX(${slide.from})`
      : `translateY(${slide.from})`;

  return (
    <Link
      href={card.href}
      className="relative block w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: tall ? "21/9" : "4/3",
        textDecoration: "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Explore ${card.tag}`}
    >
      {/* ── Background image ── */}
      <img
        src={card.image}
        alt={card.imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
        draggable={false}
      />

      {/* ── Permanent dark gradient — keeps tag readable at rest ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 40%, rgba(10,14,26,0.75) 100%)",
        }}
      />

      {/* ── Tag — always visible ── */}
      <div className="absolute bottom-0 left-0 p-5 sm:p-6">
        <span
          className="text-[11px] font-bold tracking-[0.16em] uppercase mb-1 block"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {card.tag}
        </span>
        <p
          className="font-bold tracking-[-0.02em] leading-[1.2]"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "white",
            fontFamily: "var(--font-geist-sans)",
            maxWidth: "420px",
            opacity: hovered ? 0 : 1,
            transition: "opacity 200ms ease",
          }}
        >
          {card.headline}
        </p>
      </div>

      {/* ── Hover overlay — slides in from direction ── */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(4px)",
          transform: overlayTransform,
          transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)",
        }}
        aria-hidden={!hovered}
      >
        {/* Top — tag + headline */}
        <div>
          <span
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.14em] uppercase mb-4"
            style={{
              background: "var(--brand-light)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "var(--brand)",
            }}
          >
            {card.tag}
          </span>
          <h3
            className="font-bold tracking-[-0.025em] leading-[1.2] mb-4"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "var(--foreground)",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {card.headline}
          </h3>
          <p
            className="text-[14px] leading-[1.72]"
            style={{ color: "var(--text-muted)", maxWidth: "480px" }}
          >
            {card.summary}
          </p>
        </div>

        {/* Bottom — explore link */}
        <div
          className="inline-flex items-center gap-2 text-[14px] font-semibold"
          style={{ color: "var(--brand)", marginTop: "auto", paddingTop: "16px" }}
        >
          Explore {card.tag}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}