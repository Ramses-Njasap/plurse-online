// To add, remove or edit a slide, only touch this file.

export interface Slide {
  id:            string;
  tag:           string;
  headline:      string;
  body:          string;
  image:         string;
  imageAlt:      string;
  primaryCta:    { label: string; href: string };
  secondaryCta:  { label: string; href: string };
}

export const SLIDES: Slide[] = [
  {
    id:         "inventory",
    tag:        "Inventory Control",
    headline:   "Always know what you have — before your customer asks.",
    body:       "Plurse tracks every product, every variant, every location in real time. No more surprise stockouts, no more over-ordering. A clear, confident view of your stock, always.",
    image:      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1000&q=85",
    imageAlt:   "Warehouse inventory management",
    primaryCta:   { label: "Get started",              href: "/download" },
    secondaryCta: { label: "See inventory features",   href: "/features#inventory" },
  },
  {
    id:         "cashflow",
    tag:        "Cash Flow Clarity",
    headline:   "See where every franc goes. Make every decision count.",
    body:       "A live picture of your income, expenses and profit margins — across every transaction. Stop guessing at month-end. Start knowing, every single day.",
    image:      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&q=85",
    imageAlt:   "Financial dashboard and cash flow analytics",
    primaryCta:   { label: "Get started",            href: "/download" },
    secondaryCta: { label: "Explore cashflow tools", href: "/features#cashflow" },
  },
  {
    id:         "sales",
    tag:        "Sales Intelligence",
    headline:   "Your sales data, turned into your next winning move.",
    body:       "Track performance across products, time periods and customer segments. Spot what's selling, cut what isn't, and double down on what drives growth — all from one screen.",
    image:      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=85",
    imageAlt:   "Sales analytics and performance charts",
    primaryCta:   { label: "Get started",          href: "/download" },
    secondaryCta: { label: "View analytics demo",  href: "/features#analytics" },
  },
  {
    id:         "customers",
    tag:        "Customer Relationships",
    headline:   "Know your customers by name — and by habit.",
    body:       "Build detailed customer profiles automatically. Track purchase history, contact info and loyalty patterns. Turn one-time buyers into regulars without lifting a finger.",
    image:      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=85",
    imageAlt:   "Customer service and relationship management",
    primaryCta:   { label: "Get started",             href: "/download" },
    secondaryCta: { label: "See customer features",   href: "/features#customers" },
  },
  {
    id:         "team",
    tag:        "Team & Access Control",
    headline:   "Your team, working together. Your data, always protected.",
    body:       "Add staff, set roles, restrict sensitive data. Every action is logged so you always know who did what and when. Run a business — not a guessing game.",
    image:      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=85",
    imageAlt:   "Business team collaboration",
    primaryCta:   { label: "Get started",             href: "/download" },
    secondaryCta: { label: "Learn about team access", href: "/features#team" },
  },
];