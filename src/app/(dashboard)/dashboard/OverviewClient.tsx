// app/(dashboard)/dashboard/OverviewClient.tsx

"use client";

import { useMemo } from "react";
import { useOverviewData } from "./data/useOverviewData";
import { computeOverview } from "./data/overviewMetrics";
import { WelcomeBanner } from "@/components/dashboard/overview/WelcomeBanner";
import { OverviewKpis } from "@/components/dashboard/overview/OverviewKpis";
import { PaymentsChart } from "@/components/dashboard/overview/PaymentsChart";
import { AttentionPanel } from "@/components/dashboard/overview/AttentionPanel";
import { RecentTransactions } from "@/components/dashboard/overview/RecentTransactions";
import { KeysOverview } from "@/components/dashboard/overview/KeysOverview";
import { RecentBusinesses } from "@/components/dashboard/overview/RecentBusinesses";
import { PartnershipCard } from "@/components/dashboard/overview/PartnershipCard";
import { OverviewSkeleton } from "@/components/dashboard/overview/OverviewSkeleton";
import { SessionExpiredNotice, PartialFailureNotice } from "@/components/dashboard/overview/OverviewNotices";
import { ChannelPartnerPromoBanner } from "@/components/dashboard/my/shared/ChannelPartnerPromoBanner";
import { Reveal } from "@/components/dashboard/my/settings/businesses/Reveal";
import { getGreeting, plural } from "@/components/dashboard/overview/overviewFormat";

export function OverviewClient() {
    const { state, refreshing, reload, retryAll } = useOverviewData();

    const metrics = useMemo(
        () => (state.status === "ready" ? computeOverview(state.data, state.loadedAt) : null),
        [state]
    );

    if (state.status === "loading") return <OverviewSkeleton />;
    if (state.status === "unauthorized") return <SessionExpiredNotice message={state.message} />;
    if (!metrics) return null;

    const { data, failures, loadedAt } = state;

    /* One-line briefing under the greeting */
    const briefing = [
        metrics.businesses
            ? `${metrics.businesses.total} ${plural(metrics.businesses.total, "business", "businesses")}`
            : null,
        metrics.keys
            ? `${metrics.keys.byStatus.active} active ${plural(metrics.keys.byStatus.active, "key", "keys")}`
            : null,
    ].filter(Boolean).join(" · ");

    const status =
        metrics.attentionCount > 0
            ? `${metrics.attentionCount} ${plural(metrics.attentionCount, "item needs", "items need")} your attention.`
            : "Everything is running smoothly.";

    const summary = briefing ? `${briefing}. ${status}` : status;

    return (
        <div className="space-y-6">
            <Reveal index={0}>
                <WelcomeBanner
                    greeting={getGreeting(new Date(loadedAt).getHours())}
                    firstName={metrics.firstName}
                    summary={summary}
                    refreshing={refreshing}
                    onRefresh={reload}
                />
            </Reveal>

            {failures.length > 0 && <PartialFailureNotice failures={failures} onRetry={retryAll} />}

            <Reveal index={1}>
                <OverviewKpis metrics={metrics} />
            </Reveal>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <Reveal index={2}>
                        <PaymentsChart months={metrics.months} total={metrics.sixMonthTotal} payments={metrics.payments} />
                    </Reveal>
                </div>
                <Reveal index={3}>
                    <AttentionPanel items={metrics.attention} count={metrics.attentionCount} />
                </Reveal>

                <div className="xl:col-span-2">
                    <Reveal index={4}>
                        <RecentTransactions
                            transactions={metrics.recentTransactions}
                            now={loadedAt}
                            unavailable={data.transactions === null}
                        />
                    </Reveal>
                </div>
                <Reveal index={5}>
                    <KeysOverview keys={metrics.keys} />
                </Reveal>

                <div className="xl:col-span-2">
                    <Reveal index={6}>
                        <RecentBusinesses businesses={metrics.recentBusinesses} unavailable={data.businesses === null} />
                    </Reveal>
                </div>
                <Reveal index={7}>
                    {metrics.partnership ? (
                        <PartnershipCard partnership={metrics.partnership} />
                    ) : (
                        /* Renders nothing once the user becomes a partner */
                        <ChannelPartnerPromoBanner orientation="vertical" />
                    )}
                </Reveal>
            </div>
        </div>
    );
}