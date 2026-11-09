// src/components/dashboard/overview/AttentionPanel.tsx

import Link from "next/link";
import type { AttentionItem } from "@/app/(dashboard)/dashboard/data/overviewMetrics";
import { ChevronRightIcon } from "@/components/dashboard/my/settings/businesses/BusinessIcons";
import { Panel, PanelEmpty } from "./Panel";
import { AlertIcon, CheckCircleIcon, InfoIcon } from "./OverviewIcons";

const TONES = {
    danger: { background: "rgba(239,68,68,0.10)", color: "#dc2626", icon: <AlertIcon size={15} /> },
    warning: { background: "rgba(245,158,11,0.12)", color: "#d97706", icon: <AlertIcon size={15} /> },
    info: { background: "var(--brand-light)", color: "var(--brand)", icon: <InfoIcon size={15} /> },
} as const;

interface AttentionPanelProps {
    items: AttentionItem[];
    count: number;
}

export function AttentionPanel({ items, count }: AttentionPanelProps) {
    return (
        <Panel
            title="Needs attention"
            subtitle="Payments and keys that need a decision"
            headerRight={
                count > 0 ? (
                    <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                        style={{ background: "rgba(245,158,11,0.12)", color: "#d97706" }}
                    >
                        {count}
                    </span>
                ) : undefined
            }
            bodyClassName="p-0"
        >
            {items.length === 0 ? (
                <PanelEmpty
                    icon={<CheckCircleIcon size={18} />}
                    title="All clear"
                    description="No failed payments, expired keys or trials about to end."
                />
            ) : (
                <ul className="divide-y divide-[color:var(--border)]">
                    {items.map((item) => {
                        const tone = TONES[item.tone];
                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className="group flex items-center gap-3 px-5 py-3.5 transition-colors focus:outline-none focus-visible:[box-shadow:inset_0_0_0_2px_var(--brand-ring)]"
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                                        style={{ background: tone.background, color: tone.color }}
                                    >
                                        {tone.icon}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{item.title}</p>
                                        <p className="truncate text-[12px]" style={{ color: "var(--text-subtle)" }}>{item.description}</p>
                                    </div>
                                    <span className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-subtle)" }}>
                                        <ChevronRightIcon size={13} />
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Panel>
    );
}