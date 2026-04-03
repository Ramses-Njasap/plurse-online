// whats-new-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All What's New content lives here — version, release date, changelog.
// To update for a new release, only touch this file.

export type ChangelogType = "new" | "improved" | "fix";

export interface ChangelogEntry {
  type:    ChangelogType;
  message: string;
}

export interface VersionData {
  number:    string;
  released:  string; // ISO date
  changelog: ChangelogEntry[];
}

export const WHATS_NEW: VersionData = {
  number:   "1.0.0",
  released: "2025-03-01",
  changelog: [
    { type: "new",      message: "Initial public release of Plurse."                          },
    { type: "new",      message: "Real-time inventory tracking across all product categories." },
    { type: "new",      message: "Cash flow dashboard with monthly and weekly breakdowns."     },
    { type: "new",      message: "Multi-user access with role-based permissions."              },
    { type: "new",      message: "Customer profiles with purchase history and contact info."   },
    { type: "new",      message: "Activity log for full team accountability."                  },
    { type: "new",      message: "Sales analytics with exportable reports."                    },
    { type: "improved", message: "Optimised startup time across all platforms."                },
    { type: "fix",      message: "Resolved sync issue on first-time account setup."            },
  ],
};

// ── Label config — kept here so data and presentation tokens stay together ────
export const TYPE_CONFIG: Record<ChangelogType, {
  label:      string;
  background: string;
  border:     string;
  color:      string;
}> = {
  new: {
    label:      "New",
    background: "rgba(59,130,246,0.08)",
    border:     "rgba(59,130,246,0.2)",
    color:      "var(--brand)",
  },
  improved: {
    label:      "Improved",
    background: "rgba(16,185,129,0.07)",
    border:     "rgba(16,185,129,0.2)",
    color:      "#10b981",
  },
  fix: {
    label:      "Fix",
    background: "rgba(245,158,11,0.07)",
    border:     "rgba(245,158,11,0.2)",
    color:      "#f59e0b",
  },
};