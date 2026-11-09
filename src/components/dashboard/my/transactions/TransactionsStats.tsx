// src/components/dashboard/my/transactions/TransactionsStats.tsx

import type { TransactionStats } from "@/types/users.types";
import { formatAmount } from "@/app/(dashboard)/dashboard/my/transactions/data/mockTransactions";
import { STATUS_STYLES } from "./TransactionBadges";

export function TransactionsStats({ stats }: { stats: TransactionStats }) {
    const cards = [
        { label: "Total paid", value: formatAmount(stats.totalPaid), hint: "Successful payments only", dot: "var(--brand)" },
        { label: "Successful", value: String(stats.successCount), hint: "Confirmed by the gateway", dot: STATUS_STYLES.Success.color },
        { label: "Pending", value: String(stats.pendingCount), hint: "Awaiting confirmation", dot: STATUS_STYLES.Pending.color },
        { label: "Failed", value: String(stats.failedCount), hint: "Can be retried", dot: STATUS_STYLES.Failed.color },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="rounded-xl border px-4 py-3.5"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: c.dot }} />
                        <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>{c.label}</p>
                    </div>
                    <p className="mt-1.5 text-[20px] font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
                        {c.value}
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>{c.hint}</p>
                </div>
            ))}
        </div>
    );
}