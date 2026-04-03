"use client";

// ActivationModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Centered modal with scrim — appears after download triggers.
// Two actions: "Get an activation key" (links to /activation) or "I have one" (closes).

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  open:     boolean;
  onClose:  () => void;
  platform: string; // e.g. "Windows" — shown in the message
}

const ActivationModal = ({ open, onClose, platform }: Props) => {
  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* ── Scrim ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-5"
        style={{
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "scrimFadeIn 250ms ease both",
        }}
        onClick={onClose}
      >
        {/* ── Modal panel — stop propagation so clicking inside doesn't close ── */}
        <div
          className="relative flex flex-col w-full"
          style={{
            maxWidth:     "420px",
            background:   "var(--surface)",
            borderRadius: "20px",
            padding:      "36px 32px 28px",
            boxShadow:    "0 24px 64px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)",
            animation:    "modalSlideUp 280ms cubic-bezier(0.22,1,0.36,1) both",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute flex items-center justify-center rounded-lg"
            style={{
              top:        "16px",
              right:      "16px",
              width:      "28px",
              height:     "28px",
              background: "var(--surface-muted)",
              border:     "none",
              cursor:     "pointer",
              color:      "var(--text-muted)",
              transition: "background 150ms, color 150ms",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--brand-light)";
              e.currentTarget.style.color      = "var(--brand)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--surface-muted)";
              e.currentTarget.style.color      = "var(--text-muted)";
            }}
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Icon */}
          <div
            className="flex items-center justify-center rounded-2xl mb-6 self-start"
            style={{
              width:      "48px",
              height:     "48px",
              background: "var(--brand-light)",
              border:     "1px solid rgba(59,130,246,0.18)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>

          {/* Heading */}
          <h3
            className="font-bold tracking-[-0.02em] mb-2"
            style={{
              fontSize:   "20px",
              color:      "var(--foreground)",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            Your {platform} download has started.
          </h3>

          {/* Body */}
          <p
            className="text-[14px] leading-[1.7] mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Plurse requires an activation key to run. Do you already have one,
            or would you like to get one now?
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {/* Primary — get a key */}
            <Link
              href="/activation"
              className="w-full flex items-center justify-center gap-2 font-semibold rounded-xl"
              style={{
                padding:        "13px 20px",
                fontSize:       "14.5px",
                background:     "var(--brand)",
                color:          "white",
                textDecoration: "none",
                transition:     "background 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--brand-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--brand)")}
              onClick={onClose}
            >
              Get an activation key
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Secondary — already have one */}
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center font-medium rounded-xl"
              style={{
                padding:    "13px 20px",
                fontSize:   "14.5px",
                background: "none",
                color:      "var(--text-muted)",
                border:     "1px solid var(--border-strong)",
                cursor:     "pointer",
                transition: "border-color 150ms, color 150ms",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--brand)";
                e.currentTarget.style.color       = "var(--brand)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.color       = "var(--text-muted)";
              }}
            >
              I already have one
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrimFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </>
  );
}


export default ActivationModal;
