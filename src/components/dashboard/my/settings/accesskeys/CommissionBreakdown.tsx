// src/components/dashboard/my/settings/accesskeys/CommissionBreakdown.tsx

import { calculateTierCommission, getNextTier, formatXAF } from "./commission";

const PARTNER_COLOR = "#16a34a";

export function CommissionBreakdown({ price }: { price: number }) {
    const { companyPercent, partnerPercent, companyEarns, partnerEarns } = calculateTierCommission(price);
    const next = getNextTier(price);

    return (
        <div
            className="flex h-full flex-col rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
        >
            <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Your commission per key</p>
            <p className="mt-1 text-[26px] font-semibold leading-tight" style={{ color: PARTNER_COLOR }}>
                {formatXAF(partnerEarns)}
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-subtle)" }}>
                {partnerPercent}% of a {formatXAF(price)} sale
            </p>

            {/* Split bar */}
            <div
                className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full"
                style={{ background: "var(--border)" }}
                role="img"
                aria-label={`Company ${companyPercent} percent, you ${partnerPercent} percent`}
            >
                <div style={{ width: `${partnerPercent}%`, background: PARTNER_COLOR, transition: "width 240ms ease" }} />
                <div style={{ width: `${companyPercent}%`, background: "var(--text-subtle)", opacity: 0.55, transition: "width 240ms ease" }} />
            </div>

            <div className="mt-3 space-y-2">
                <LegendRow color={PARTNER_COLOR} label={`You (${partnerPercent}%)`} value={formatXAF(partnerEarns)} />
                <LegendRow color="var(--text-subtle)" muted label={`Company (${companyPercent}%)`} value={formatXAF(companyEarns)} />
            </div>

            <div className="mt-auto pt-5">
                <p className="border-t pt-3 text-[12px] leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>
                    {next
                        ? `At ${formatXAF(next.threshold)} your share rises to ${next.partnerPercent}%.`
                        : "You're on the top tier, with the highest partner share."}
                </p>
            </div>
        </div>
    );
}

function LegendRow({ color, label, value, muted = false }: { color: string; label: string; value: string; muted?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                <span className="h-2 w-2 rounded-full" style={{ background: color, opacity: muted ? 0.55 : 1 }} />
                {label}
            </span>
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>{value}</span>
        </div>
    );
}