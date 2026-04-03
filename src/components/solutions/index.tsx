// index.tsx — Solutions overview page parent
// ─────────────────────────────────────────────────────────────────────────────
// Assembles SolutionsHero + SolutionsGrid + CTA + Footer.
// All data-driven — adding a solution to the data auto-updates this page.

import SolutionsHero from "./Hero";
import SolutionsGrid from "./Grid";
import CTA from "../home/cta/CTA";
import Footer from "../Footer";

const Solutions = () => {
  return (
    <main style={{ background: "var(--background)" }}>
      <SolutionsHero />
      <SolutionsGrid />
      <CTA />
      <Footer />
    </main>
  );
}

export default Solutions;
