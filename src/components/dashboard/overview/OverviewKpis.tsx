// src/components/dashboard/overview/OverviewKpis.tsx

import type { OverviewMetrics } from "@/app/(dashboard)/dashboard/data/overviewMetrics";
import { BuildingIcon, KeyIcon } from "@/components/dashboard/my/settings/businesses/BusinessIcons";
import { WalletIcon, AlertIcon, CheckCircleIcon } from "./OverviewIcons";
import { formatCompact, plural } from "./overviewFormat";

const GREEN = "#16a34a";
const RED = "#dc2626";
const AMBER = "#d97706";

interface KpiProps {
    label: string;
    value: string;
    unit?: string;
    hint: string;
    hintColor?: string;
    icon: React.ReactNode;
    iconTone?: "brand" | "warning" | "success";
}

const ICON_TONES = {
    brand: { background: "var(--brand-light)", color: "var(--brand)" },
    warning: { background: "rgba(245,158,11,0.12)", color: AMBER },
    success: { background: "rgba(34,197,94,0.12)", color: GREEN },
};

function KpiCard({ label, value, unit, hint, hintColor, icon, iconTone = "brand" }: KpiProps) {
    return (
        <div
            className="flex h-full flex-col justify-between rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={ICON_TONES[iconTone]}>
                    {icon}
                </span>
            </div>
            <div className="mt-4">
                <p className="text-[26px] font-bold leading-none tracking-tight" style={{ color: "var(--foreground)" }}>
                    {value}
                    {unit && <span className="ml-1.5 text-[13px] font-semibold" style={{ color: "var(--text-subtle)" }}>{unit}</span>}
                </p>
                <p className="mt-2 text-[12px]" style={{ color: hintColor ?? "var(--text-subtle)" }}>{hint}</p>
            </div>
        </div>
    );
}

export function OverviewKpis({ metrics }: { metrics: OverviewMetrics }) {
    const { businesses, keys, payments, attentionCount } = metrics;

    /* Payments trend vs the previous 30 days */
    let paymentsHint = "Successful payments to date";
    let paymentsColor: string | undefined;
    if (payments) {
        if (payments.deltaPct !== null) {
            const up = payments.deltaPct >= 0;
            paymentsHint = `${up ? "+" : "−"}${Math.abs(Math.round(payments.deltaPct))}% vs previous 30 days`;
            paymentsColor = up ? GREEN : RED;
        } else if (payments.paidLast30 > 0) {
            paymentsHint = "First payments in the last 30 days";
            paymentsColor = GREEN;
        } else {
            paymentsHint = "No payments in the last 30 days";
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
                label="Businesses"
                value={businesses ? String(businesses.total) : "—"}
                hint={
                    businesses
                        ? businesses.managed > 0
                            ? `${businesses.owned} owned · ${businesses.managed} managed`
                            : `${businesses.owned} owned by you`
                        : "Couldn't load"
                }
                icon={<BuildingIcon size={16} />}
            />
            <KpiCard
                label="Active keys"
                value={keys ? String(keys.byStatus.active) : "—"}
                hint={keys ? `${keys.total} total · ${keys.lifetime} lifetime · ${keys.trial} trial` : "Couldn't load"}
                icon={<KeyIcon size={16} />}
            />
            <KpiCard
                label="Total paid"
                value={payments ? formatCompact(payments.totalPaid) : "—"}
                unit={payments ? "FCFA" : undefined}
                hint={payments ? paymentsHint : "Couldn't load"}
                hintColor={paymentsColor}
                icon={<WalletIcon size={16} />}
            />
            <KpiCard
                label="Needs attention"
                value={String(attentionCount)}
                hint={
                    attentionCount > 0
                        ? `${attentionCount} ${plural(attentionCount, "item needs", "items need")} your review`
                        : "Everything looks healthy"
                }
                hintColor={attentionCount > 0 ? AMBER : GREEN}
                icon={attentionCount > 0 ? <AlertIcon size={16} /> : <CheckCircleIcon size={16} />}
                iconTone={attentionCount > 0 ? "warning" : "success"}
            />
        </div>
    );
}