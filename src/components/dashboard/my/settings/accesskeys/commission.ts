// src/components/dashboard/my/settings/accesskeys/commission.ts

export const MIN_PRICE = 15000;

export interface CommissionTier {
    threshold: number;
    companyPercent: number;
    partnerPercent: number;
}

/** Ascending by threshold. The partner share grows with the selling price. */
export const TIERS: CommissionTier[] = [
    { threshold: 15000, companyPercent: 70, partnerPercent: 30 },
    { threshold: 30000, companyPercent: 65, partnerPercent: 35 },
    { threshold: 40000, companyPercent: 60, partnerPercent: 40 },
    { threshold: 50000, companyPercent: 50, partnerPercent: 50 },
    { threshold: 60000, companyPercent: 40, partnerPercent: 60 },
    { threshold: 70000, companyPercent: 30, partnerPercent: 70 },
];

export function getTier(price: number): CommissionTier {
    return [...TIERS].reverse().find((t) => price >= t.threshold) ?? TIERS[0];
}

export function getNextTier(price: number): CommissionTier | null {
    return TIERS.find((t) => t.threshold > price) ?? null;
}

export interface TierBreakdown {
    companyPercent: number;
    partnerPercent: number;
    companyEarns: number;
    partnerEarns: number;
}

export function calculateTierCommission(price: number): TierBreakdown {
    const { companyPercent, partnerPercent } = getTier(price);
    return {
        companyPercent,
        partnerPercent,
        companyEarns: (price * companyPercent) / 100,
        partnerEarns: (price * partnerPercent) / 100,
    };
}

/** Locale-independent so server and client render identically. */
export function formatXAF(n: number): string {
    return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} XAF`;
}