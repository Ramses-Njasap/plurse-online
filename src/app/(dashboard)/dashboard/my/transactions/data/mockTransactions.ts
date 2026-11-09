// app/(dashboard)/dashboard/my/transactions/data/mockTransactions.ts

import type {
    Transaction,
    PaymentStatus,
    PaymentTargetEntity,
} from "@/types/users.types";

/* ─────────────────────────────────────────────────────────────
   Formatting helpers (UTC-stable → no hydration mismatches)
   ───────────────────────────────────────────────────────────── */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

export function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function formatDateTime(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return `${formatDate(iso)}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

export function formatAmount(n: number): string {
    return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")} FCFA`;
}

export function shortId(id: string): string {
    return id.slice(0, 8);
}

export const TARGET_LABELS: Record<PaymentTargetEntity, string> = {
    access_keys: "Access key",
    businesses: "Business",
    channel_partners: "Channel partner",
};

/** Human-readable line for a transaction (falls back to the target entity label). */
export function describeTransaction(t: Transaction): string {
    const purpose = t.payload?.purpose;
    return typeof purpose === "string" ? purpose : TARGET_LABELS[t.target_entity];
}

/* ─────────────────────────────────────────────────────────────
   Deterministic mock data
   ───────────────────────────────────────────────────────────── */

function fakeUuid(n: number): string {
    const h = ((n * 2654435761) >>> 0).toString(16).padStart(8, "0");
    return `${h}-0000-4000-8000-${n.toString(16).padStart(12, "0")}`;
}

const MOCK_USER_ID = fakeUuid(9001);

const MOCK_BUSINESSES = [
    "uuhuihiu", "uhiuh", "ouhih", "Man know man", "iuhuhuhu",
    "frgewe", "gzgguzgzug", "None thr busei", "IUHuihiu",
].map((name, i) => ({ id: fakeUuid(500 + i), name }));

interface Template {
    target: PaymentTargetEntity;
    amount: number;
    purpose: string;
    extra?: Record<string, unknown>;
    withKey?: boolean;
    noBusiness?: boolean;
}

const TEMPLATES: Template[] = [
    { target: "access_keys", amount: 500, purpose: "Trial key purchase", withKey: true, extra: { key_type: "TRIAL" } },
    { target: "access_keys", amount: 15000, purpose: "Lifetime key purchase", withKey: true, extra: { key_type: "LIFETIME" } },
    { target: "access_keys", amount: 14500, purpose: "Trial → Lifetime upgrade", withKey: true, extra: { key_type: "LIFETIME", upgraded_from: "TRIAL" } },
    { target: "businesses", amount: 5000, purpose: "Business registration" },
    { target: "channel_partners", amount: 4000, purpose: "Channel partner activation", noBusiness: true, extra: { period_days: 90 } },
    { target: "access_keys", amount: 150000, purpose: "Lifetime key purchase", withKey: true, extra: { key_type: "LIFETIME" } },
];

const STATUS_CYCLE: PaymentStatus[] = ["Success", "Success", "Pending", "Success", "Failed", "Success", "Pending"];

const ERRORS = [
    "Payment declined by the mobile money operator.",
    "Gateway timeout while confirming the payment.",
    "Insufficient funds on the paying account.",
    "Payment was cancelled before confirmation.",
];

const BASE_TIME = Date.UTC(2026, 9, 26, 14, 30);
const STEP_MS = 7.3 * 60 * 60 * 1000;

function buildTransaction(i: number): Transaction {
    const tpl = TEMPLATES[i % TEMPLATES.length];
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
    const biz = tpl.noBusiness ? null : MOCK_BUSINESSES[(i * 4 + 1) % MOCK_BUSINESSES.length];

    const retry_count = status === "Failed" ? (i % 3) + 1 : status === "Success" && i % 11 === 0 ? 1 : 0;
    const created = BASE_TIME - i * STEP_MS;
    const updated = status === "Pending" ? created : created + 90_000 * (retry_count + 1);

    const ref = (i * 7919 + 1234).toString(36).toUpperCase().padEnd(4, "0").slice(0, 4);

    return {
        id: fakeUuid(0x1000 + i),
        user_id: MOCK_USER_ID,
        business_id: biz?.id ?? null,
        amount: tpl.amount,
        status,
        target_entity: tpl.target,
        payload: {
            purpose: tpl.purpose,
            ...(tpl.withKey ? { key_code: `PLURSE-${ref}••••••••${ref.split("").reverse().join("")}` } : {}),
            ...tpl.extra,
            gateway: "mock_gateway",
            client_tx_id: `ctx_${(i + 1).toString().padStart(5, "0")}`,
            ...(status === "Success" ? { gateway_tx_id: `gw_${ref}${i}` } : {}),
        },
        error_message: status === "Failed" ? ERRORS[i % ERRORS.length] : null,
        retry_count,
        created_on: new Date(created).toISOString(),
        updated_on: new Date(updated).toISOString(),
        business: biz,
    };
}

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 36 }, (_, i) => buildTransaction(i));

/**
 * Stand-in for a server action (e.g. fetchAuthenticatedTransactions in app/actions/transactions).
 * Swap the body for the real call — the client only depends on the returned Transaction[].
 */
export async function fetchMockTransactions(): Promise<Transaction[]> {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_TRANSACTIONS;
}