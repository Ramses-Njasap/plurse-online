// index.tsx — parent component
// Renders section header + switches between DesktopView and MobileView.

import DesktopView from "./DesktopView";
import MobileView  from "./MobileView";

export default function Testimonials() {
  return (
    <section
      className="relative z-10 px-5 sm:px-8 py-24 sm:py-32"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <div className="mb-16 sm:mb-20">
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--brand)" }}
          >
            What businesses say
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2
              className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.12]"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
            >
              Real businesses.
              <br />
              <span style={{ color: "var(--brand)" }}>Real results.</span>
            </h2>
            <p
              className="text-[15px] leading-[1.7] sm:text-right"
              style={{ color: "var(--text-muted)", maxWidth: "320px" }}
            >
              Businesses of every size trust Plurse to run smoother, grow faster and worry less.
            </p>
          </div>
        </div>

        {/* ── Desktop — two bubbles side by side ── */}
        <div className="hidden md:block">
          <DesktopView />
        </div>

        {/* ── Mobile — one bubble at a time ── */}
        <div className="md:hidden">
          <MobileView />
        </div>

      </div>
    </section>
  );
}