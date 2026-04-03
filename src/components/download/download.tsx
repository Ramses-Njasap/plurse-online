"use client";

// index.tsx — Download page parent
// ─────────────────────────────────────────────────────────────────────────────
// Owns selectedPlatform state — single source of truth for the whole page.
// All child components read from and update this one state.
//
// SECTION HEIGHT RULE (apply to every section on every page):
//   minHeight: calc(100vh - 68px)
//   where 68px = navbar height (defined in navbar.tsx)
//   This ensures each section fills exactly one viewport without overlap.

import { useState, useEffect } from "react";
import type { PlatformId } from "@/data/download/download";
import { getPlatform } from "@/data/download/download";
import { useDetectedPlatform } from "./useDetectedPlatform";
import Hero from "./header/Hero";
import PlatformSelector from "./platform-options/PlatformSelector";
import ActivationModal from "./platform-options/ActivationModal";
import InstallGuide from "./install-guide/InstallGuide";
import WhatsNew from "./version-update/WhatsNew";
// Future imports — uncomment as each section is built:
// import PlatformSelector     from "./PlatformSelector";
// import InstallGuide         from "./InstallGuide";
// import WhatsNew             from "./WhatsNew";

// ── Shared constant — import this wherever section height is needed ────────────
// Keeping it here means changing the navbar height in one place updates everything.
export const NAVBAR_H = 68; // px — must match height in navbar.tsx
export const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;

const Download = () => {
  const detectedPlatform = useDetectedPlatform();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("windows");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setSelectedPlatform(detectedPlatform);
  }, [detectedPlatform]);

  // Once detection resolves on client, sync selected to detected
  useEffect(() => {
    setSelectedPlatform(detectedPlatform);
  }, [detectedPlatform]);

  // ── Download handler ───────────────────────────────────────────────────────
  // Uses the first file for the selected platform.
  // In production: swap fake URLs in download-data.ts — nothing else changes.
  const handleDownload = () => {
    const platform = getPlatform(selectedPlatform);
    const file = platform.files[0];

    const anchor = document.createElement("a");
    anchor.href = file.url;
    anchor.download = file.filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Open activation modal after download triggers
    setModalOpen(true);
  };

  return (
    <main
      className="relative z-10 px-5 sm:px-8"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── 01 · Header zone ──────────────────────────────────────────────
            minHeight fills viewport below navbar.
            justify-content: center keeps content vertically centred.
        ── */}
        <section
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: SECTION_MIN_H }}
        >
          <Hero
            selectedPlatform={selectedPlatform}
            onDownload={handleDownload}
          />
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── 02 · Platform selector ──────────────────────────────────────── */}
        <section
          style={{ minHeight: SECTION_MIN_H }}
        >
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            onDownload={handleDownload}
            sectionMinH={SECTION_MIN_H}
          />
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── 03 · Installation guide ── */}
        <section style={{ minHeight: SECTION_MIN_H }}>
          <InstallGuide
            selectedPlatform={selectedPlatform}
            sectionMinH={SECTION_MIN_H}
          />
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── 04 · What's new ── */}
        <section style={{ minHeight: SECTION_MIN_H }}>
          <WhatsNew
            sectionMinH={SECTION_MIN_H}
          />
        </section>

      </div>

      {/* ── Activation modal — rendered outside the content flow ── */}
      <ActivationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={getPlatform(selectedPlatform).label}
      />
    </main>
  );
}

export default Download;