// src/components/dashboard/overview/PaymentsChart.tsx

"use client";

import { useEffect, useState } from "react";
import type { MonthBucket, PaymentMetrics } from "@/app/(dashboard)/dashboard/data/overviewMetrics";
import { Panel, PanelEmpty } from "./Panel";
import { WalletIcon } from "./OverviewIcons";
import { formatAmount, formatCompact, plural } from "./overviewFormat";

const STATUS_COLORS = { success: "#16a34a", pending: "#d97706", failed: "#dc2626" };

interface PaymentsChartProps {
    months: MonthBucket[];
    total: number;
    payments: PaymentMetrics | null;
}

export function PaymentsChart({ months, total, payments }: PaymentsChartProps) {
    const [grown, setGrown] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const max = Math.max(...months.map((m) => m.paid), 0);
    const hasData = max > 0;

    return (
        <Panel
            title="Payment activity"
            subtitle="Successful payments, last 6 months"
            headerRight={
                <div className="text-right">
                    <p className="text-[15px] font-bold leading-tight" style={{ color: "var(--foreground)" }}>
                        {formatCompact(total)} <span className="text-[11px] font-semibold" style={{ color: "var(--text-subtle)" }}>FCFA</span>
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>6-month total</p>
                </div>
            }
        >
            {!hasData ? (
                <PanelEmpty
                    icon={<WalletIcon size={18} />}
                    title="No successful payments yet"
                    description="Payments for access keys, businesses and your partnership will chart here."
                />
            ) : (
                <>
                    {/* Chart */}
                    <div className="relative h-44" role="img" aria-label="Bar chart of successful payments per month">
                        {[0, 0.5, 1].map((v) => (
                            <div
                                key={v}
                                className="absolute left-0 right-0 border-t border-dashed"
                                style={{ bottom: `${v * 100}%`, borderColor: "var(--border)" }}
                            />
                        ))}
                        <span className="absolute -top-2 left-0 bg-[var(--surface)] pr-1.5 text-[10px] font-medium" style={{ color: "var(--text-subtle)" }}>
                            {formatCompact(max)}
                        </span>

                        <div className="absolute inset-0 flex items-end gap-3 px-1">
                            {months.map((m) => {
                                const pct = (m.paid / max) * 100;
                                return (
                                    <div
                                        key={m.key}
                                        tabIndex={0}
                                        aria-label={`${m.label}: ${formatAmount(m.paid)} from ${m.count} ${plural(m.count, "payment", "payments")}`}
                                        className="group relative flex h-full flex-1 flex-col items-center justify-end focus:outline-none"
                                    >
                                        {/* Tooltip */}
                                        <div
                                            className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border px-2.5 py-1.5 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100"
                                            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                                        >
                                            <p className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>{formatAmount(m.paid)}</p>
                                            <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                                {m.count} {plural(m.count, "payment", "payments")}
                                            </p>
                                        </div>

                                        <div
                                            className="w-full max-w-[46px] rounded-t-md transition-[height,background] duration-500 ease-out motion-reduce:transition-none"
                                            style={{
                                                height: grown ? `${m.paid > 0 ? Math.max(pct, 3) : 0}%` : "0%",
                                                background: m.isCurrent ? "var(--brand)" : "rgba(59,130,246,0.32)",
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Month labels */}
                    <div className="mt-2 flex gap-3 px-1">
                        {months.map((m) => (
                            <span
                                key={m.key}
                                className="flex-1 text-center text-[11px] font-medium"
                                style={{ color: m.isCurrent ? "var(--foreground)" : "var(--text-subtle)" }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {payments && <PaymentHealth payments={payments} />}
        </Panel>
    );
}

function PaymentHealth({ payments }: { payments: PaymentMetrics }) {
    const total = payments.success + payments.pending + payments.failed;
    const segments = [
        { key: "success", label: "Successful", count: payments.success, color: STATUS_COLORS.success },
        { key: "pending", label: "Pending", count: payments.pending, color: STATUS_COLORS.pending },
        { key: "failed", label: "Failed", count: payments.failed, color: STATUS_COLORS.failed },
    ];

    return (
        <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>Payment health</p>
                <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                    {payments.successRate !== null ? (
                        <>
                            <span className="font-semibold" style={{ color: "var(--foreground)" }}>{Math.round(payments.successRate)}%</span> success rate
                        </>
                    ) : (
                        "No settled payments yet"
                    )}
                </p>
            </div>

            <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-muted)" }}>
                {total > 0 && segments.map((s) => (
                    s.count > 0 && <div key={s.key} style={{ width: `${(s.count / total) * 100}%`, background: s.color }} />
                ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                {segments.map((s) => (
                    <span key={s.key} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        {s.label}
                        <span className="font-semibold" style={{ color: "var(--foreground)" }}>{s.count}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}