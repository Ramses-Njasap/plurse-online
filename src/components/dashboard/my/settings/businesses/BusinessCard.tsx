// src/components/dashboard/my/settings/businesses/BusinessCard.tsx

"use client";

import type { Business } from "@/types/users.types";
import {
    formatDate, getInitials, getKeyStatus, getRole, describeKeyExpiry,
} from "./businessUtils";
import { RoleBadge, KeyTypeBadge, KeyStatusBadge } from "./BusinessBadges";
import { PinIcon, ChevronRightIcon } from "./BusinessIcons";

interface BusinessCardProps {
    business: Business;
    onOpen: (b: Business) => void;
}

export function BusinessCard({ business: b, onOpen }: BusinessCardProps) {
    const role = getRole(b);
    const key = b.access_key;
    const keyStatus = getKeyStatus(key);
    const managerName = b.manager_profile?.full_name;
    const partnerName = b.channel_partner?.profile?.full_name;

    return (
        <button
            type="button"
            onClick={() => onOpen(b)}
            className="group flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-all focus:outline-none focus-visible:[box-shadow:0_0_0_3px_var(--brand-ring)]"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,23,42,0.06)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Identity */}
            <div className="flex items-start gap-3">
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                    style={{ background: "var(--brand)" }}
                >
                    {getInitials(b.name)}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
                            {b.name}
                        </h3>
                        <RoleBadge role={role} />
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-subtle)" }}>
                        <PinIcon size={12} />
                        <span className="truncate">{b.region_city}, {b.country}</span>
                    </p>
                </div>
            </div>

            {/* Facts */}
            <div
                className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border p-3"
                style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
            >
                <Fact label="Access key">
                    {key ? (
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <KeyTypeBadge type={key.key_type} />
                                <KeyStatusBadge status={keyStatus} />
                            </div>
                            <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{describeKeyExpiry(key)}</p>
                        </div>
                    ) : (
                        <Muted>No access key</Muted>
                    )}
                </Fact>

                <Fact label="Business code">
                    {b.business_code ? (
                        <span className="font-mono text-[12px]" style={{ color: "var(--foreground)" }}>{b.business_code}</span>
                    ) : (
                        <Muted>—</Muted>
                    )}
                </Fact>

                <Fact label="Manager">
                    {managerName ? (
                        <span className="text-[12.5px] font-medium" style={{ color: "var(--foreground)" }}>{managerName}</span>
                    ) : (
                        <Muted>—</Muted>
                    )}
                </Fact>

                <Fact label="Channel partner">
                    {partnerName ? (
                        <span className="text-[12.5px] font-medium" style={{ color: "var(--foreground)" }}>{partnerName}</span>
                    ) : (
                        <Muted>None</Muted>
                    )}
                </Fact>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
                <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                    Created {formatDate(b.created_on)}
                </p>
                <span
                    className="flex items-center gap-1 text-[12px] font-semibold transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--brand)" }}
                >
                    View details
                    <ChevronRightIcon size={13} />
                </span>
            </div>
        </button>
    );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="mb-1 text-[11px] font-medium" style={{ color: "var(--text-subtle)" }}>{label}</p>
            {children}
        </div>
    );
}

function Muted({ children }: { children: React.ReactNode }) {
    return <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>{children}</span>;
}