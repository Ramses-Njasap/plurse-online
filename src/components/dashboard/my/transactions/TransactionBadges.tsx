// src/components/dashboard/my/transactions/TransactionBadges.tsx

import type { PaymentStatus, PaymentTargetEntity } from "@/types/users.types";
import { TARGET_LABELS } from "@/app/(dashboard)/dashboard/my/transactions/data/mockTransactions";

export const STATUS_STYLES: Record<PaymentStatus, { background: string; color: string }> = {
    Success: { background: "rgba(34,197,94,0.10)", color: "#16a34a" },
    Pending: { background: "rgba(245,158,11,0.10)", color: "#d97706" },
    Failed: { background: "rgba(239,68,68,0.10)", color: "#dc2626" },
};

export function StatusBadge({ status, size = "md" }: { status: PaymentStatus; size?: "sm" | "md" }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"
                }`}
            style={STATUS_STYLES[status]}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
            {status}
        </span>
    );
}

export function TargetBadge({ target }: { target: PaymentTargetEntity }) {
    return (
        <span
            className="whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
            style={{ background: "var(--surface-muted)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
            {TARGET_LABELS[target]}
        </span>
    );
}