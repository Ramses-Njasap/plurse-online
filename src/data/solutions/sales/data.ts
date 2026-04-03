// sales/data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All content for the Sales Intelligence solution page.
// Edit copy here — no component files need touching.

// ── Hero stats ────────────────────────────────────────────────────────────────
export const HERO_STATS = [
    { value: "847", label: "Customers tracked", suffix: "" },
    { value: "2.4M", label: "Revenue in XAF logged", suffix: "+" },
    { value: "94%", label: "Repayment rate", suffix: "" },
];

// ── Payment methods ───────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
    {
        id: "cash",
        label: "Cash",
        pct: 42,
        color: "#10b981",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>`,
    },
    {
        id: "mobile",
        label: "Mobile Money",
        pct: 31,
        color: "#3b82f6",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>`,
    },
    {
        id: "credit",
        label: "Credit",
        pct: 18,
        color: "#f59e0b",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
    },
    {
        id: "card",
        label: "Card",
        pct: 9,
        color: "#8b5cf6",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>`,
    },
];

// ── Customer segments ─────────────────────────────────────────────────────────
export const CUSTOMER_SEGMENTS = [
    {
        label: "Most Consistent",
        desc: "Customers who buy regularly regardless of season or promotion.",
        example: "Buys every 2 weeks · 3 years active",
    },
    {
        label: "Bulk Buyers",
        desc: "Customers who purchase large quantities of specific products.",
        example: "Avg. order: 200 units · Product: Rice 25kg",
    },
    {
        label: "Most Frequent",
        desc: "Highest number of transactions in any given period.",
        example: "14 purchases this month",
    },
    {
        label: "Product Loyal",
        desc: "Customers who always come back for one specific product.",
        example: "Always buys: Indomie Carton",
    },
];

// ── Credit decision prompt mock data ─────────────────────────────────────────
export const CREDIT_PROMPT = {
    customer: "John Doe",
    product: "Samsung 32\" TV",
    qty: 2,
    unitPrice: "XAF 185,000",
    totalValue: "XAF 370,000",
    costPrice: "XAF 310,000",
    normalMargin: "16.2%",
    creditMargin: "4.1%",
    deadline: "30 days",
    warningLevel: "caution", // "safe" | "caution" | "danger"
    warningMessage: "Selling on credit reduces your margin from 16.2% to 4.1%. Consider a deposit.",
};

// ── Installment example ───────────────────────────────────────────────────────
export const INSTALLMENT_EXAMPLE = {
    customer: "Marie Ngo",
    total: 370000,
    paid: 185000,
    remaining: 185000,
    currency: "XAF",
    deadline: "Dec 31, 2025",
    installments: [
        { label: "1st payment", amount: 120000, date: "Nov 1", done: true },
        { label: "2nd payment", amount: 65000, date: "Nov 15", done: true },
        { label: "3rd payment", amount: 100000, date: "Dec 1", done: false },
        { label: "Final", amount: 85000, date: "Dec 31", done: false },
    ],
};

// ── Analytics features ────────────────────────────────────────────────────────
export const ANALYTICS_FEATURES = [
    {
        id: "performance",
        eyebrow: "Sales Performance",
        headline: "See exactly what's selling — and what's sitting.",
        body: "Track every sale by product, SKU, category and time period. Your best performers and slow movers visible at a glance so every restocking and pricing decision is backed by real data.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=85",
        alt: "Sales performance analytics charts",
        flip: false,
        callouts: [
            "Top performing products by revenue and volume",
            "Slow mover alerts before stock ties up capital",
            "Time period breakdowns — daily, weekly, monthly",
        ],
    },
    {
        id: "reports",
        eyebrow: "Exportable Reports",
        headline: "Reports your accountant will actually understand.",
        body: "Generate clean sales reports by date range, category or product. Export them when you need to share with partners, apply for financing, or review the month with your team.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=85",
        alt: "Business sales report and analytics dashboard",
        flip: true,
        callouts: [
            "Filter by product, category, customer or date",
            "Export-ready for accountants and investors",
            "Compare periods to spot seasonal patterns",
        ],
    },
];

// ── Outcomes ──────────────────────────────────────────────────────────────────
export const OUTCOMES = [
    {
        icon: "🎯",
        title: "Never lose track of a debt",
        body: "Automated reminders keep every credit sale in view — for you and your customer.",
    },
    {
        icon: "👥",
        title: "Know your best customers",
        body: "Identify who buys most, what they buy, and how often — by name.",
    },
    {
        icon: "💰",
        title: "Protect your margins",
        body: "Real-time margin warnings before every credit sale so you never undersell.",
    },
    {
        icon: "📊",
        title: "Understand how you get paid",
        body: "A clear breakdown of cash, mobile money, credit and card across every transaction.",
    },
];