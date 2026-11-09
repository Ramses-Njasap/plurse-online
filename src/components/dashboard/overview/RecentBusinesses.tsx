// src/components/dashboard/overview/RecentBusinesses.tsx

import Link from "next/link";
import type { Business } from "@/types/users.types";
import { RoleBadge, KeyTypeBadge, KeyStatusBadge } from "@/components/dashboard/my/settings/businesses/BusinessBadges";
import { getInitials, getKeyStatus, getRole } from "@/components/dashboard/my/settings/businesses/businessUtils";
import { BuildingIcon, PinIcon, ChevronRightIcon } from "@/components/dashboard/my/settings/businesses/BusinessIcons";
import { Panel, PanelEmpty } from "./Panel";
import { formatDate } from "./overviewFormat";

interface RecentBusinessesProps {
    businesses: Business[];
    unavailable: boolean;
}

export function RecentBusinesses({ businesses, unavailable }: RecentBusinessesProps) {
    return (
        <Panel
            title="Recent businesses"
            subtitle="Newest businesses you own or manage"
            action={{ label: "View all", href: "/dashboard/my/businesses" }}
            bodyClassName="p-0"
        >
            {unavailable ? (
                <PanelEmpty icon={<BuildingIcon size={18} />} title="Businesses unavailable" description="We couldn't load your businesses. Try refreshing." />
            ) : businesses.length === 0 ? (
                <PanelEmpty
                    icon={<BuildingIcon size={18} />}
                    title="No businesses yet"
                    description="Add your first business from the Businesses page to get started."
                />
            ) : (
                <ul className="divide-y divide-[color:var(--border)]">
                    {businesses.map((b) => (
                        <li key={b.id}>
                            <Link
                                href="/dashboard/my/businesses"
                                className="group flex items-center gap-3 px-5 py-3.5 transition-colors focus:outline-none focus-visible:[box-shadow:inset_0_0_0_2px_var(--brand-ring)]"
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white"
                                    style={{ background: "var(--brand)" }}
                                >
                                    {getInitials(b.name)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{b.name}</p>
                                    <p className="flex items-center gap-1.5 truncate text-[12px]" style={{ color: "var(--text-subtle)" }}>
                                        <PinIcon size={11} />
                                        <span className="truncate">{b.region_city}, {b.country}</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="whitespace-nowrap">Added {formatDate(b.created_on)}</span>
                                    </p>
                                </div>

                                <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                                    {b.access_key && (
                                        <>
                                            <KeyTypeBadge type={b.access_key.key_type} />
                                            <KeyStatusBadge status={getKeyStatus(b.access_key)} />
                                        </>
                                    )}
                                    <RoleBadge role={getRole(b)} />
                                </div>

                                <span className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-subtle)" }}>
                                    <ChevronRightIcon size={13} />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Panel>
    );
}