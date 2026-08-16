/* ── Dashboard overview — placeholder structure ready for real data ── */

export default function DashboardPage() {
    return (
        <div className="space-y-8">

            {/* Welcome banner */}
            <div
                className="rounded-xl p-6"
                style={{
                    background: "linear-gradient(135deg, var(--brand) 0%, #2563eb 100%)",
                }}
            >
                <p className="mb-1 text-[12px] font-medium uppercase tracking-[0.12em] text-white/60">
                    Welcome back
                </p>
                <h2 className="text-[22px] font-semibold text-white">
                    Good to have you here.
                </h2>
                <p className="mt-1 text-[13px] text-white/60">
                    Here&apos;s what&apos;s happening with your business today.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STATS.map(({ label, value, delta, icon: Icon, positive }) => (
                    <div
                        key={label}
                        className="rounded-xl border p-5"
                        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                                {label}
                            </p>
                            <div
                                className="flex h-7 w-7 items-center justify-center rounded-lg"
                                style={{ background: "var(--brand-light)" }}
                            >
                                <Icon />
                            </div>
                        </div>
                        <p className="text-[22px] font-semibold" style={{ color: "var(--foreground)" }}>
                            {value}
                        </p>
                        <p
                            className="mt-1 text-[11px] font-medium"
                            style={{ color: positive ? "#22c55e" : "#ef4444" }}
                        >
                            {delta} vs last month
                        </p>
                    </div>
                ))}
            </div>

            {/* Lower two-column grid */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Recent sales — 2/3 width */}
                <div
                    className="rounded-xl border lg:col-span-2"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                    <div
                        className="flex items-center justify-between border-b px-5 py-4"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Recent sales
                        </p>
                        <span
                            className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                            style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                        >
                            This week
                        </span>
                    </div>
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {SALES.map((s) => (
                            <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                                        style={{ background: s.color }}
                                    >
                                        {s.initials}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                                            {s.name}
                                        </p>
                                        <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                            {s.item}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                                        {s.amount}
                                    </p>
                                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                        {s.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory alerts — 1/3 width */}
                <div
                    className="rounded-xl border"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                    <div
                        className="border-b px-5 py-4"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Low stock alerts
                        </p>
                    </div>
                    <div className="divide-y p-2" style={{ borderColor: "var(--border)" }}>
                        {ALERTS.map((a) => (
                            <div key={a.name} className="flex items-center justify-between rounded-lg px-3 py-3">
                                <div>
                                    <p className="text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                                        {a.name}
                                    </p>
                                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                        {a.remaining} remaining
                                    </p>
                                </div>
                                <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                                    style={
                                        a.severity === "critical"
                                            ? { background: "rgba(239,68,68,0.1)", color: "#ef4444" }
                                            : { background: "rgba(245,158,11,0.1)", color: "#f59e0b" }
                                    }
                                >
                                    {a.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

/* ── Placeholder data ── */

const STATS = [
    { label: "Revenue", value: "XAF 4.2M", delta: "+12%", positive: true, icon: RevenueIcon },
    { label: "Orders", value: "284", delta: "+8%", positive: true, icon: OrderIcon },
    { label: "Inventory", value: "1,402", delta: "-3%", positive: false, icon: InventoryIcon },
    { label: "Team", value: "7", delta: "+1", positive: true, icon: TeamIcon },
];

const SALES = [
    { id: 1, name: "Amara Nkosi", item: "Office chairs ×4", amount: "XAF 280,000", date: "Today", initials: "AN", color: "#3b82f6" },
    { id: 2, name: "Pierre Mballa", item: "Standing desk ×1", amount: "XAF 145,000", date: "Today", initials: "PM", color: "#8b5cf6" },
    { id: 3, name: "Grace Eto", item: "Laptop stand ×2", amount: "XAF 52,000", date: "Yesterday", initials: "GE", color: "#22c55e" },
    { id: 4, name: "David Owusu", item: "Webcam ×3", amount: "XAF 87,000", date: "Yesterday", initials: "DO", color: "#f59e0b" },
];

const ALERTS = [
    { name: "USB-C Hubs", remaining: 3, severity: "critical" as const },
    { name: "HDMI Cables", remaining: 8, severity: "low" as const },
    { name: "Mouse pads", remaining: 11, severity: "low" as const },
    { name: "Power strips", remaining: 2, severity: "critical" as const },
];

/* ── Stat card icons ── */
function RevenueIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}
function OrderIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}
function InventoryIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
    );
}
function TeamIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}