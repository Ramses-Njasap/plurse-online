// src/components/dashboard/overview/KeysOverview.tsx

import type { KeyMetrics } from "@/app/(dashboard)/dashboard/data/overviewMetrics";
import { KeyIcon } from "@/components/dashboard/my/settings/businesses/BusinessIcons";
import { Panel, PanelEmpty } from "./Panel";

const STATUS_ROWS = [
    { key: "active", label: "Active", color: "#16a34a" },
    { key: "pending", label: "Pending payment", color: "#d97706" },
    { key: "inactive", label: "Inactive", color: "#64748b" },
    { key: "expired", label: "Expired", color: "#dc2626" },
] as const;

export function KeysOverview({ keys }: { keys: KeyMetrics | null }) {
    return (
        <Panel title="Access keys" subtitle="Status and plan mix" action={{ label: "Manage", href: "/dashboard/my/keys" }}>
            {!keys || keys.total === 0 ? (
                <PanelEmpty
                    icon={<KeyIcon size={18} />}
                    title={keys ? "No access keys yet" : "Keys unavailable"}
                    description={keys ? "Keys appear here once you add a business or create one." : "We couldn't load your keys. Try refreshing."}
                />
            ) : (
                <div className="space-y-6">
                    {/* Plan mix */}
                    <div>
                        <div className="mb-2 flex items-center justify-between text-[12px]">
                            <p className="font-semibold" style={{ color: "var(--foreground)" }}>Plan mix</p>
                            <p style={{ color: "var(--text-subtle)" }}>{keys.total} total</p>
                        </div>
                        <div className="flex h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-muted)" }}>
                            <div style={{ width: `${(keys.lifetime / keys.total) * 100}%`, background: "var(--brand)" }} />
                            <div style={{ width: `${(keys.trial / keys.total) * 100}%`, background: "#f59e0b" }} />
                        </div>
                        <div className="mt-2.5 flex items-center gap-5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand)" }} />
                                Lifetime <b style={{ color: "var(--foreground)" }}>{keys.lifetime}</b>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ background: "#f59e0b" }} />
                                Trial <b style={{ color: "var(--foreground)" }}>{keys.trial}</b>
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-3.5">
                        <p className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>By status</p>
                        {STATUS_ROWS.map((row) => {
                            const count = keys.byStatus[row.key];
                            return (
                                <div key={row.key}>
                                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                                        <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                                            <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
                                            {row.label}
                                        </span>
                                        <span className="font-semibold" style={{ color: "var(--foreground)" }}>{count}</span>
                                    </div>
                                    <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-muted)" }}>
                                        <div
                                            className="h-full rounded-full transition-[width] duration-500"
                                            style={{ width: `${(count / keys.total) * 100}%`, background: row.color }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Panel>
    );
}