// team/data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All content for the Team & Access Control solution page.
// Derived from: employees, departments, employee_activities, business_branch schemas.
// Design note: minimal — brand blue accents only, no multi-color data displays.

// ── Roles — from ACCOUNT_ROLES constant ──────────────────────────────────────
// These are the preset roles enforced at the database level.
export const ROLES = [
    {
        id: "owner",
        label: "Owner",
        desc: "Full access to everything — settings, financials, all staff activity.",
        permissions: ["Inventory", "Sales", "Cash Flow", "Customers", "Team", "Settings", "Reports", "Approvals"],
    },
    {
        id: "manager",
        label: "Manager",
        desc: "Operational oversight — can approve price overrides and view all reports.",
        permissions: ["Inventory", "Sales", "Cash Flow", "Customers", "Team", "Reports", "Approvals"],
    },
    {
        id: "cashier",
        label: "Cashier",
        desc: "Point of sale only — records sales and payments, no financial overview.",
        permissions: ["Sales", "Customers"],
    },
    {
        id: "stock_manager",
        label: "Stock Manager",
        desc: "Manages inventory and supplier purchases — no access to financials.",
        permissions: ["Inventory", "Customers"],
    },
    {
        id: "viewer",
        label: "Viewer",
        desc: "Read-only access — can see reports but cannot make any changes.",
        permissions: ["Reports"],
    },
];

// All possible permissions — used to render the permission matrix
export const ALL_PERMISSIONS = [
    "Inventory", "Sales", "Cash Flow",
    "Customers", "Team", "Settings",
    "Reports", "Approvals",
];

// ── Departments — mirrors departments table ───────────────────────────────────
export const DEPARTMENTS = [
    { name: "Sales", headcount: 4 },
    { name: "Stock & Logistics", headcount: 3 },
    { name: "Finance", headcount: 2 },
    { name: "Management", headcount: 2 },
];

// ── Activity log mock entries — mirrors employee_activities ───────────────────
// old_data / new_data shown as before → after
export const ACTIVITY_LOG = [
    {
        employee: "Alice Mbah",
        role: "Cashier",
        activity: "Recorded sale #1042 — Samsung 32\" TV",
        detail: "XAF 185,000 · Mobile Money",
        time: "Today 09:14",
        table: "sales",
    },
    {
        employee: "John Doe",
        role: "Cashier",
        activity: "Price override requested — Airtime Resale",
        detail: "Below minimum margin threshold · Pending approval",
        time: "Today 08:30",
        table: "sales",
    },
    {
        employee: "Marie Ngo",
        role: "Manager",
        activity: "Approved price override — John Doe",
        detail: "Airtime Resale · Reason: Customer retention",
        time: "Today 08:35",
        table: "sales",
    },
    {
        employee: "Paul Nkeng",
        role: "Stock Manager",
        activity: "Stock adjustment — Rice 25kg",
        detail: "Quantity: 45 → 95 units",
        time: "Yesterday 11:02",
        table: "products",
    },
    {
        employee: "Alice Mbah",
        role: "Cashier",
        activity: "Installment payment recorded — Marie Ngo",
        detail: "XAF 65,000 of XAF 370,000 · Cash",
        time: "Yesterday 16:22",
        table: "payments",
    },
];

// ── Approval workflow mock ────────────────────────────────────────────────────
export const APPROVAL_REQUEST = {
    requestedBy: "John Doe",
    role: "Cashier",
    action: "Price Override",
    product: "Airtime Resale",
    normalPrice: "XAF 4,900",
    requestedAt: "XAF 4,500",
    marginImpact: "2.0% → 0% (below threshold)",
    reason: "Long-standing customer — loyalty discount requested.",
    approver: "Marie Ngo (Manager)",
    time: "Today 08:30",
};

// ── Employee profile fields — mirrors employees + employee_media ──────────────
export const EMPLOYEE_PROFILE_FIELDS = [
    "Profile picture",
    "ID card",
    "Employee badge",
    "Contract document",
    "Signature",
    "Department",
    "Date of joining",
    "Emergency contact",
    "Salary",
];

// ── Multi-branch callouts — mirrors business_branch ───────────────────────────
export const BRANCH_FEATURES = [
    {
        title: "Per-branch language",
        body: "Each branch can operate in its own language — set once, always correct.",
    },
    {
        title: "Per-branch currency",
        body: "Branches in different markets use their local currency automatically.",
    },
    {
        title: "Verification & approval",
        body: "New branches require verification before going live — no accidental activations.",
    },
    {
        title: "Independent sync",
        body: "Each branch syncs on its own schedule — local operation continues even offline.",
    },
];

// ── Outcomes ──────────────────────────────────────────────────────────────────
export const OUTCOMES = [
    {
        icon: "🔐",
        title: "Data stays private",
        body: "Sensitive information is only visible to those whose role requires it.",
    },
    {
        icon: "👥",
        title: "Scale without risk",
        body: "Add new staff in minutes. Their access is defined by their role, not your memory.",
    },
    {
        icon: "🕵️",
        title: "Catch errors fast",
        body: "Every action is logged with old and new data — mistakes are traceable and fixable.",
    },
    {
        icon: "✅",
        title: "Rules enforced automatically",
        body: "Price thresholds, approval chains and role limits work even when you're not watching.",
    },
];