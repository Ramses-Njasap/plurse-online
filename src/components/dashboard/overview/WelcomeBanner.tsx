// src/components/dashboard/overview/WelcomeBanner.tsx

import Link from "next/link";
import { RefreshIcon } from "./OverviewIcons";

interface WelcomeBannerProps {
    greeting: string;
    firstName: string | null;
    summary: string;
    refreshing: boolean;
    onRefresh: () => void;
}

export function WelcomeBanner({ greeting, firstName, summary, refreshing, onRefresh }: WelcomeBannerProps) {
    return (
        <section
            className="relative overflow-hidden rounded-2xl px-6 py-6 sm:px-8"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
        >
            {/* Decorative rings */}
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.14)" }} />
            <span aria-hidden="true" className="pointer-events-none absolute -right-4 -top-12 h-44 w-44 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.12)" }} />

            <div className="relative flex flex-wrap items-end justify-between gap-5">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Overview
                    </p>
                    <h2 className="mt-1.5 text-[24px] font-bold leading-tight tracking-tight text-white">
                        {greeting}{firstName ? `, ${firstName}` : ""}.
                    </h2>
                    <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
                        {summary}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/dashboard/my/businesses"
                        className="flex h-9 items-center rounded-lg bg-white px-3.5 text-[13px] font-semibold transition-opacity hover:opacity-90"
                        style={{ color: "#2563eb" }}
                    >
                        Businesses
                    </Link>
                    <Link
                        href="/dashboard/my/keys"
                        className="flex h-9 items-center rounded-lg border px-3.5 text-[13px] font-semibold text-white transition-colors"
                        style={{ borderColor: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.10)" }}
                    >
                        Access keys
                    </Link>
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        aria-label="Refresh overview"
                        title="Refresh"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border text-white transition-colors disabled:opacity-70"
                        style={{ borderColor: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.10)" }}
                    >
                        <RefreshIcon size={14} className={refreshing ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>
        </section>
    );
}