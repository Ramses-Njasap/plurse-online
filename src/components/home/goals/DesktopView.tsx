"use client";

// DesktopView.tsx
// Sticky vertical scroll — section pins to viewport, slides animate in/out
// as user scrolls through the scroll runway.

import { useEffect, useRef, useState } from "react";
import { SLIDES } from "@/data/home/goals";
import SlideContent from "./SlideContent";

const SCROLL_PER_SLIDE = 100; // vh of scroll runway per slide

export default function DesktopView() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [prevIdx,   setPrevIdx]     = useState(0);
  const [animating, setAnimating]   = useState(false);
  const [dir,       setDir]         = useState<"up" | "down">("down");
  const rafRef      = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;

        const rect       = el.getBoundingClientRect();
        const scrolled   = Math.max(0, -rect.top);
        const total      = el.offsetHeight - window.innerHeight;
        const ratio      = Math.min(1, Math.max(0, scrolled / total));
        const rawIdx     = ratio * SLIDES.length;
        const newIdx     = Math.min(SLIDES.length - 1, Math.floor(rawIdx));

        setActiveIdx(prev => {
          if (newIdx !== prev) {
            setDir(newIdx > prev ? "down" : "up");
            setPrevIdx(prev);
            setAnimating(true);
            setTimeout(() => setAnimating(false), 400);
          }
          return newIdx;
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const slide = SLIDES[activeIdx];

  return (
    // Scroll runway — total height = slides × SCROLL_PER_SLIDE vh
    <div
      ref={sectionRef}
      style={{ height: `${SLIDES.length * SCROLL_PER_SLIDE}vh` }}
    >
      {/* Sticky viewport panel */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Dot nav — left side */}
        <div
          className="absolute flex flex-col gap-3 items-center"
          style={{ left: "32px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => {
                const el = sectionRef.current;
                if (!el) return;
                const ratio = i / SLIDES.length;
                const targetScroll = el.offsetTop + ratio * (el.offsetHeight - window.innerHeight);
                window.scrollTo({ top: targetScroll, behavior: "smooth" });
              }}
              style={{
                width:            i === activeIdx ? "8px" : "5px",
                height:           i === activeIdx ? "8px" : "5px",
                borderRadius:     "50%",
                background:       i === activeIdx ? "var(--brand)" : i < activeIdx ? "rgba(59,130,246,0.35)" : "var(--border-strong)",
                border:           "none",
                padding:          0,
                cursor:           "pointer",
                transition:       "all 250ms ease",
                flexShrink:       0,
              }}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div
          className="absolute"
          style={{
            right: "40px",
            bottom: "40px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "var(--text-subtle)",
          }}
        >
          {String(activeIdx + 1).padStart(2, "0")}
          <span style={{ margin: "0 4px", opacity: 0.3 }}>/</span>
          {String(SLIDES.length).padStart(2, "0")}
        </div>

        {/* Content grid */}
        <div
          className="h-full max-w-6xl mx-auto px-16 grid items-center"
          style={{ gridTemplateColumns: "1fr 1.15fr", gap: "80px" }}
        >
          {/* LEFT — text */}
          <div
            key={`text-${activeIdx}`}
            style={{
              animation: `slideText${dir === "down" ? "Up" : "Down"} 400ms cubic-bezier(0.22,1,0.36,1) both`,
            }}
          >
            <SlideContent slide={slide} />
          </div>

          {/* RIGHT — image */}
          <div
            key={`img-${activeIdx}`}
            className="relative"
            style={{
              animation: `fadeScale 450ms cubic-bezier(0.22,1,0.36,1) both`,
            }}
          >
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "3/2",
                boxShadow: "0 24px 64px rgba(15,23,42,0.1), 0 4px 16px rgba(59,130,246,0.06)",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Scroll hint — only on first slide */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{
            opacity: activeIdx === 0 ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
        >
          <span
            className="text-[10px] tracking-[0.16em] uppercase"
            style={{ color: "var(--text-subtle)" }}
          >
            Scroll to explore
          </span>
          <svg
            width="16" height="24" viewBox="0 0 16 24" fill="none"
            style={{ animation: "bounceDown 1.4s ease infinite" }}
          >
            <path d="M8 4v12M4 12l4 6 4-6" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes slideTextUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideTextDown {
          from { opacity: 0; transform: translateY(-28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(5px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}