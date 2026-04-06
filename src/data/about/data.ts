// about-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All content for the About page.
// Replace placeholder values with real ones as they become available.

// ── Pillars — what Plurse is building toward ──────────────────────────────────
export const PILLARS = [
    {
        id: "software",
        number: "01",
        label: "Business Software",
        desc: "The tools businesses use every day — inventory, sales, cashflow, customer relationships and team management — built for the way African businesses actually operate.",
        status: "live",
    },
    {
        id: "intelligence",
        number: "02",
        label: "Business Intelligence",
        desc: "Market insights, industry benchmarks and data-driven guidance that help business owners make better decisions. Not just what happened — but what it means.",
        status: "coming",
    },
    {
        id: "masterclasses",
        number: "03",
        label: "Masterclasses",
        desc: "Learning from the best operators, founders and business builders across Africa. Practical knowledge from people who have built real businesses in real conditions.",
        status: "coming",
    },
    {
        id: "community",
        number: "04",
        label: "Community",
        desc: "A network of businesses growing together — sharing knowledge, solving problems and creating opportunities across industries and borders.",
        status: "coming",
    },
];

// ── Values ────────────────────────────────────────────────────────────────────
export const VALUES = [
    {
        label: "Honest",
        desc: "We build tools that tell the truth — even when the numbers are uncomfortable. No inflated dashboards, no vanity metrics.",
    },
    {
        label: "Practical",
        desc: "Every feature exists because a real business owner needs it. Not because it looks impressive in a demo.",
    },
    {
        label: "African",
        desc: "Built by an African, for African businesses. Not an adaptation of a Western product — a product built from the ground up for this context.",
    },
    {
        label: "Long-term",
        desc: "We are not building a feature. We are building infrastructure. The kind that takes years and outlasts trends.",
    },
];

// ── Founder note ──────────────────────────────────────────────────────────────
export const FOUNDER = {
    name: "Ramses Njasap",
    role: "Founder & Builder",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    note: [
        "I built Plurse because I watched too many good businesses fail not from lack of effort but from lack of visibility. They didn't know their real margins. They couldn't tell who owed them money. They had no way to know which customers were worth keeping.",
        "The tools that exist were built for businesses in Europe or America — businesses with accountants, stable internet and staff who went to business school. That is not most of Africa.",
        "Plurse is my attempt to close that gap. Not just with software, but with intelligence, education and community. A full operating system for businesses that are building something real in difficult conditions.",
        "We are early. But we are serious. And we are just getting started.",
    ],
    linkedin: "https://linkedin.com/in/ramses-njasap",
};

// ── Mission statement ─────────────────────────────────────────────────────────
export const MISSION = {
    headline: "Building the operating system for African business.",
    sub: "Africa has more than 40 million small and medium businesses. Most of them run on memory, paper and instinct. Plurse exists to change that — one business at a time.",
};

// ── What Plurse is today ──────────────────────────────────────────────────────
export const TODAY = {
    headline: "Where we are today.",
    body: "Plurse v1.0.0 is a desktop application — available on Windows, macOS and Linux — that gives any business a complete operating layer: inventory management, sales intelligence, cash flow clarity, customer relationships and team access control. It works offline, syncs when connected, and is built to handle the conditions businesses actually face.",
    version: "1.0.0",
    released: "March 2025",
    platforms: ["Windows", "macOS", "Linux"],
};