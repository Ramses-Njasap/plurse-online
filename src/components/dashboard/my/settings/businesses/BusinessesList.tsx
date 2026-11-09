// src/components/dashboard/my/settings/businesses/BusinessesList.tsx

"use client";

import type { Business } from "@/types/users.types";
import { BusinessRow, COL } from "./BusinessRow";
import { Reveal } from "./Reveal";

interface BusinessesListProps {
    businesses: Business[];
    onOpen: (b: Business) => void;
}

/** Compact, scannable alternative to the card grid for larger portfolios. */
export function BusinessesList({ businesses, onOpen }: BusinessesListProps) {
    return (
        <div
            className="divide-y divide-[color:var(--border)] overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            {/* Column headings (hidden on small screens) */}
            <div
                className="hidden items-center gap-4 px-4 py-2.5 md:flex"
                style={{ background: "var(--surface-muted)" }}
            >
                <Th className="flex-1">Business</Th>
                <Th className={COL.location}>Location</Th>
                <Th className={COL.key}>Access key</Th>
                <Th className={COL.manager}>Manager</Th>
                <Th className="hidden w-32 shrink-0 sm:block">Relationship</Th>
                <span className="w-[13px]" aria-hidden="true" />
            </div>

            {businesses.map((b, i) => (
                <Reveal key={b.id} index={i}>
                    <BusinessRow business={b} onOpen={onOpen} />
                </Reveal>
            ))}
        </div>
    );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <span
            className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide ${className}`}
            style={{ color: "var(--text-subtle)" }}
        >
            {children}
        </span>
    );
}