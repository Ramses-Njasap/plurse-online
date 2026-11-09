// src/components/dashboard/my/settings/businesses/BusinessRow.tsx

"use client";

import type { Business } from "@/types/users.types";
import { getInitials, getKeyStatus, getRole, describeKeyExpiry } from "./businessUtils";
import { RoleBadge, KeyTypeBadge, KeyStatusBadge } from "./BusinessBadges";
import { PinIcon, ChevronRightIcon } from "./BusinessIcons";

/* Column widths are shared with the header in BusinessesList so everything lines up. */
export const COL = {
    location: "hidden w-40 md:flex",
    key: "hidden w-52 lg:flex",
    manager: "hidden w-36 xl:block",
    role: "w-32 shrink-0 hidden sm:block",
} as const;

interface BusinessRowProps {
    business: Business;
    onOpen: (b: Business) => void;
}

export function BusinessRow({ business: b, onOpen }: BusinessRowProps) {
    const key = b.access_key;
    const keyStatus = getKeyStatus(key);
    const managerName = b.manager_profile?.full_name;

    return (
        <button
            type="button"
            onClick={() => onOpen(b)}
            className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors focus:outline-none focus-visible:[box-shadow:inset_0_0_0_2px_var(--brand-ring)]"
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            {/* Business */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white"
                    style={{ background: "var(--brand)" }}
                >
                    {getInitials(b.name)}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{b.name}</p>
                    <p className="truncate font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>
                        {b.business_code ?? "—"}
                    </p>
                    {/* Small screens: location folds under the name */}
                    <p className="mt-0.5 truncate text-[11px] md:hidden" style={{ color: "var(--text-subtle)" }}>
                        {b.region_city}, {b.country}
                    </p>
                </div>
            </div>

            {/* Location */}
            <div className={`${COL.location} items-center gap-1.5 text-[12px]`} style={{ color: "var(--text-muted)" }}>
                <PinIcon size={12} />
                <span className="truncate">{b.region_city}, {b.country}</span>
            </div>

            {/* Access key */}
            <div className={`${COL.key} flex-col items-start gap-1`}>
                {key ? (
                    <>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <KeyTypeBadge type={key.key_type} />
                            <KeyStatusBadge status={keyStatus} />
                        </div>
                        <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{describeKeyExpiry(key)}</span>
                    </>
                ) : (
                    <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>No access key</span>
                )}
            </div>

            {/* Manager */}
            <div className={`${COL.manager} truncate text-[12.5px] font-medium`} style={{ color: managerName ? "var(--foreground)" : "var(--text-subtle)" }}>
                {managerName ?? "—"}
            </div>

            {/* Relationship */}
            <div className={COL.role}>
                <RoleBadge role={getRole(b)} />
            </div>

            <span style={{ color: "var(--text-subtle)" }}><ChevronRightIcon size={13} /></span>
        </button>
    );
}