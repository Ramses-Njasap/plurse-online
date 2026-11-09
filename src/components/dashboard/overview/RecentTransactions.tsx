// src/components/dashboard/overview/RecentTransactions.tsx

import type { Transaction } from "@/types/users.types";
import { BuildingIcon, KeyIcon, LinkIcon } from "@/components/dashboard/my/settings/businesses/BusinessIcons";
import { Panel, PanelEmpty } from "./Panel";
import { ReceiptIcon } from "./OverviewIcons";
import { formatAmount, formatRelativeDay } from "./overviewFormat";

const STATUS_STYLES = {
    Success: { background: "rgba(34,197,94,0.10)", color: "#16a34a" },
    Pending: { background: "rgba(245,158,11,0.10)", color: "#d97706" },
    Failed: { background: "rgba(239,68,68,0.10)", color: "#dc2626" },
} as const;

const TARGET_LABELS: Record<string, string> = {
    access_keys: "Access key",
    businesses: "Business",
    channel_partners: "Channel partner",
};

const TARGET_ICONS: Record<string, React.ReactNode> = {
    access_keys: <KeyIcon size={15} />,
    businesses: <BuildingIcon size={15} />,
    channel_partners: <LinkIcon size={15} />,
};

function describe(t: Transaction): string {
    const purpose = (t.payload as Record<string, unknown> | null)?.purpose;
    return typeof purpose === "string" ? purpose : TARGET_LABELS[t.target_entity] ?? "Payment";
}

interface RecentTransactionsProps {
    transactions: Transaction[];
    now: number;
    unavailable: boolean;
}

export function RecentTransactions({ transactions, now, unavailable }: RecentTransactionsProps) {
    return (
        <Panel
            title="Recent transactions"
            subtitle="Your latest payments"
            action={{ label: "View all", href: "/dashboard/my/transactions" }}
            bodyClassName="p-0"
        >
            {unavailable ? (
                <PanelEmpty icon={<ReceiptIcon size={18} />} title="Transactions unavailable" description="We couldn't load your payments. Try refreshing." />
            ) : transactions.length === 0 ? (
                <PanelEmpty
                    icon={<ReceiptIcon size={18} />}
                    title="No transactions yet"
                    description="Payments for keys, businesses and your partnership will appear here."
                />
            ) : (
                <ul className="divide-y divide-[color:var(--border)]">
                    {transactions.map((t) => {
                        const status = STATUS_STYLES[t.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.Pending;
                        return (
                            <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                    style={{ background: "var(--surface-muted)", color: "var(--text-muted)" }}
                                >
                                    {TARGET_ICONS[t.target_entity] ?? <ReceiptIcon size={15} />}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{describe(t)}</p>
                                    <p className="truncate text-[12px]" style={{ color: "var(--text-subtle)" }}>
                                        {t.business?.name ? `${t.business.name} · ` : ""}{formatRelativeDay(t.created_on, now)}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{formatAmount(Number(t.amount) || 0)}</p>
                                    <span
                                        className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                        style={status}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
                                        {t.status}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Panel>
    );
}