// src/components/dashboard/my/settings/businesses/businessUtils.ts

import type { Business, AccessKey } from "@/types/users.types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** UTC-stable so server and client render the same text. */
export function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function formatAmount(n: number): string {
    return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")} FCFA`;
}

export function maskKeyCode(code: string): string {
    return code.length > 12 ? `${code.slice(0, 11)}••••••••${code.slice(-4)}` : code;
}

export function getInitials(name: string): string {
    return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export type BusinessRole = "owner" | "partner";
export const getRole = (b: Business): BusinessRole => (b.my_business ? "owner" : "partner");

export type KeyStatus = "none" | "pending" | "active" | "inactive" | "expired";

export function getKeyStatus(key: AccessKey | null): KeyStatus {
    if (!key) return "none";
    if (key.is_payment_completed === false) return "pending";
    if (key.is_expired) return "expired";
    if (key.expires_at && new Date(key.expires_at).getTime() < Date.now()) return "expired";
    if (!key.is_active) return "inactive";
    return "active";
}

/** One-line expiry summary shown on cards. */
export function describeKeyExpiry(key: AccessKey): string {
    if (key.key_type === "LIFETIME") return "Never expires";
    if (key.expires_at) return `Expires ${formatDate(key.expires_at)}`;
    return "Not activated yet";
}

/* ── Editing ── */

/** Only these fields can be changed from the UI. Everything else is system-managed. */
export interface BusinessEditablePatch {
    name: string;
    country: string;
    region_city: string;
}

export interface UpdateBusinessResult {
    success: boolean;
    message?: string;
    /** Values as persisted by the server (trimmed/normalised). */
    saved?: BusinessEditablePatch;
    /** Fresh timestamp from the database trigger. */
    updated_on?: string;
}

export type UpdateBusinessFn = (id: string, patch: BusinessEditablePatch) => Promise<UpdateBusinessResult>;