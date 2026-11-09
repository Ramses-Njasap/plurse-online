// app/(dashboard)/dashboard/data/overviewMetrics.ts
//
// Pure functions: raw records in, display-ready metrics out. No fetching, no React.

import type { Business, AccessKey, Transaction } from "@/types/users.types";
import { getKeyStatus } from "@/components/dashboard/my/settings/businesses/businessUtils";
import { monthLabel, plural } from "@/components/dashboard/overview/overviewFormat";

const DAY_MS = 86_400_000;
const EXPIRING_WINDOW_DAYS = 7;
const CHART_MONTHS = 6;

const HREF = {
    transactions: "/dashboard/my/transactions",
    keys: "/dashboard/my/keys",
    businesses: "/dashboard/my/businesses",
};

/* ── Input ── A source is null when it failed to load ── */
export interface OverviewData {
    businesses: Business[] | null;
    keys: AccessKey[] | null;
    transactions: Transaction[] | null;
    isPartner: boolean;
}

/* ── Output ── */
export interface BusinessMetrics { total: number; owned: number; managed: number }

export interface ExpiringKey { id: string; businessName: string | null; daysLeft: number }

export interface KeyMetrics {
    total: number;
    byStatus: { active: number; pending: number; inactive: number; expired: number };
    lifetime: number;
    trial: number;
    activeTrials: number;
    expiring: ExpiringKey[];
}

export interface PaymentMetrics {
    totalPaid: number;
    paidLast30: number;
    paidPrev30: number;
    /** null when there's nothing to compare against */
    deltaPct: number | null;
    success: number;
    pending: number;
    failed: number;
    /** Share of settled payments (success + failed) that succeeded; null when none settled */
    successRate: number | null;
}

export interface MonthBucket { key: string; label: string; paid: number; count: number; isCurrent: boolean }

export interface AttentionItem {
    id: string;
    tone: "danger" | "warning" | "info";
    title: string;
    description: string;
    href: string;
}

export interface PartnershipMetrics {
    validTo: string | null;
    daysLeft: number | null;
    managedBusinesses: number;
    activeManagedKeys: number;
    lifetimeManagedKeys: number;
}

export interface OverviewMetrics {
    firstName: string | null;
    businesses: BusinessMetrics | null;
    keys: KeyMetrics | null;
    payments: PaymentMetrics | null;
    months: MonthBucket[];
    sixMonthTotal: number;
    attention: AttentionItem[];
    attentionCount: number;
    recentTransactions: Transaction[];
    recentBusinesses: Business[];
    partnership: PartnershipMetrics | null;
}

/* ───────────────────────── computations ───────────────────────── */

function computeBusinesses(list: Business[]): BusinessMetrics {
    const owned = list.filter((b) => b.my_business).length;
    return { total: list.length, owned, managed: list.length - owned };
}

function computeKeys(list: AccessKey[], now: number): KeyMetrics {
    const m: KeyMetrics = {
        total: list.length,
        byStatus: { active: 0, pending: 0, inactive: 0, expired: 0 },
        lifetime: 0,
        trial: 0,
        activeTrials: 0,
        expiring: [],
    };

    for (const key of list) {
        if (key.key_type === "LIFETIME") m.lifetime++;
        else m.trial++;

        const status = getKeyStatus(key);
        if (status === "none") continue;
        m.byStatus[status]++;

        if (status === "active" && key.key_type === "TRIAL") {
            m.activeTrials++;
            if (key.expires_at) {
                const msLeft = new Date(key.expires_at).getTime() - now;
                if (msLeft >= 0 && msLeft <= EXPIRING_WINDOW_DAYS * DAY_MS) {
                    m.expiring.push({
                        id: key.id,
                        businessName: key.business?.name ?? null,
                        daysLeft: Math.max(1, Math.ceil(msLeft / DAY_MS)),
                    });
                }
            }
        }
    }

    m.expiring.sort((a, b) => a.daysLeft - b.daysLeft);
    return m;
}

function computePayments(list: Transaction[], now: number): PaymentMetrics {
    const m: PaymentMetrics = {
        totalPaid: 0, paidLast30: 0, paidPrev30: 0, deltaPct: null,
        success: 0, pending: 0, failed: 0, successRate: null,
    };

    for (const t of list) {
        const amount = Number(t.amount) || 0;
        const ts = new Date(t.created_on).getTime();

        if (t.status === "Success") {
            m.success++;
            m.totalPaid += amount;
            if (ts >= now - 30 * DAY_MS) m.paidLast30 += amount;
            else if (ts >= now - 60 * DAY_MS) m.paidPrev30 += amount;
        } else if (t.status === "Pending") m.pending++;
        else if (t.status === "Failed") m.failed++;
    }

    if (m.paidPrev30 > 0) m.deltaPct = ((m.paidLast30 - m.paidPrev30) / m.paidPrev30) * 100;
    const settled = m.success + m.failed;
    if (settled > 0) m.successRate = (m.success / settled) * 100;
    return m;
}

/** Successful volume for the last N calendar months (UTC), oldest first. */
function computeMonths(list: Transaction[], now: number): MonthBucket[] {
    const ref = new Date(now);
    const buckets: MonthBucket[] = [];
    const index = new Map<string, MonthBucket>();

    for (let i = CHART_MONTHS - 1; i >= 0; i--) {
        const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - i, 1));
        const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
        const bucket: MonthBucket = { key, label: monthLabel(d.getUTCMonth()), paid: 0, count: 0, isCurrent: i === 0 };
        buckets.push(bucket);
        index.set(key, bucket);
    }

    for (const t of list) {
        if (t.status !== "Success") continue;
        const d = new Date(t.created_on);
        const bucket = index.get(`${d.getUTCFullYear()}-${d.getUTCMonth()}`);
        if (!bucket) continue;
        bucket.paid += Number(t.amount) || 0;
        bucket.count++;
    }
    return buckets;
}

function buildAttention(keys: KeyMetrics | null, payments: PaymentMetrics | null): { items: AttentionItem[]; count: number } {
    const items: AttentionItem[] = [];
    let count = 0;

    if (payments && payments.failed > 0) {
        count += payments.failed;
        items.push({
            id: "failed-payments", tone: "danger",
            title: `${payments.failed} failed ${plural(payments.failed, "payment", "payments")}`,
            description: "Review the error and retry from Transactions.",
            href: HREF.transactions,
        });
    }

    if (keys && keys.byStatus.expired > 0) {
        count += keys.byStatus.expired;
        items.push({
            id: "expired-keys", tone: "danger",
            title: `${keys.byStatus.expired} expired ${plural(keys.byStatus.expired, "key", "keys")}`,
            description: "These businesses have lost access. Upgrade or replace the key.",
            href: HREF.keys,
        });
    }

    if (keys) {
        count += keys.expiring.length;
        for (const k of keys.expiring.slice(0, 3)) {
            items.push({
                id: `expiring-${k.id}`, tone: "warning",
                title: `${k.businessName ?? "A business"} trial ends ${k.daysLeft <= 1 ? "within a day" : `in ${k.daysLeft} days`}`,
                description: "Upgrade to Lifetime to keep access.",
                href: HREF.businesses,
            });
        }
    }

    if (payments && payments.pending > 0) {
        count += payments.pending;
        items.push({
            id: "pending-payments", tone: "warning",
            title: `${payments.pending} ${plural(payments.pending, "payment", "payments")} awaiting confirmation`,
            description: "We're waiting on the payment gateway.",
            href: HREF.transactions,
        });
    }

    if (keys && keys.byStatus.pending > 0) {
        count += keys.byStatus.pending;
        items.push({
            id: "pending-keys", tone: "warning",
            title: `${keys.byStatus.pending} ${plural(keys.byStatus.pending, "key", "keys")} awaiting payment`,
            description: "Complete payment to activate them.",
            href: HREF.keys,
        });
    }

    if (keys && keys.activeTrials > 0 && keys.expiring.length === 0) {
        items.push({
            id: "upgrade-trials", tone: "info",
            title: `Upgrade ${keys.activeTrials} trial ${plural(keys.activeTrials, "key", "keys")}`,
            description: "Lifetime keys never expire.",
            href: HREF.businesses,
        });
    }

    return { items: items.slice(0, 6), count };
}

function computePartnership(businesses: Business[], now: number): PartnershipMetrics {
    // For a partner, businesses they don't own are the ones managed through their partnership,
    // and each carries the partnership record on its access key.
    const managed = businesses.filter((b) => !b.my_business);
    const validTo = managed.find((b) => b.channel_partner?.valid_to)?.channel_partner?.valid_to ?? null;

    return {
        validTo,
        daysLeft: validTo ? Math.max(0, Math.ceil((new Date(validTo).getTime() - now) / DAY_MS)) : null,
        managedBusinesses: managed.length,
        activeManagedKeys: managed.filter((b) => b.access_key && getKeyStatus(b.access_key) === "active").length,
        lifetimeManagedKeys: managed.filter((b) => b.access_key?.key_type === "LIFETIME").length,
    };
}

/* ───────────────────────── entry point ───────────────────────── */

export function computeOverview(data: OverviewData, now: number): OverviewMetrics {
    const keys = data.keys ? computeKeys(data.keys, now) : null;
    const payments = data.transactions ? computePayments(data.transactions, now) : null;
    const months = data.transactions ? computeMonths(data.transactions, now) : computeMonths([], now);
    const attention = buildAttention(keys, payments);

    const byNewest = <T extends { created_on: string }>(list: T[]) =>
        [...list].sort((a, b) => (b.created_on ?? "").localeCompare(a.created_on ?? ""));

    const ownerProfileName = data.businesses?.find((b) => b.my_business && b.manager_profile?.full_name)
        ?.manager_profile?.full_name;

    return {
        firstName: ownerProfileName ? ownerProfileName.trim().split(/\s+/)[0] : null,
        businesses: data.businesses ? computeBusinesses(data.businesses) : null,
        keys,
        payments,
        months,
        sixMonthTotal: months.reduce((sum, m) => sum + m.paid, 0),
        attention: attention.items,
        attentionCount: attention.count,
        recentTransactions: data.transactions ? byNewest(data.transactions).slice(0, 5) : [],
        recentBusinesses: data.businesses ? byNewest(data.businesses).slice(0, 4) : [],
        partnership: data.isPartner && data.businesses ? computePartnership(data.businesses, now) : null,
    };
}