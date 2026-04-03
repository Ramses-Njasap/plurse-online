// FeatureCallouts.tsx — bold names, single divider line, no cards

const FEATURES = [
  {
    label: "Inventory",
    desc: "Real-time stock tracking across every location and product line.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    label: "Cashflow",
    desc: "Monitor income, outgoings and projections at a glance.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    label: "Analytics",
    desc: "Actionable insights surfaced from every transaction you make.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
  },
  {
    label: "Multi-user",
    desc: "Role-based access so your whole team works without friction.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/>
      </svg>
    ),
  },
];

export default function FeatureCallouts() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-0 mx-auto mt-0"
      style={{ maxWidth: "960px" }}
    >
      {FEATURES.map(({ label, desc, icon }, i) => (
        <div
          key={label}
          className="flex flex-col gap-3 px-6 py-8"
          style={{
            borderRight:
              i < FEATURES.length - 1 ? "1px solid var(--border)" : "none",
            // On mobile collapse to 2 cols — remove right border on even items
          }}
        >
          {/* Icon */}
          <span style={{ color: "var(--brand)", display: "flex" }}>{icon}</span>

          {/* Bold label */}
          <p
            className="text-[15px] font-bold tracking-[-0.01em]"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-geist-sans)" }}
          >
            {label}
          </p>

          {/* Short line — muted, no border, no card */}
          <p
            className="text-[13px] leading-[1.65]"
            style={{ color: "var(--text-muted)" }}
          >
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}