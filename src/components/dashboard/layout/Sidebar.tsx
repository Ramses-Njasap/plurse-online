"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GridIcon, EnterpriseIcon, KeyIcon, WalletIcon, SettingsIcon, UsersIcon } from "@/components/icons/icons";
import { ChannelPartnerPromoBanner } from "@/components/dashboard/my/shared/ChannelPartnerPromoBanner";


/* ── Nav items — expand as the app grows ── */
const NAV = [
    { href: "/dashboard", label: "Overview", icon: GridIcon },
    // { href: "/dashboard/inventory", label: "Inventory", icon: BoxIcon },
    // { href: "/dashboard/sales", label: "Sales", icon: ChartIcon },
    // { href: "/dashboard/cashflow", label: "Cashflow", icon: WalletIcon },
    // { href: "/dashboard/team", label: "Team", icon: UsersIcon },
    { href: "/dashboard/my/businesses", label: "Businesses", icon: EnterpriseIcon },
    { href: "/dashboard/my/keys", label: "My Keys / Referrals", icon: KeyIcon },
    { href: "/dashboard/my/transactions", label: "Transactions", icon: WalletIcon },
];

const BOTTOM_NAV = [
    // { href: "/dashboard/my/referrals", label: "Referrals", icon: UsersIcon },
    { href: "/dashboard/my/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="hidden w-[220px] shrink-0 z-10 flex-col border-r lg:flex"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            {/* Wordmark */}
            <div className="flex h-[60px] items-center gap-2.5 border-b px-5" style={{ borderColor: "var(--border)" }}>
                <div
                    className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white"
                    style={{ background: "var(--brand)" }}
                >
                    P
                </div>
                <span className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                    Plurse
                </span>
            </div>

            {/* Main nav */}
            <nav className="flex flex-1 flex-col gap-0.5 p-3">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150"
                            style={{
                                background: active ? "var(--brand-light)" : "transparent",
                                color: active ? "var(--brand)" : "var(--text-muted)",
                                border: active ? "1px solid rgba(59,130,246,0.15)" : "1px solid transparent",
                            }}
                        >
                            <Icon size={15} active={active} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom nav */}
            <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
                {/* Channel partner promo — renders nothing once the user is already a partner */}
                <div className="mb-2">
                    <ChannelPartnerPromoBanner orientation="vertical" />
                </div>

                {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150"
                            style={{
                                color: active ? "var(--brand)" : "var(--text-muted)",
                            }}
                        >
                            <Icon size={15} active={active} />
                            {label}
                        </Link>
                    );
                })}

                {/* User row */}
                <div
                    className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2"
                    style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "8px" }}
                >
                    <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ background: "var(--brand)" }}
                    >
                        <UsersIcon size={12} active={true} />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                            Your name
                        </p>
                        <p className="truncate text-[11px]" style={{ color: "var(--text-subtle)" }}>
                            you@business.com
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}