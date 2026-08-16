/* ──────────────────────────────────────────────────────────────
   Brand Panel
   Refined for Plurse identity system
────────────────────────────────────────────────────────────── */

export type PanelCopyKey =
  | "default"
  | "individual"
  | "business"
  | "finishing";

export const panelCopy: Record<
  PanelCopyKey,
  {
    eyebrow: string;
    headline: string;
    body: string;
  }
> = {
  default: {
    eyebrow: "Business infrastructure",
    headline: "The operating system for modern commerce.",
    body: "Inventory, sales, cashflow and operational visibility — unified into one intelligent workspace built for growing businesses.",
  },

  individual: {
    eyebrow: "Individual workspace",
    headline: "Run your business with precision.",
    body: "Track margins, monitor stock, understand customers and stay ahead of operational blind spots before they cost you.",
  },

  business: {
    eyebrow: "Business workspace",
    headline: "Build a shared layer of operational truth.",
    body: "From inventory to sales performance to staff activity — every critical number stays visible across your organization.",
  },

  finishing: {
    eyebrow: "Final step",
    headline: "You're moments from complete visibility.",
    body: "Create your password and enter a workspace designed to track, organize and scale your operations from day one.",
  },
};

interface BrandPanelProps {
  copyKey: PanelCopyKey;
}

const stats = [
  {
    value: "40M+",
    label: "African SMBs",
  },
  {
    value: "v1.0",
    label: "Platform release",
  },
  {
    value: "3",
    label: "Desktop platforms",
  },
];

export function BrandPanel({ copyKey }: BrandPanelProps) {
  const copy = panelCopy[copyKey];

  return (
    <div
      className="relative hidden shrink-0 overflow-hidden lg:flex lg:w-[42%] lg:flex-col"
      style={{ background: "#0a0f1a" }}
    >
      {/* ───────────────── Background Atmosphere ───────────────── */}

      {/* Top glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-120px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Bottom glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-100px",
          right: "-60px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      />

      {/* Left accent rail */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "14%",
          bottom: "14%",
          left: "0",
          width: "2px",
          opacity: 0.45,
          background:
            "linear-gradient(to bottom, transparent, var(--brand) 35%, var(--brand) 65%, transparent)",
        }}
      />

      {/* Soft overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(255,255,255,0.02), transparent 40%)",
        }}
      />

      {/* ───────────────── Main Layout ───────────────── */}

      <div className="relative z-10 flex h-full flex-col px-14 py-12">

        {/* ───────────────── Top Bar ───────────────── */}

        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{
                background: "var(--brand)",
                boxShadow: "0 0 40px rgba(59,130,246,0.18)",
              }}
            >
              <span className="text-[11px] font-bold text-white">
                P
              </span>
            </div>

            <div className="space-y-[2px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Plurse
              </p>

              <p className="text-[10px] tracking-[0.14em] text-white/22">
                Commerce Infrastructure
              </p>
            </div>
          </div>

          {/* Status */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--brand)",
                boxShadow: "0 0 12px var(--brand)",
              }}
            />

            <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">
              System online
            </span>
          </div>
        </div>

        {/* ───────────────── Main Content ───────────────── */}

        <div className="flex flex-1 flex-col justify-center">

          {/* Eyebrow */}
          <div
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              className="block h-[2px] w-3 rounded-full"
              style={{
                background: "var(--brand)",
              }}
            />

            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{
                color: "var(--brand)",
              }}
            >
              {copy.eyebrow}
            </span>
          </div>

          {/* Main copy */}
          <div className="max-w-[540px]">

            <h1
              className="font-semibold text-white"
              style={{
                fontSize: "clamp(36px, 3vw, 54px)",
                lineHeight: 1.02,
                letterSpacing: "-0.055em",
              }}
            >
              {copy.headline}
            </h1>

            <p
              className="mt-6 max-w-[430px] text-white/42"
              style={{
                fontSize: "14px",
                lineHeight: 1.85,
              }}
            >
              {copy.body}
            </p>
          </div>

          {/* Divider */}
          <div
            className="my-12"
            style={{
              height: "1px",
              width: "100%",
              background:
                "linear-gradient(to right, rgba(255,255,255,0.08), transparent)",
            }}
          />

          {/* Stats */}
          <div className="flex items-start gap-12">

            {stats.map(({ value, label }) => (
              <div key={label}>

                <p
                  className="text-white"
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {value}
                </p>

                <p
                  className="mt-1 text-white/28"
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.6,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ───────────────── Footer ───────────────── */}

        <div
          className="flex items-center justify-between pt-8"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >

          <div className="flex items-center gap-2">

            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--brand)",
                opacity: 0.65,
              }}
            />

            <p className="text-[11px] tracking-wide text-white/20">
              Windows · macOS · Linux
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-white/16">
            Designed for operational scale
          </p>
        </div>
      </div>
    </div>
  );
}