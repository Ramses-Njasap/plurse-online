"use client";

// ActivationModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shown after download triggers.
// Uses React Portals to break out of parent stacking contexts (z-index/relative containers).
//
// "Get an activation key" → NewKeyModal (standalone mode, create-only)
//                         → PaymentModal (gated inside NewKeyModal)
//                         → KeyDeliveryModal (copy + auto-download .txt)
// "I already have one"   → closes as before

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NewKeyModal } from "@/components/dashboard/my/keys/new-key-modal";
import { KeyDeliveryModal } from "./KeyDeliveryModal";
import type { AccessKey } from "@/types/users.types";

interface Props {
  open: boolean;
  onClose: () => void;
  platform: string;
}

type InnerView = "prompt" | "new-key" | "delivery";

const ActivationModal = ({ open, onClose, platform }: Props) => {
  const [view, setView] = useState<InnerView>("prompt");
  const [createdKey, setCreatedKey] = useState<AccessKey | null>(null);
  const [mounted, setMounted] = useState(false);

  /* Ensure component is mounted on client before rendering portal */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Reset inner state whenever the modal is opened */
  useEffect(() => {
    if (open) {
      setView("prompt");
      setCreatedKey(null);
    }
  }, [open]);

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ESC — only on the prompt view; inner modals handle their own ESC */
  useEffect(() => {
    if (!open || view !== "prompt") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, view, onClose]);

  if (!open || !mounted) return null;

  /* Helper function to evaluate which modal frame to output */
  const renderContent = () => {
    /* ── "Get a key" button clicked → mount NewKeyModal ── */
    if (view === "new-key") {
      return (
        <NewKeyModal
          standalone /* create-only, no "link to business" */
          onClose={() => setView("prompt")} /* cancel → back to prompt */
          onKeyCreated={(key) => {
            setCreatedKey(key);
            setView("delivery"); /* success → delivery modal */
          }}
        />
      );
    }

    /* ── Key created → delivery modal ── */
    if (view === "delivery" && createdKey) {
      return (
        <KeyDeliveryModal
          accessKey={createdKey}
          platform={platform}
          onClose={() => {
            setView("prompt");
            onClose(); /* close the whole activation flow */
          }}
        />
      );
    }

    /* ── Default: the original prompt modal ── */
    return (
      <>
        {/* Scrim — High z-index to clear sticky headers */}
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-6"
          style={{
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            animation: "scrimFadeIn 250ms ease both",
          }}
          onClick={onClose}
        >
          {/* Panel — Constrained height prevents viewport clipping */}
          <div
            className="relative flex w-full max-h-[90vh] flex-col overflow-y-auto"
            style={{
              maxWidth: "420px",
              background: "var(--surface)",
              borderRadius: "20px",
              padding: "36px 32px 28px",
              boxShadow:
                "0 24px 64px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)",
              animation: "modalSlideUp 280ms cubic-bezier(0.22,1,0.36,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute flex items-center justify-center rounded-lg"
              style={{
                top: "16px",
                right: "16px",
                width: "28px",
                height: "28px",
                background: "var(--surface-muted)",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "background 150ms, color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--brand-light)";
                e.currentTarget.style.color = "var(--brand)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface-muted)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Icon */}
            <div
              className="mb-6 flex items-center justify-center self-start rounded-2xl"
              style={{
                width: "48px",
                height: "48px",
                background: "var(--brand-light)",
                border: "1px solid rgba(59,130,246,0.18)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>

            {/* Heading */}
            <h3
              className="mb-2 font-bold tracking-[-0.02em]"
              style={{
                fontSize: "20px",
                color: "var(--foreground)",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              Your {platform} download has started.
            </h3>

            {/* Body */}
            <p
              className="mb-8 text-[14px] leading-[1.7]"
              style={{ color: "var(--text-muted)" }}
            >
              Plurse requires an activation key to run. Do you already have one,
              or would you like to get one now?
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Primary — get a key → opens NewKeyModal */}
              <button
                type="button"
                onClick={() => setView("new-key")}
                className="flex w-full items-center justify-center gap-2 rounded-xl font-semibold text-white transition-all"
                style={{
                  padding: "13px 20px",
                  fontSize: "14.5px",
                  background: "var(--brand)",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--brand-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--brand)")
                }
              >
                Get an activation key
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Secondary — already have one */}
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-xl font-medium transition-all"
                style={{
                  padding: "13px 20px",
                  fontSize: "14.5px",
                  background: "none",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-strong)",
                  cursor: "pointer",
                  transition: "border-color 150ms, color 150ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand)";
                  e.currentTarget.style.color = "var(--brand)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.color = "var(--text-muted)";
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
  };

  /* Render straight to body element to escape DOM tree hierarchy & z-index isolation */
  return createPortal(renderContent(), document.body);
};

export default ActivationModal;