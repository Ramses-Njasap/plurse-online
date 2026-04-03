// index.tsx — parent component
// Renders SectionHeader + switches between DesktopView and MobileView
// based on screen size using Tailwind's hidden/block utilities.

import SectionHeader from "./SectionHeader";
import DesktopView   from "./DesktopView";
import MobileView    from "./MobileView";

export default function Goals() {
  return (
    <section style={{ background: "var(--background)" }}>

      {/* ── Shared header — shown on both viewports ── */}
      <div className="px-5 sm:px-8 pt-24 sm:pt-32 max-w-6xl mx-auto">
        <SectionHeader />
      </div>

      {/* ── Desktop: sticky vertical scroll (md and up) ── */}
      <div className="hidden md:block">
        <DesktopView />
      </div>

      {/* ── Mobile: horizontal swipe slider (below md) ── */}
      <div className="md:hidden pb-20">
        <MobileView />
      </div>

    </section>
  );
}