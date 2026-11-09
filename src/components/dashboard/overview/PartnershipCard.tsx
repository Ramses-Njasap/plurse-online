// src/components/dashboard/overview/PartnershipCard.tsx

import Link from "next/link";
import type { PartnershipMetrics } from "@/app/(dashboard)/dashboard/data/overviewMetrics";
import { ShieldIcon, ArrowRightIcon } from "./OverviewIcons";
import { formatDate, plural } from "./overviewFormat";


/* Same gold palette as the ChannelPartnerPromoBanner so the two states feel related */
const GOLD = {
    border: "#FDE68A",
    bg: "#FFFBEB",
    text: "#92400E",
    muted: "#B45309",
    accent: "#D97706",
};

export function PartnershipCard({ partnership }: { partnership: PartnershipMetrics }) {
    const { validTo, daysLeft, managedBusinesses, activeManagedKeys, lifetimeManagedKeys } = partnership;
    const endingSoon = daysLeft !== null && daysLeft <= 14;

    return (
        <section className="flex h-full flex-col rounded-xl border p-5" style={{ borderColor: GOLD.border, background: GOLD.bg }}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: GOLD.accent }}>
                        <ShieldIcon size={17} />
                    </span>
                    <div>
                        <h3 className="text-[14px] font-semibold" style={{ color: GOLD.text }}>Channel partner</h3>
                        <p className="text-[12px]" style={{ color: GOLD.muted }}>Partnership is active</p>
                    </div>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: GOLD.accent }}>
                    Active
                </span>
            </div>

            {/* Validity */}
            <div className="mt-5 rounded-lg border px-3.5 py-3" style={{ borderColor: GOLD.border, background: "rgba(255,255,255,0.6)" }}>
                {validTo ? (
                    <>
                        <p className="text-[11px] font-medium" style={{ color: GOLD.muted }}>Valid until</p>
                        <p className="mt-0.5 text-[15px] font-bold" style={{ color: GOLD.text }}>{formatDate(validTo)}</p>
                        {daysLeft !== null && (
                            <p className="mt-0.5 text-[12px] font-medium" style={{ color: endingSoon ? "#dc2626" : GOLD.muted }}>
                                {daysLeft === 0 ? "Ends today" : `${daysLeft} ${plural(daysLeft, "day", "days")} left`}
                                {endingSoon && daysLeft > 0 ? " — renew soon" : ""}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-[12px]" style={{ color: GOLD.muted }}>
                        Your renewal date will show here once you manage your first business.
                    </p>
                )}
            </div>

            {/* Stats */}
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                    { label: "Managed", value: managedBusinesses },
                    { label: "Active keys", value: activeManagedKeys },
                    { label: "Lifetime", value: lifetimeManagedKeys },
                ].map((s) => (
                    <div key={s.label}>
                        <dd className="text-[18px] font-bold leading-tight" style={{ color: GOLD.text }}>{s.value}</dd>
                        <dt className="text-[11px]" style={{ color: GOLD.muted }}>{s.label}</dt>
                    </div>
                ))}
            </dl>

            <Link
                href="/dashboard/my/businesses"
                className="mt-auto flex items-center gap-1 pt-5 text-[12px] font-semibold transition-opacity hover:opacity-80"
                style={{ color: GOLD.text }}
            >
                Manage client businesses
                <ArrowRightIcon size={12} />
            </Link>
        </section>
    );
}