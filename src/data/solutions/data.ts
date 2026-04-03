// solutions-page-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Supplements slides.ts with solutions overview page specific data.
// To add a new solution: add to slides.ts AND add a matching entry here.
// The grid layout adapts automatically — no layout code needs touching.

import { SLIDES } from "../home/goals";

export type SlideDirection = "left" | "right" | "top" | "bottom";

export interface SolutionMeta {
  id:        string;       // must match slide id exactly
  summary:   string;       // short punchy one-liner for the overlay card
  direction: SlideDirection; // which direction the hover overlay slides in from
}

// ── Per-solution metadata ─────────────────────────────────────────────────────
// direction is intentionally varied — creates the unpredictable feel
const SOLUTION_META: SolutionMeta[] = [
  {
    id:        "inventory",
    summary:   "Know exactly what you have, where it is, and when you're running low — before it costs you a sale.",
    direction: "bottom",
  },
  {
    id:        "cashflow",
    summary:   "Stop guessing where your money went. See every franc, every day, across every transaction.",
    direction: "left",
  },
  {
    id:        "sales",
    summary:   "Turn raw sales numbers into decisions that actually move your business forward.",
    direction: "top",
  },
  {
    id:        "customers",
    summary:   "Build relationships that last. Every customer, every purchase, every detail — remembered.",
    direction: "right",
  },
  {
    id:        "team",
    summary:   "Give your team the access they need. Nothing more, nothing less. Full accountability, always.",
    direction: "bottom",
  },
];

// ── Merged data — single import for the grid ──────────────────────────────────
// Merges slides.ts + metadata. Adding to slides.ts auto-includes in the grid
// as long as a matching SolutionMeta entry exists above.
export interface SolutionCard {
  id:        string;
  tag:       string;
  headline:  string;
  body:      string;
  image:     string;
  imageAlt:  string;
  href:      string;
  summary:   string;
  direction: SlideDirection;
}

export const SOLUTION_CARDS: SolutionCard[] = SLIDES
  .map(slide => {
    const meta = SOLUTION_META.find(m => m.id === slide.id);
    if (!meta) return null; // slide without meta is excluded gracefully
    return {
      id:        slide.id,
      tag:       slide.tag,
      headline:  slide.headline,
      body:      slide.body,
      image:     slide.image,
      imageAlt:  slide.imageAlt,
      href:      `/solutions/${slide.id}`,
      summary:   meta.summary,
      direction: meta.direction,
    };
  })
  .filter((s): s is SolutionCard => s !== null);

// ── Magazine layout grid config ───────────────────────────────────────────────
// Defines how cards are grouped into rows.
// Pattern repeats automatically for any number of cards.
// [1] = full width row, [2] = two-column row
// e.g. 7 cards → [1, 2, 2, 1, ...] → last card gets its own full-width row
export function getGridRows(cards: SolutionCard[]): SolutionCard[][] {
  const rows: SolutionCard[][] = [];
  const pattern = [1, 2, 2]; // repeating pattern: full, pair, pair
  let i = 0;
  let p = 0;

  while (i < cards.length) {
    const size      = pattern[p % pattern.length];
    const available = Math.min(size, cards.length - i);
    rows.push(cards.slice(i, i + available));
    i += available;
    p++;
  }

  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Defines the order of all solution pages.
// Used by SolutionNav to render prev/next links at the bottom of every page.
// To add a new solution: add it to SOLUTION_ORDER in the correct position.

export interface SolutionNavItem {
  id:    string;
  tag:   string;
  href:  string;
}

export const SOLUTION_ORDER: SolutionNavItem[] = [
  { id: "inventory", tag: "Inventory Control",      href: "/solutions/inventory" },
  { id: "cashflow",  tag: "Cash Flow Clarity",      href: "/solutions/cashflow"  },
  { id: "sales",     tag: "Sales Intelligence",     href: "/solutions/sales"     },
  { id: "customers", tag: "Customer Relationships", href: "/solutions/customers" },
  { id: "team",      tag: "Team & Access Control",  href: "/solutions/team"      },
];

export function getSolutionNav(currentId: string): {
  prev: SolutionNavItem | null;
  next: SolutionNavItem | null;
} {
  const idx  = SOLUTION_ORDER.findIndex(s => s.id === currentId);
  return {
    prev: idx > 0                           ? SOLUTION_ORDER[idx - 1] : null,
    next: idx < SOLUTION_ORDER.length - 1  ? SOLUTION_ORDER[idx + 1] : null,
  };
}