"use client";

// DesktopView.tsx — two testimonials side by side per pair, WhatsApp chat style.
// Left = light bubble (received), Right = brand blue (sent).
// Prev/next arrows navigate between pairs.

import { useState } from "react";
import { PAIRS } from "@/data/home/testimonials";
import ChatBubble from "./ChatBubble";

export default function DesktopView() {
  const [idx, setIdx]     = useState(0);
  const [dir, setDir]     = useState<"left" | "right">("right");
  const [key, setKey]     = useState(0); // force re-mount for animation

  const goTo = (next: number) => {
    setDir(next > idx ? "right" : "left");
    setIdx(next);
    setKey(k => k + 1);
  };

  const pair = PAIRS[idx];

  return (
    <div className="relative">

      {/* Pair display */}
      <div
        key={key}
        className="grid items-start gap-16"
        style={{
          gridTemplateColumns: "1fr 1fr",
          animation: `pairFade 420ms cubic-bezier(0.22,1,0.36,1) both`,
        }}
      >
        {/* Left — received bubble */}
        <div style={{ paddingTop: "32px" }}>
          <ChatBubble person={pair[0]} side="left" />
        </div>

        {/* Right — sent bubble */}
        <div style={{ paddingTop: "80px" }}>
          <ChatBubble person={pair[1]} side="right" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-14">
        <button
          onClick={() => goTo(idx - 1)}
          disabled={idx === 0}
          aria-label="Previous"
          className="flex items-center justify-center rounded-full"
          style={{
            width:      "40px",
            height:     "40px",
            border:     "1px solid var(--border-strong)",
            background: "transparent",
            cursor:     idx === 0 ? "default" : "pointer",
            color:      idx === 0 ? "var(--text-subtle)" : "var(--foreground)",
            transition: "all 150ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (idx === 0) return;
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)";
            (e.currentTarget as HTMLButtonElement).style.color       = "var(--brand)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
            (e.currentTarget as HTMLButtonElement).style.color       = idx === 0 ? "var(--text-subtle)" : "var(--foreground)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Pair counter */}
        <span
          style={{
            fontSize:   "12px",
            color:      "var(--text-subtle)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          {String(idx + 1).padStart(2, "0")} / {String(PAIRS.length).padStart(2, "0")}
        </span>

        <button
          onClick={() => goTo(idx + 1)}
          disabled={idx === PAIRS.length - 1}
          aria-label="Next"
          className="flex items-center justify-center rounded-full"
          style={{
            width:      "40px",
            height:     "40px",
            border:     "1px solid var(--border-strong)",
            background: "transparent",
            cursor:     idx === PAIRS.length - 1 ? "default" : "pointer",
            color:      idx === PAIRS.length - 1 ? "var(--text-subtle)" : "var(--foreground)",
            transition: "all 150ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (idx === PAIRS.length - 1) return;
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)";
            (e.currentTarget as HTMLButtonElement).style.color       = "var(--brand)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
            (e.currentTarget as HTMLButtonElement).style.color       = idx === PAIRS.length - 1 ? "var(--text-subtle)" : "var(--foreground)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes pairFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}