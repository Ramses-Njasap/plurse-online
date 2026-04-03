// SectionHeader.tsx — centered header above the slides

export default function SectionHeader() {
  return (
    <div className="text-center mb-20 sm:mb-24">
      <p
        className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
        style={{ color: "var(--brand)" }}
      >
        What we do
      </p>
      <h2
        className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.12] mb-5"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
      >
        Everything your business needs
        <br className="hidden sm:block" />
        <span style={{ color: "var(--brand)" }}> to grow with confidence.</span>
      </h2>
      <p
        className="text-[16px] leading-[1.7] mx-auto"
        style={{ color: "var(--text-muted)", maxWidth: "460px" }}
      >
        From stock to sales to your team — Plurse handles the detail so you can focus on growth.
      </p>
    </div>
  );
}