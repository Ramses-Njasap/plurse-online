// cashflow/data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All content for the Cash Flow Clarity solution page.
// Derived from: transactions, sales, payments, stock_purchases schemas.

// ── Hero summary card ─────────────────────────────────────────────────────────
export const HERO_SUMMARY = {
    totalIn: { value: "XAF 4,820,000", label: "Total In", color: "#10b981" },
    totalOut: { value: "XAF 2,310,000", label: "Total Out", color: "#ef4444" },
    netPosition: { value: "XAF 2,510,000", label: "Net Position", color: "#3b82f6" },
    outstanding: { value: "XAF 640,000", label: "Outstanding Credit", color: "#f59e0b" },
};

// ── Money journey flow steps ──────────────────────────────────────────────────
export const MONEY_JOURNEY = [
    {
        id: "purchase",
        label: "Stock Purchase",
        desc: "Supplier paid. Cost recorded against each SKU.",
        icon: "📦",
        type: "cashout",
    },
    {
        id: "sale",
        label: "Sale Made",
        desc: "Product sold. Cost price snapshot captured at point of sale.",
        icon: "🧾",
        type: "neutral",
    },
    {
        id: "payment",
        label: "Payment Received",
        desc: "Cash, mobile money, card, bank transfer or in-kind — all recorded.",
        icon: "💳",
        type: "cashin",
    },
    {
        id: "transfer",
        label: "Transfer",
        desc: "Till balance moved to bank or main account. Not counted as income.",
        icon: "🏦",
        type: "transfer",
    },
];

// ── Transaction ledger mock entries ──────────────────────────────────────────
export const TRANSACTIONS = [
    { type: "cashin", amount: "+XAF 185,000", desc: "Sale — Samsung TV (Marie Ngo)", method: "Mobile Money", date: "Today 09:14" },
    { type: "cashout", amount: "-XAF 310,000", desc: "Stock purchase — 10 units Rice 25kg", method: "Bank Transfer", date: "Today 08:30" },
    { type: "cashin", amount: "+XAF 45,000", desc: "Installment — John Doe (2nd payment)", method: "Cash", date: "Yesterday 16:02" },
    { type: "transfer", amount: "XAF 500,000", desc: "Till → Main Account", method: "Transfer", date: "Yesterday 17:00" },
    { type: "cashin", amount: "+XAF 92,000", desc: "Sale — Indomie Carton × 8", method: "Cash", date: "Nov 18 11:45" },
    { type: "cashout", amount: "-XAF 22,000", desc: "Shipping — Supplier delivery fee", method: "Cash", date: "Nov 18 09:00" },
];

export const TRANSACTION_TYPE_CONFIG = {
    cashin: { label: "Cash In", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    cashout: { label: "Cash Out", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
    transfer: { label: "Transfer", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
};

// ── Credit gap mock data ──────────────────────────────────────────────────────
export const CREDIT_GAP = {
    totalRevenue: "XAF 4,820,000",
    collected: "XAF 4,180,000",
    outstanding: "XAF 640,000",
    collectedPct: 87,
    outstandingPct: 13,
    debtors: [
        { name: "John Doe", owed: "XAF 185,000", due: "Dec 31", overdue: false },
        { name: "Alice Mbah", owed: "XAF 310,000", due: "Nov 20", overdue: true },
        { name: "Paul Nkeng", owed: "XAF 145,000", due: "Dec 15", overdue: false },
    ],
};

// ── Margin intelligence mock data ─────────────────────────────────────────────
export const MARGIN_DATA = [
    { product: "Samsung 32\" TV", costSnapshot: "XAF 155,000", soldAt: "XAF 185,000", margin: "16.2%", status: "healthy" },
    { product: "Indomie Carton", costSnapshot: "XAF  9,200", soldAt: "XAF  11,500", margin: "20.0%", status: "healthy" },
    { product: "Rice 25kg", costSnapshot: "XAF 18,500", soldAt: "XAF  19,000", margin: " 2.6%", status: "warning" },
    { product: "Laptop HP 15\"", costSnapshot: "XAF 285,000", soldAt: "XAF 310,000", margin: " 8.1%", status: "healthy" },
    { product: "Airtime Resale", costSnapshot: "XAF  4,800", soldAt: "XAF   4,900", margin: " 2.0%", status: "override" },
];

export const MARGIN_STATUS_CONFIG = {
    healthy: { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", label: "Healthy" },
    warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "Low margin" },
    override: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", label: "Overridden" },
};

// ── Edge cases ────────────────────────────────────────────────────────────────
export const EDGE_CASES = [
    {
        icon: "🤝",
        title: "In-Kind Payments",
        body: "A customer paid with goods or services instead of money. Plurse records it as a payment method — your cashflow stays complete.",
    },
    {
        icon: "↩️",
        title: "Cancellations & Refunds",
        body: "Every cancelled sale or payment is flagged with a reason. It's never just deleted — the record stays for a full audit trail.",
    },
    {
        icon: "🏦",
        title: "Till to Bank Transfers",
        body: "Moving cash from your till to your main account isn't income. Plurse records it as a transfer — so it never inflates your revenue figures.",
    },
    {
        icon: "✏️",
        title: "Price Overrides",
        body: "When a sale goes below the minimum price, it's flagged, a reason is required, and manager approval may be needed. Full accountability at every transaction.",
    },
];

// ── Outcomes ──────────────────────────────────────────────────────────────────
export const OUTCOMES = [
    {
        icon: "📍",
        title: "Know your real net position",
        body: "Total in minus total out — including what's still owed to you — at any moment.",
    },
    {
        icon: "🔄",
        title: "Cash in hand vs cash in transit",
        body: "Transfers between accounts never inflate your income. Your numbers are always honest.",
    },
    {
        icon: "🛡️",
        title: "Margin protected at every sale",
        body: "Cost price snapshots and override flags ensure no sale quietly eats your profit.",
    },
    {
        icon: "📬",
        title: "Every debt tracked and chased",
        body: "Outstanding credit is always visible — with debtor names, amounts and deadlines.",
    },
];