// SlideContent.tsx — shared text + button block used by both desktop and mobile

import Link from "next/link";
import type { Slide } from "@/data/home/goals";

interface Props {
  slide: Slide;
}

export default function SlideContent({ slide }: Props) {
  return (
    <div className="flex flex-col">

      {/* Tag */}
      <div className="mb-5">
        <span
          className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md"
          style={{
            background: "var(--brand-light)",
            color: "var(--brand)",
            border: "1px solid rgba(59,130,246,0.18)",
          }}
        >
          {slide.tag}
        </span>
      </div>

      {/* Headline */}
      <h3
        className="text-[1.5rem] sm:text-[1.875rem] font-bold tracking-[-0.025em] leading-[1.2] mb-5"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
      >
        {slide.headline}
      </h3>

      {/* Body */}
      <p
        className="text-[15px] leading-[1.75] mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        {slide.body}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Primary — always "Get started" */}
        <Link
          href={slide.primaryCta.href}
          className="btn-primary"
          style={{
            fontSize: "14px",
            padding: "0.65rem 1.4rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 8px var(--brand-ring)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {slide.primaryCta.label}
        </Link>

        {/* Secondary — unique per slide */}
        <Link
          href={slide.secondaryCta.href}
          className="inline-flex items-center justify-center gap-1.5 text-[14px] font-medium"
          style={{
            color: "var(--foreground)",
            padding: "0.65rem 1.4rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border-strong)",
            textDecoration: "none",
            transition: "border-color 150ms ease, color 150ms ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--brand)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-strong)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
          }}
        >
          {slide.secondaryCta.label}
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}