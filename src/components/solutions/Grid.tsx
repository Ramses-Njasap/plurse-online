// SolutionsGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders all solution cards in a dynamic magazine layout.
// Layout pattern is defined in solutions-page-data.ts — no layout code here.
// Adding a new solution to the data auto-renders it in the correct grid row.

import { SOLUTION_CARDS, getGridRows } from "@/data/solutions/data";
import SolutionCard from "./Card";

export default function SolutionsGrid() {
  const rows = getGridRows(SOLUTION_CARDS);

  return (
    <section
      className="relative z-10 px-5 sm:px-8 pb-24 sm:pb-32"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-4"
            style={{
              gridTemplateColumns: row.length === 1 ? "1fr" : "1fr 1fr",
            }}
          >
            {row.map(card => (
              <SolutionCard
                key={card.id}
                card={card}
                tall={row.length === 1} // full-width cards get a wider aspect ratio
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}