"use client";

// MobileView.tsx
// Horizontal swipe slider — auto-plays every 4s, pauses on user interaction,
// resumes after 8s of inactivity. Touch swipe + dot nav + prev/next supported.

import { useRef, useState, useCallback, useEffect } from "react";
import { SLIDES } from "@/data/home/goals";
import SlideContent from "./SlideContent";

// ── Config — change timing here ───────────────────────────────────────────────
const AUTO_INTERVAL   = 4000; // ms between auto-advances
const RESUME_DELAY    = 8000; // ms of inactivity before auto-play resumes
const SWIPE_THRESHOLD = 40;   // px of drag before registering a swipe

export default function MobileView() {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [paused,    setPaused]      = useState(false);
  const [progress,  setProgress]    = useState(0); // 0–100, drives progress bar

  const startXRef     = useRef<number | null>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval>  | null>(null);
  const resumeRef     = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const progressRef   = useRef<ReturnType<typeof setInterval>  | null>(null);
  const activeIdxRef  = useRef(activeIdx); // stable ref for use inside intervals

  // Keep ref in sync
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  // ── Navigate to a slide ────────────────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, idx));
    setActiveIdx(clamped);
    setProgress(0);
  }, []);

  // ── Stop progress bar ticker ───────────────────────────────────────────────
  const stopProgress = () => {
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
    setProgress(0);
  };

  // ── Start progress bar ticker ──────────────────────────────────────────────
  const startProgress = useCallback(() => {
    stopProgress();
    const step     = 100 / (AUTO_INTERVAL / 50); // update every 50ms
    let current    = 0;
    progressRef.current = setInterval(() => {
      current += step;
      setProgress(Math.min(100, current));
    }, 50);
  }, []);

  // ── Start auto-play timer ──────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startProgress();
    timerRef.current = setInterval(() => {
      const next = (activeIdxRef.current + 1) % SLIDES.length;
      goTo(next);
      startProgress(); // reset bar on each advance
    }, AUTO_INTERVAL);
  }, [goTo, startProgress]);

  // ── Pause auto-play (on user interaction) ─────────────────────────────────
  const pause = useCallback(() => {
    setPaused(true);
    stopProgress();
    if (timerRef.current)  { clearInterval(timerRef.current);  timerRef.current  = null; }
    if (resumeRef.current) { clearTimeout(resumeRef.current);  resumeRef.current = null; }
    // Resume automatically after RESUME_DELAY
    resumeRef.current = setTimeout(() => {
      setPaused(false);
      startTimer();
    }, RESUME_DELAY);
  }, [startTimer]);

  // ── Manual navigate — triggers pause ──────────────────────────────────────
  const manualGoTo = useCallback((idx: number) => {
    goTo(idx);
    pause();
  }, [goTo, pause]);

  // ── Boot auto-play on mount ────────────────────────────────────────────────
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (resumeRef.current)   clearTimeout(resumeRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [startTimer]);

  // ── Touch handlers ─────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      manualGoTo(activeIdx + (diff > 0 ? 1 : -1));
    }
    startXRef.current = null;
  };

  return (
    <div className="w-full select-none">

      {/* ── Slides track ── */}
      <div
        className="w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{
            transform:  `translateX(${-activeIdx * 100}%)`,
            transition: "transform 380ms cubic-bezier(0.4,0,0.2,1)",
            willChange: "transform",
          }}
        >
          {SLIDES.map(slide => (
            <div
              key={slide.id}
              className="flex-none w-full px-5"
              style={{ minWidth: "100%" }}
            >
              {/* Image */}
              <div
                className="w-full rounded-xl overflow-hidden mb-7"
                style={{
                  aspectRatio: "3/2",
                  boxShadow:   "0 8px 32px rgba(15,23,42,0.1)",
                  border:      "1px solid var(--border)",
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Text + buttons */}
              <SlideContent slide={slide} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress bar + dot nav row ── */}
      <div className="mt-10 px-5">

        {/* Auto-play progress bar — only visible when playing */}
        <div
          className="w-full rounded-full overflow-hidden mb-4"
          style={{
            height:     "2px",
            background: "var(--border)",
            opacity:    paused ? 0 : 1,
            transition: "opacity 300ms ease",
          }}
        >
          <div
            style={{
              height:     "100%",
              width:      `${progress}%`,
              background: "var(--brand)",
              borderRadius: "999px",
              transition: "width 50ms linear",
            }}
          />
        </div>

        {/* Dot nav + pause/play + counter */}
        <div className="flex items-center justify-between">

          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => manualGoTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width:        i === activeIdx ? "20px" : "7px",
                  height:       "7px",
                  borderRadius: "999px",
                  background:   i === activeIdx ? "var(--brand)" : "var(--border-strong)",
                  border:       "none",
                  padding:      0,
                  cursor:       "pointer",
                  transition:   "all 280ms ease",
                  flexShrink:   0,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Counter */}
            <span
              className="text-[11px]"
              style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
            >
              {String(activeIdx + 1).padStart(2, "0")}/{String(SLIDES.length).padStart(2, "0")}
            </span>

            {/* Pause / Play toggle */}
            <button
              onClick={() => {
                if (paused) { setPaused(false); startTimer(); }
                else { pause(); }
              }}
              aria-label={paused ? "Resume auto-play" : "Pause auto-play"}
              className="flex items-center justify-center rounded-lg"
              style={{
                width:      "30px",
                height:     "30px",
                background: "var(--surface-muted)",
                border:     "1px solid var(--border)",
                cursor:     "pointer",
                color:      "var(--text-muted)",
                flexShrink: 0,
                transition: "background 150ms, color 150ms",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-light)";
                (e.currentTarget as HTMLButtonElement).style.color      = "var(--brand)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-muted)";
                (e.currentTarget as HTMLButtonElement).style.color      = "var(--text-muted)";
              }}
            >
              {paused ? (
                // Play icon
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 3l10 5-10 5V3z"/>
                </svg>
              ) : (
                // Pause icon
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="2" width="4" height="12" rx="1"/>
                  <rect x="9" y="2" width="4" height="12" rx="1"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      <div className="flex items-center justify-between mt-5 px-5">
        <button
          onClick={() => manualGoTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          className="flex items-center gap-1.5 text-[13px] font-medium"
          style={{
            color:      activeIdx === 0 ? "var(--text-subtle)" : "var(--foreground)",
            background: "none",
            border:     "none",
            cursor:     activeIdx === 0 ? "default" : "pointer",
            padding:    0,
            transition: "color 150ms",
          }}
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Prev
        </button>

        <button
          onClick={() => manualGoTo(activeIdx + 1)}
          disabled={activeIdx === SLIDES.length - 1}
          className="flex items-center gap-1.5 text-[13px] font-medium"
          style={{
            color:      activeIdx === SLIDES.length - 1 ? "var(--text-subtle)" : "var(--foreground)",
            background: "none",
            border:     "none",
            cursor:     activeIdx === SLIDES.length - 1 ? "default" : "pointer",
            padding:    0,
            transition: "color 150ms",
          }}
          aria-label="Next slide"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}