"use client";

import { usePathname } from "next/navigation";

import { BellIcon } from "@/components/icons/icons";

const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "Overview",
    // "/dashboard/inventory": "Inventory",
    // "/dashboard/sales": "Sales",
    // "/dashboard/cashflow": "Cashflow",
    // "/dashboard/team": "Team",
    "/dashboard/my/businesses": "Businesses",
    "/dashboard/my/keys": "My Keys",
    "/dashboard/my/transactions": "Transactions",
    "/dashboard/my/settings": "Settings",
};

export function DashboardTopbar() {
    const pathname = usePathname();
    const title = PAGE_TITLES[pathname] ?? "Dashboard";

    return (
        <header
            className="flex h-[60px] shrink-0 items-center justify-between border-b px-6 lg:px-8"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            {/* Page title */}
            <div>
                <h1 className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
                    {title}
                </h1>
            </div>

            {/* Right actions — expand later (notifications, quick-add, etc.) */}
            <div className="flex items-center gap-3">
                {/* Notification bell — placeholder */}
                <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    aria-label="Notifications"
                >
                    <BellIcon />
                </button>

                {/* Avatar */}
                <div
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                    style={{ background: "var(--brand)" }}
                >
                    U
                </div>
            </div>
        </header>
    );
}
