"use client";

import { useState } from "react";
import MockupFrame from "./MockupFrame";
import FeatureCallouts from "./FeatureCallouts";
import GalleryModal from "./GalleryModal";

export default function Platform() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <section className="relative z-10 px-5 sm:px-8 py-24 sm:py-32">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ── */}
        <div className="text-center mb-14">
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-5"
            style={{ color: "var(--brand)" }}
          >
            The Platform
          </p>
          <h2
            className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.025em] leading-[1.15]"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            Less guessing. More growing.
            <br className="hidden sm:block" />
            <span style={{ color: "var(--brand)" }}> Run your business with clarity and control.</span>
          </h2>
        </div>

        {/* ── Browser mockup ── */}
        <MockupFrame onGalleryOpen={() => setGalleryOpen(true)} />

        {/* ── Divider ── */}
        <div
          className="mx-auto my-10"
          style={{
            maxWidth: "960px",
            height: "1px",
            background: "var(--border)",
          }}
        />

        {/* ── Feature callouts ── */}
        <FeatureCallouts />
      </div>

      {/* ── Gallery modal ── */}
      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </section>
  );
}