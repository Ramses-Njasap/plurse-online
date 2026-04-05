// customers-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All content for the Customer Relationships solution page.
// Warm, human tone — people first, data second.

// ── Customer profile mock ─────────────────────────────────────────────────────
export const CUSTOMER_PROFILE = {
    name: "Marie Ngo",
    phone: "+237 6XX XXX XXX",
    email: "marie.ngo@email.com",
    address: "Bastos, Yaoundé",
    since: "March 2023",
    totalSpend: "XAF 1,240,000",
    totalOrders: 18,
    lastSeen: "2 days ago",
    outstanding: "XAF 185,000",
    preferredMethod: "Mobile Money",
};

// ── Customer purchase history mock ────────────────────────────────────────────
export const PURCHASE_HISTORY = [
    { product: "Samsung 32\" TV", amount: "XAF 185,000", method: "Credit", date: "Nov 19", status: "outstanding" },
    { product: "Indomie Carton × 8", amount: "XAF 92,000", method: "Mobile Money", date: "Nov 10", status: "paid" },
    { product: "Rice 25kg × 4", amount: "XAF 76,000", method: "Cash", date: "Oct 28", status: "paid" },
    { product: "Laptop HP 15\"", amount: "XAF 310,000", method: "Installments", date: "Oct 12", status: "paid" },
    { product: "Airtime Resale × 10", amount: "XAF 49,000", method: "Mobile Money", date: "Sep 30", status: "paid" },
];

// ── Customer segments ─────────────────────────────────────────────────────────
export const SEGMENTS = [
    {
        id: "consistent",
        label: "Most Consistent",
        desc: "Customers who buy regularly regardless of season, promotion or product. Your most reliable revenue.",
        stat: "Every 2 weeks",
        statLabel: "Average return",
        example: [
            { name: "Marie Ngo", visits: 18, since: "Mar 2023" },
            { name: "Paul Nkeng", visits: 14, since: "Jun 2023" },
            { name: "Alice Mbah", visits: 12, since: "Aug 2023" },
        ],
    },
    {
        id: "bulk",
        label: "Bulk Buyers",
        desc: "Customers who purchase large quantities of specific products. Know who to call when you need to move stock fast.",
        stat: "200+ units",
        statLabel: "Average order size",
        example: [
            { name: "John Doe", visits: 6, since: "Jan 2024" },
            { name: "Sara Ateba", visits: 4, since: "Apr 2024" },
        ],
    },
    {
        id: "frequent",
        label: "Most Frequent",
        desc: "Highest transaction count in any period — not necessarily the biggest spenders, but your most engaged buyers.",
        stat: "14×",
        statLabel: "This month",
        example: [
            { name: "Marie Ngo", visits: 14, since: "Mar 2023" },
            { name: "Carine Bih", visits: 11, since: "Feb 2024" },
        ],
    },
    {
        id: "loyal",
        label: "Product Loyal",
        desc: "Customers who always come back for one specific product. Essential for demand forecasting and stock planning.",
        stat: "Indomie Carton",
        statLabel: "Always buys",
        example: [
            { name: "Paul Nkeng", visits: 12, since: "Jun 2023" },
            { name: "David Eko", visits: 9, since: "Sep 2023" },
        ],
    },
];

// ── Credit relationship mock ──────────────────────────────────────────────────
export const CREDIT_HISTORY = [
    { label: "Total credit extended", value: "XAF 640,000", note: "" },
    { label: "Total repaid", value: "XAF 455,000", note: "71% repayment rate" },
    { label: "Currently outstanding", value: "XAF 185,000", note: "Due Dec 31, 2025" },
    { label: "On-time payments", value: "4 of 5", note: "80% on-time record" },
];

// ── Outcomes ──────────────────────────────────────────────────────────────────
export const OUTCOMES = [
    {
        icon: "🤝",
        title: "Turn strangers into regulars",
        body: "Every interaction builds a profile. Every profile helps you serve them better next time.",
    },
    {
        icon: "📞",
        title: "Reach the right customer",
        body: "Need to move stock fast? Call your bulk buyers. Running low on a product? Warn your loyal customers.",
    },
    {
        icon: "💳",
        title: "Extend credit with confidence",
        body: "See a customer's full repayment history before agreeing to a credit sale.",
    },
    {
        icon: "📈",
        title: "Forecast with real data",
        body: "Product-loyal customers tell you exactly what to restock and when.",
    },
];