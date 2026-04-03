"use client";

// InstallGuide.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Tabs at the top (synced to selectedPlatform) + step progress indicator.
// Steps are stacked vertically with a connecting line between them.
// Switching platform in PlatformSelector auto-switches the active tab.

import { useState, useEffect } from "react";
import { PLATFORMS, getPlatform } from "@/data/download/download";
import type { PlatformId }        from "@/data/download/download";

// ── Platform icons (small, for tabs) ──────────────────────────────────────────
const TAB_ICONS: Record<PlatformId, React.ReactNode> = {
  windows: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>
  ),
  macos: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  linux: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.336 3.59 2.856 2.65 6.848c-.27 1.183-.33 2.38-.189 3.555.142 1.176.495 2.308 1.003 3.286.508.978 1.163 1.79 1.877 2.369.17.14.353.264.54.374.187.111.376.205.568.284.192.08.386.143.578.19.193.046.388.076.583.088.196.012.393.013.593.002.2-.011.398-.035.596-.073.198-.038.396-.088.591-.151.196-.063.39-.138.582-.225.192-.088.382-.188.568-.299.376-.222.739-.486 1.079-.794.34-.308.658-.654.947-1.031.29-.378.552-.789.78-1.227.228-.438.419-.9.571-1.376.152-.476.263-.966.33-1.462.067-.496.09-1.003.067-1.514-.022-.51-.088-1.024-.193-1.535-.105-.51-.249-1.015-.428-1.508-.18-.494-.396-.973-.64-1.428-.245-.455-.52-.884-.815-1.278-.296-.394-.612-.756-.944-1.078-.332-.322-.679-.604-1.034-.846-.354-.242-.718-.445-1.085-.609-.367-.164-.74-.29-1.113-.376-.373-.086-.747-.133-1.122-.139z"/>
    </svg>
  ),
};

interface Props {
  selectedPlatform: PlatformId;
  sectionMinH: string;
}

export default function InstallGuide({ selectedPlatform, sectionMinH }: Props) {
  // Active tab syncs with selectedPlatform from parent
  const [activeTab, setActiveTab] = useState<PlatformId>(selectedPlatform);
  // Track which steps are "done" — user can click to mark complete
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Sync tab when parent platform changes
  useEffect(() => {
    setActiveTab(selectedPlatform);
    setCompletedSteps({}); // reset progress when platform changes
  }, [selectedPlatform]);

  // Reset progress when user manually switches tab
  const handleTabChange = (id: PlatformId) => {
    setActiveTab(id);
    setCompletedSteps({});
  };

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const platform     = getPlatform(activeTab);
  const steps        = platform.steps;
  const doneCount    = Object.values(completedSteps).filter(Boolean).length;
  const progressPct  = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: sectionMinH,
        padding:   "clamp(40px, 6vh, 80px) 0",
      }}
    >
      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: "var(--brand)" }}
        >
          Installation Guide
        </p>
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
        >
          <h2
            className="text-[1.75rem] sm:text-[2.25rem] font-bold tracking-[-0.025em] leading-[1.12]"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)", margin: 0 }}
          >
            Up and running
            <br />
            <span style={{ color: "var(--brand)" }}>in minutes.</span>
          </h2>
          <p
            className="text-[14px] leading-[1.7] sm:text-right"
            style={{ color: "var(--text-muted)", maxWidth: "300px", margin: 0, flexShrink: 0 }}
          >
            Follow the steps below for your platform. Click each step to mark it done.
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex items-center gap-2 mb-2 flex-wrap"
        role="tablist"
        aria-label="Platform installation guides"
      >
        {PLATFORMS.map(p => {
          const active = p.id === activeTab;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${p.id}`}
              onClick={() => handleTabChange(p.id)}
              className="inline-flex items-center gap-2 rounded-lg font-medium"
              style={{
                padding:    "9px 18px",
                fontSize:   "13.5px",
                background:  active ? "var(--brand)"      : "transparent",
                color:       active ? "white"             : "var(--text-muted)",
                border:      active
                  ? "1px solid var(--brand)"
                  : "1px solid var(--border-strong)",
                cursor:     "pointer",
                transition: "all 200ms ease",
                fontFamily: "var(--font-geist-sans)",
              }}
              onMouseEnter={e => {
                if (active) return;
                e.currentTarget.style.color       = "var(--foreground)";
                e.currentTarget.style.borderColor = "var(--brand)";
              }}
              onMouseLeave={e => {
                if (active) return;
                e.currentTarget.style.color       = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
            >
              <span style={{ opacity: active ? 1 : 0.6, display: "flex" }}>
                {TAB_ICONS[p.id]}
              </span>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* ── Step progress indicator ── */}
      <div className="mb-8">
        {/* Bar */}
        <div
          className="w-full rounded-full overflow-hidden mb-2"
          style={{ height: "3px", background: "var(--border)" }}
        >
          <div
            style={{
              height:     "100%",
              width:      `${progressPct}%`,
              background: progressPct === 100 ? "#10b981" : "var(--brand)",
              borderRadius: "999px",
              transition: "width 350ms ease, background 300ms ease",
            }}
          />
        </div>
        {/* Label */}
        <div className="flex items-center justify-between">
          <p
            className="text-[11px]"
            style={{ color: "var(--text-subtle)", fontFamily: "var(--font-geist-mono)" }}
          >
            {doneCount} of {steps.length} steps completed
          </p>
          {progressPct === 100 && (
            <p
              className="text-[11px] font-semibold"
              style={{ color: "#10b981" }}
            >
              ✓ All done — launch Plurse!
            </p>
          )}
        </div>
      </div>

      {/* ── Steps panel ── */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-label={`${platform.label} installation steps`}
        key={activeTab} // re-mounts on tab change → CSS animation replays
        style={{ animation: "stepsFadeIn 320ms ease both" }}
      >
        <div className="flex flex-col">
          {steps.map((step, i) => {
            const done    = !!completedSteps[i];
            const isLast  = i === steps.length - 1;

            return (
              <div key={i} className="flex gap-5">

                {/* ── Left: number + connecting line ── */}
                <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                  {/* Step number circle */}
                  <button
                    onClick={() => toggleStep(i)}
                    aria-label={done ? `Unmark step ${i + 1}` : `Mark step ${i + 1} as done`}
                    className="flex items-center justify-center rounded-full font-bold"
                    style={{
                      width:      "36px",
                      height:     "36px",
                      flexShrink: 0,
                      background:  done ? "#10b981"         : "var(--surface)",
                      border:      done
                        ? "2px solid #10b981"
                        : "2px solid var(--border-strong)",
                      color:       done ? "white"           : "var(--text-muted)",
                      fontSize:    "13px",
                      cursor:      "pointer",
                      transition:  "all 220ms ease",
                    }}
                    onMouseEnter={e => {
                      if (done) return;
                      e.currentTarget.style.borderColor = "var(--brand)";
                      e.currentTarget.style.color       = "var(--brand)";
                    }}
                    onMouseLeave={e => {
                      if (done) return;
                      e.currentTarget.style.borderColor = "var(--border-strong)";
                      e.currentTarget.style.color       = "var(--text-muted)";
                    }}
                  >
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </button>

                  {/* Connecting line — hidden on last step */}
                  {!isLast && (
                    <div
                      style={{
                        width:      "2px",
                        flex:       1,
                        minHeight:  "32px",
                        background:  done
                          ? "linear-gradient(180deg, #10b981 0%, var(--border) 100%)"
                          : "var(--border)",
                        margin:     "4px 0",
                        borderRadius: "1px",
                        transition: "background 300ms ease",
                      }}
                    />
                  )}
                </div>

                {/* ── Right: step content ── */}
                <div
                  style={{
                    paddingBottom: isLast ? 0 : "28px",
                    paddingTop:    "4px",
                    opacity:       done ? 0.5 : 1,
                    transition:    "opacity 220ms ease",
                  }}
                >
                  <p
                    className="text-[15px] font-semibold mb-1.5"
                    style={{
                      color:          done ? "var(--text-muted)" : "var(--foreground)",
                      fontFamily:     "var(--font-geist-sans)",
                      textDecoration: done ? "line-through" : "none",
                      transition:     "color 220ms, text-decoration 220ms",
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="text-[14px] leading-[1.72]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes stepsFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}