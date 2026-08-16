// components/dashboard/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GridIcon, EnterpriseIcon, KeyIcon, WalletIcon, SettingsIcon, UsersIcon } from "@/components/icons/icons";
import { ChannelPartnerPromoBanner } from "@/components/dashboard/my/shared/ChannelPartnerPromoBanner";

const NAV = [
    { href: "/dashboard", label: "Overview", icon: GridIcon },
    { href: "/dashboard/my/businesses", label: "Businesses", icon: EnterpriseIcon },
    { href: "/dashboard/my/keys", label: "My Keys / Referrals", icon: KeyIcon },
    { href: "/dashboard/my/transactions", label: "Transactions", icon: WalletIcon },
];

const BOTTOM_NAV = [
    { href: "/dashboard/my/settings", label: "Settings", icon: SettingsIcon },
];

interface DashboardSidebarProps {
    open: boolean;
    onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop overlay for click-outside close (mobile only) */}
            <div
                className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                onClick={onClose}
                aria-hidden="true"
                style={{
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            />

            {/* Sidebar Drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[75vw] max-w-[310px] shrink-0 flex-col border-r transition-all duration-300 lg:static lg:z-10 lg:w-[220px] lg:translate-x-0 lg:opacity-100 ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                    }`}
                style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                }}
            >
                {/* Header with Logo + Mobile Close Toggle */}
                <div
                    className="flex h-[60px] items-center justify-between border-b px-5 shrink-0"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white shrink-0"
                            style={{ background: "var(--brand)" }}
                        >
                            P
                        </div>
                        <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Plurse
                        </span>
                    </div>

                    {/* Animated Hamburger/Arrow Close Trigger inside Drawer Header (Mobile Only) */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 flex-col items-center justify-center gap-[5.5px] rounded-lg lg:hidden transition-colors"
                        aria-label="Close sidebar"
                    >
                        <span
                            className="block rounded-full"
                            style={{
                                width: "18px",
                                height: "1.5px",
                                background: "var(--foreground)",
                                transform: "translateY(3.5px) rotate(45deg)",
                                transformOrigin: "center",
                            }}
                        />
                        <span
                            className="block rounded-full"
                            style={{
                                width: "12px",
                                height: "1.5px",
                                background: "var(--foreground)",
                                opacity: 0,
                                alignSelf: "flex-start",
                                marginLeft: "3px",
                            }}
                        />
                        <span
                            className="block rounded-full"
                            style={{
                                width: "18px",
                                height: "1.5px",
                                background: "var(--foreground)",
                                transform: "translateY(-3.5px) rotate(-45deg)",
                                transformOrigin: "center",
                            }}
                        />
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-150"
                                style={{
                                    background: active ? "var(--brand-light)" : "transparent",
                                    color: active ? "var(--brand)" : "var(--text-muted)",
                                }}
                            >
                                <Icon size={17} active={active} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Options & User Badge */}
                <div className="border-t p-3 shrink-0" style={{ borderColor: "var(--border)" }}>
                    <div className="mb-2">
                        <ChannelPartnerPromoBanner orientation="vertical" />
                    </div>

                    {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-150"
                                style={{
                                    color: active ? "var(--brand)" : "var(--text-muted)",
                                }}
                            >
                                <Icon size={17} active={active} />
                                {label}
                            </Link>
                        );
                    })}

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
        </>
    );
}