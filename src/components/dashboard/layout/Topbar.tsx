// components/dashboard/layout/Topbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BellIcon, SettingsIcon } from "@/components/icons/icons";

const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/my/businesses": "Businesses",
    "/dashboard/my/keys": "My Keys",
    "/dashboard/my/transactions": "Transactions",
    "/dashboard/my/settings": "Settings",
};

function ChevronDownIcon({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function ProfileIcon({ size = 15 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function LogOutIcon({ size = 15 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

interface DashboardTopbarProps {
    mobileNavOpen: boolean;
    onMenuClick: () => void;
}

export function DashboardTopbar({ mobileNavOpen, onMenuClick }: DashboardTopbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const title = PAGE_TITLES[pathname] ?? "Dashboard";

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        router.push("/login");
    };

    return (
        <header
            className="flex h-[60px] shrink-0 items-center justify-between border-b px-4 lg:px-8"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            {/* Left: Animated Hamburger/Arrow Toggle + Title */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-9 w-9 flex-col items-center justify-center gap-[5.5px] rounded-lg lg:hidden transition-colors"
                    aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileNavOpen}
                    style={{
                        background: mobileNavOpen ? "var(--surface-muted)" : "transparent",
                    }}
                >
                    <span
                        className="block rounded-full"
                        style={{
                            width: "18px",
                            height: "1.5px",
                            background: "var(--foreground)",
                            transition: "transform 280ms cubic-bezier(.4,0,.2,1)",
                            transform: mobileNavOpen ? "translateY(3.5px) rotate(45deg)" : "none",
                            transformOrigin: "center",
                        }}
                    />
                    <span
                        className="block rounded-full"
                        style={{
                            width: "12px",
                            height: "1.5px",
                            background: "var(--foreground)",
                            transition: "opacity 180ms ease",
                            opacity: mobileNavOpen ? 0 : 1,
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
                            transition: "transform 280ms cubic-bezier(.4,0,.2,1)",
                            transform: mobileNavOpen ? "translateY(-3.5px) rotate(-45deg)" : "none",
                            transformOrigin: "center",
                        }}
                    />
                </button>

                <h1 className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
                    {title}
                </h1>
            </div>

            {/* Right: Notifications + User Dropdown */}
            <div className="flex items-center gap-3">
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

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex items-center gap-1 rounded-full transition-opacity hover:opacity-80"
                        aria-label="Account menu"
                        aria-expanded={menuOpen}
                    >
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                            style={{ background: "var(--brand)" }}
                        >
                            U
                        </div>
                        <ChevronDownIcon />
                    </button>

                    {menuOpen && (
                        <div
                            className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-xl border py-1 shadow-lg"
                            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                        >
                            <div className="border-b px-3.5 py-2.5" style={{ borderColor: "var(--border)" }}>
                                <p className="truncate text-[12.5px] font-medium" style={{ color: "var(--foreground)" }}>
                                    Your name
                                </p>
                                <p className="truncate text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                    you@business.com
                                </p>
                            </div>

                            <div className="p-1">
                                <Link
                                    href="/dashboard/my/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors"
                                    style={{ color: "var(--text-muted)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <ProfileIcon />
                                    Profile
                                </Link>

                                <Link
                                    href="/dashboard/my/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors"
                                    style={{ color: "var(--text-muted)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <SettingsIcon size={15} active={false} />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t p-1" style={{ borderColor: "var(--border)" }}>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors"
                                    style={{ color: "#DC2626" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.08)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <LogOutIcon />
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}