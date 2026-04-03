"use client";

// MobileView.tsx — one testimonial at a time, prev/next arrows, swipe supported.

import { useState, useRef } from "react";
import { TESTIMONIALS } from "@/data/home/testimonials";
import ChatBubble from "./ChatBubble";

const SWIPE_THRESHOLD = 40;

export default function MobileView() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);
  const startX        = useRef<number | null>(null);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(TESTIMONIALS.length - 1, next));
    setIdx(clamped);
    setKey(k => k + 1);
  };

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(idx + (diff > 0 ? 1 : -1));
    startX.current = null;
  };

  // Alternate sides for visual interest — odd index = right (blue)
  const side = idx % 2 === 0 ? "left" : "right";

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Bubble */}
      <div
        key={key}
        style={{ animation: "mobileFade 380ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <ChatBubble person={TESTIMONIALS[idx]} side={side} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <button
          onClick={() => goTo(idx - 1)}
          disabled={idx === 0}
          className="flex items-center gap-1.5 text-[13px] font-medium"
          style={{
            color:      idx === 0 ? "var(--text-subtle)" : "var(--foreground)",
            background: "none",
            border:     "none",
            cursor:     idx === 0 ? "default" : "pointer",
            padding:    0,
            transition: "color 150ms",
          }}
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Prev
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width:        i === idx ? "18px" : "6px",
                height:       "6px",
                borderRadius: "999px",
                background:   i === idx ? "var(--brand)" : "var(--border-strong)",
                border:       "none",
                padding:      0,
                cursor:       "pointer",
                transition:   "all 250ms ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(idx + 1)}
          disabled={idx === TESTIMONIALS.length - 1}
          className="flex items-center gap-1.5 text-[13px] font-medium"
          style={{
            color:      idx === TESTIMONIALS.length - 1 ? "var(--text-subtle)" : "var(--foreground)",
            background: "none",
            border:     "none",
            cursor:     idx === TESTIMONIALS.length - 1 ? "default" : "pointer",
            padding:    0,
            transition: "color 150ms",
          }}
          aria-label="Next"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes mobileFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}