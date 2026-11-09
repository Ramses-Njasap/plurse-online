// src/components/dashboard/my/settings/businesses/BusinessBadges.tsx

import type { AccessKey } from "@/types/users.types";
import { type BusinessRole, type KeyStatus } from "./businessUtils";

const pill = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

export function RoleBadge({ role }: { role: BusinessRole }) {
    return (
        <span
            className={`${pill} shrink-0`}
            style={
                role === "owner"
                    ? { background: "rgba(139,92,246,0.10)", color: "#7c3aed" }
                    : { background: "rgba(59,130,246,0.10)", color: "#3b82f6" }
            }
        >
            {role === "owner" ? "Owner" : "Channel partner"}
        </span>
    );
}

export function KeyTypeBadge({ type }: { type: AccessKey["key_type"] }) {
    return (
        <span
            className={pill}
            style={
                type === "LIFETIME"
                    ? { background: "rgba(59,130,246,0.10)", color: "#3b82f6" }
                    : { background: "rgba(245,158,11,0.10)", color: "#d97706" }
            }
        >
            {type === "LIFETIME" ? "Lifetime" : "Trial"}
        </span>
    );
}

const STATUS: Record<Exclude<KeyStatus, "none">, { label: string; background: string; color: string }> = {
    active: { label: "Active", background: "rgba(34,197,94,0.10)", color: "#16a34a" },
    pending: { label: "Pending payment", background: "rgba(245,158,11,0.10)", color: "#d97706" },
    inactive: { label: "Inactive", background: "rgba(100,116,139,0.12)", color: "#64748b" },
    expired: { label: "Expired", background: "rgba(239,68,68,0.10)", color: "#dc2626" },
};

export function KeyStatusBadge({ status }: { status: KeyStatus }) {
    if (status === "none") return null;
    const s = STATUS[status];
    return (
        <span className={pill} style={{ background: s.background, color: s.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
            {s.label}
        </span>
    );
}