// src/components/dashboard/my/settings/businesses/BusinessesGrid.tsx

"use client";

import type { Business } from "@/types/users.types";
import { BusinessCard } from "./BusinessCard";
import { Reveal } from "./Reveal";

interface BusinessesGridProps {
    businesses: Business[];
    onOpen: (b: Business) => void;
}

export function BusinessesGrid({ businesses, onOpen }: BusinessesGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {businesses.map((b, i) => (
                <Reveal key={b.id} index={i}>
                    <BusinessCard business={b} onOpen={onOpen} />
                </Reveal>
            ))}
        </div>
    );
}