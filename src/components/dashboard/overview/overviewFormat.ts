// src/components/dashboard/overview/overviewFormat.ts

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;

export const monthLabel = (monthIndex: number) => MONTHS[monthIndex];

/** UTC-stable date, e.g. "Oct 26, 2026". */
export function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Today", "Yesterday", "3 days ago", otherwise the date. */
export function formatRelativeDay(iso: string | null | undefined, now: number): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    const startOfDay = (t: number) => {
        const x = new Date(t);
        return Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
    };
    const diff = Math.round((startOfDay(now) - startOfDay(d.getTime())) / DAY_MS);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff > 1 && diff < 7) return `${diff} days ago`;
    return formatDate(iso);
}

/** "15 000 FCFA" (non-breaking spaces), matching the Keys and Transactions pages. */
export function formatAmount(n: number): string {
    return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")} FCFA`;
}

/** 4200000 → "4.2M" */
export function formatCompact(n: number): string {
    const abs = Math.abs(n);
    const trim = (v: number) => v.toFixed(1).replace(/\.0$/, "");
    if (abs >= 1e9) return `${trim(n / 1e9)}B`;
    if (abs >= 1e6) return `${trim(n / 1e6)}M`;
    if (abs >= 1e3) return `${trim(n / 1e3)}K`;
    return String(Math.round(n));
}

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export function getGreeting(hour: number): string {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}