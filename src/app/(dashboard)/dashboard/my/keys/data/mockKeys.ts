/* ─────────────────────────────────────────────────────────────────
   Date helpers — all relative dates are computed from a FIXED
   anchor (2025-05-01) so they never change between SSR and client.
   ───────────────────────────────────────────────────────────────── */

import type { AccessKey, Business, KeyType, UserAccount, UserProfile } from "@/types/users.types";
import { MOCK_BUSINESSES } from "../../businesses/data/mockBusinessData";


const ANCHOR = new Date("2025-05-01T00:00:00.000Z");

function daysFrom(days: number): string {
    const d = new Date(ANCHOR);
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

function daysBack(days: number): string {
    return daysFrom(-days);
}

/* ── Expiry / status helpers ── */

export type ExpiryStatus = "active" | "expiring_soon" | "expired" | "never" | "inactive";

export function getExpiryStatus(key: AccessKey): ExpiryStatus {
    if (!key.is_active) return "inactive";
    if (key.key_type === "LIFETIME" || !key.expires_at) return "never";
    const now = new Date();
    const exp = new Date(key.expires_at);
    if (exp < now) return "expired";
    const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 14) return "expiring_soon";
    return "active";
}

export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        timeZone: "UTC", // consistent between server and client
    }).format(new Date(iso));
}

export function maskKeyCode(key: string): string {
    if (key.length <= 12) return key;
    return key.slice(0, 11) + "••••••••" + key.slice(-4);
}

export function formatAmount(amount: number): string {
    return new Intl.NumberFormat("fr-CM", {
        style: "currency",
        currency: "XAF",
        maximumFractionDigits: 0,
    }).format(amount);
}

/* ─────────────────────────────────────────────────────────────────
   Internal helpers for mock service functions
   ───────────────────────────────────────────────────────────────── */

function genId(): string {
    // Uses a fixed-seed style to avoid hydration issues — only called
    // inside async service functions (client-side only, never during SSR).
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

function genPassword(): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%&*";
    const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
    const parts = [
        pick(upper), pick(upper),
        pick(lower), pick(lower), pick(lower), pick(lower),
        pick(digits), pick(digits),
        pick(special),
    ];
    for (let i = parts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [parts[i], parts[j]] = [parts[j], parts[i]];
    }
    return parts.join("");
}

function delay(ms = 800): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

function nowIso(): string {
    return new Date().toISOString();
}

/* ── Static businesses ── */

type MockKeyType = "TRIAL" | "LIFETIME";

interface MockAccessKey {
    id: string;
    key_code: string;
    key_type: MockKeyType;
    is_active: boolean;
    activated_at: string | null;
    expires_at: string | null;
    amount: number;
    deduct_trial_fee: boolean;
    created_on: string;
    channel_partner_id?: string | null;
    business: null | Business;
}

/* ── 35 static mock keys — no Math.random() ── */
export const MOCK_KEYS: MockAccessKey[] = [
    { id: "k01", key_code: "PLURSE-A1B2C3D4-E5F6G7H8", key_type: "TRIAL", expires_at: daysFrom(90), created_on: daysBack(5), is_active: true, activated_at: daysBack(5), amount: 5000, deduct_trial_fee: true, business: MOCK_BUSINESSES[0] },
    { id: "k02", key_code: "PLURSE-B2C3D4E5-F6G7H8I9", key_type: "TRIAL", expires_at: daysFrom(7), created_on: daysBack(23), is_active: true, activated_at: daysBack(23), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k03", key_code: "PLURSE-C3D4E5F6-G7H8I9J0", key_type: "TRIAL", expires_at: daysBack(5), created_on: daysBack(40), is_active: false, activated_at: daysBack(40), amount: 5000, deduct_trial_fee: false, business: MOCK_BUSINESSES[1] },
    { id: "k04", key_code: "PLURSE-D4E5F6G7-H8I9J0K1", key_type: "TRIAL", expires_at: daysFrom(3), created_on: daysBack(27), is_active: true, activated_at: daysBack(27), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k05", key_code: "PLURSE-E5F6G7H8-I9J0K1L2", key_type: "TRIAL", expires_at: daysBack(10), created_on: daysBack(50), is_active: false, activated_at: daysBack(50), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k06", key_code: "PLURSE-F6G7H8I9-J0K1L2M3", key_type: "TRIAL", expires_at: daysFrom(30), created_on: daysBack(1), is_active: true, activated_at: daysBack(1), amount: 5000, deduct_trial_fee: false, business: MOCK_BUSINESSES[2] },
    { id: "k07", key_code: "PLURSE-G7H8I9J0-K1L2M3N4", key_type: "TRIAL", expires_at: daysFrom(14), created_on: daysBack(16), is_active: true, activated_at: daysBack(16), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k08", key_code: "PLURSE-H8I9J0K1-L2M3N4O5", key_type: "TRIAL", expires_at: daysBack(20), created_on: daysBack(65), is_active: false, activated_at: null, amount: 5000, deduct_trial_fee: false, business: null },
    { id: "k09", key_code: "PLURSE-I9J0K1L2-M3N4O5P6", key_type: "TRIAL", expires_at: daysFrom(60), created_on: daysBack(12), is_active: true, activated_at: daysBack(12), amount: 5000, deduct_trial_fee: true, business: MOCK_BUSINESSES[3] },
    { id: "k10", key_code: "PLURSE-J0K1L2M3-N4O5P6Q7", key_type: "TRIAL", expires_at: daysFrom(45), created_on: daysBack(9), is_active: true, activated_at: daysBack(9), amount: 5000, deduct_trial_fee: false, business: null },
    { id: "k11", key_code: "PLURSE-K1L2M3N4-O5P6Q7R8", key_type: "TRIAL", expires_at: daysBack(2), created_on: daysBack(32), is_active: false, activated_at: daysBack(32), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k12", key_code: "PLURSE-L2M3N4O5-P6Q7R8S9", key_type: "TRIAL", expires_at: daysFrom(10), created_on: daysBack(20), is_active: true, activated_at: daysBack(20), amount: 5000, deduct_trial_fee: true, business: MOCK_BUSINESSES[4] },
    { id: "k13", key_code: "PLURSE-M3N4O5P6-Q7R8S9T0", key_type: "LIFETIME", expires_at: null, created_on: daysBack(15), is_active: true, activated_at: daysBack(15), amount: 150000, deduct_trial_fee: false, business: null },
    { id: "k14", key_code: "PLURSE-N4O5P6Q7-R8S9T0U1", key_type: "LIFETIME", expires_at: null, created_on: daysBack(30), is_active: true, activated_at: daysBack(30), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[0] },
    { id: "k15", key_code: "PLURSE-O5P6Q7R8-S9T0U1V2", key_type: "LIFETIME", expires_at: null, created_on: daysBack(70), is_active: false, activated_at: null, amount: 150000, deduct_trial_fee: false, business: null },
    { id: "k16", key_code: "PLURSE-P6Q7R8S9-T0U1V2W3", key_type: "LIFETIME", expires_at: null, created_on: daysBack(4), is_active: true, activated_at: daysBack(4), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[1] },
    { id: "k17", key_code: "PLURSE-Q7R8S9T0-U1V2W3X4", key_type: "LIFETIME", expires_at: null, created_on: daysBack(90), is_active: true, activated_at: daysBack(90), amount: 150000, deduct_trial_fee: false, business: null },
    { id: "k18", key_code: "PLURSE-R8S9T0U1-V2W3X4Y5", key_type: "LIFETIME", expires_at: null, created_on: daysBack(6), is_active: true, activated_at: daysBack(6), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[2] },
    { id: "k19", key_code: "PLURSE-S9T0U1V2-W3X4Y5Z6", key_type: "LIFETIME", expires_at: null, created_on: daysBack(110), is_active: false, activated_at: null, amount: 150000, deduct_trial_fee: false, business: null },
    { id: "k20", key_code: "PLURSE-T0U1V2W3-X4Y5Z6A7", key_type: "LIFETIME", expires_at: null, created_on: daysBack(8), is_active: true, activated_at: daysBack(8), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[3] },
    { id: "k21", key_code: "PLURSE-U1V2W3X4-Y5Z6A7B8", key_type: "TRIAL", expires_at: daysFrom(20), created_on: daysBack(10), is_active: true, activated_at: daysBack(10), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k22", key_code: "PLURSE-V2W3X4Y5-Z6A7B8C9", key_type: "TRIAL", expires_at: daysBack(30), created_on: daysBack(75), is_active: false, activated_at: daysBack(75), amount: 5000, deduct_trial_fee: true, business: MOCK_BUSINESSES[4] },
    { id: "k23", key_code: "PLURSE-W3X4Y5Z6-A7B8C9D0", key_type: "TRIAL", expires_at: daysFrom(5), created_on: daysBack(25), is_active: true, activated_at: daysBack(25), amount: 5000, deduct_trial_fee: false, business: null },
    { id: "k24", key_code: "PLURSE-X4Y5Z6A7-B8C9D0E1", key_type: "TRIAL", expires_at: daysFrom(75), created_on: daysBack(3), is_active: true, activated_at: daysBack(3), amount: 5000, deduct_trial_fee: true, business: MOCK_BUSINESSES[0] },
    { id: "k25", key_code: "PLURSE-Y5Z6A7B8-C9D0E1F2", key_type: "TRIAL", expires_at: daysBack(15), created_on: daysBack(55), is_active: false, activated_at: null, amount: 5000, deduct_trial_fee: false, business: null },
    { id: "k26", key_code: "PLURSE-Z6A7B8C9-D0E1F2G3", key_type: "LIFETIME", expires_at: null, created_on: daysBack(18), is_active: true, activated_at: daysBack(18), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[1] },
    { id: "k27", key_code: "PLURSE-A7B8C9D0-E1F2G3H4", key_type: "LIFETIME", expires_at: null, created_on: daysBack(100), is_active: true, activated_at: daysBack(100), amount: 150000, deduct_trial_fee: false, business: null },
    { id: "k28", key_code: "PLURSE-B8C9D0E1-F2G3H4I5", key_type: "LIFETIME", expires_at: null, created_on: daysBack(21), is_active: false, activated_at: null, amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[2] },
    { id: "k29", key_code: "PLURSE-C9D0E1F2-G3H4I5J6", key_type: "LIFETIME", expires_at: null, created_on: daysBack(7), is_active: true, activated_at: daysBack(7), amount: 150000, deduct_trial_fee: false, business: null },
    { id: "k30", key_code: "PLURSE-D0E1F2G3-H4I5J6K7", key_type: "LIFETIME", expires_at: null, created_on: daysBack(35), is_active: true, activated_at: daysBack(35), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[3] },
    { id: "k31", key_code: "PLURSE-E1F2G3H4-I5J6K7L8", key_type: "TRIAL", expires_at: daysFrom(50), created_on: daysBack(14), is_active: true, activated_at: daysBack(14), amount: 5000, deduct_trial_fee: true, business: MOCK_BUSINESSES[4] },
    { id: "k32", key_code: "PLURSE-F2G3H4I5-J6K7L8M9", key_type: "TRIAL", expires_at: daysBack(7), created_on: daysBack(42), is_active: false, activated_at: daysBack(42), amount: 5000, deduct_trial_fee: false, business: null },
    { id: "k33", key_code: "PLURSE-G3H4I5J6-K7L8M9N0", key_type: "LIFETIME", expires_at: null, created_on: daysBack(11), is_active: true, activated_at: daysBack(11), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[0] },
    { id: "k34", key_code: "PLURSE-H4I5J6K7-L8M9N0O1", key_type: "TRIAL", expires_at: daysFrom(120), created_on: daysBack(2), is_active: true, activated_at: daysBack(2), amount: 5000, deduct_trial_fee: true, business: null },
    { id: "k35", key_code: "PLURSE-I5J6K7L8-M9N0O1P2", key_type: "LIFETIME", expires_at: null, created_on: daysBack(28), is_active: true, activated_at: daysBack(28), amount: 150000, deduct_trial_fee: false, business: MOCK_BUSINESSES[1] },
];

/* ─────────────────────────────────────────────────────────────────
   Mock service functions
   All async — replace each body with a real fetch() when ready.
   genId() and Math.random() are safe here because these functions
   are only ever called client-side (inside event handlers / effects),
   never during SSR rendering.
   ───────────────────────────────────────────────────────────────── */

/** Generate a fresh key_code for preview before the key is saved. */
export function generateKeyCode(): string {
    const seg = () => Math.random().toString(36).slice(2, 10).toUpperCase();
    return `PLURSE-${seg()}-${seg()}`;
}

/**
 * Create a new access key.
 * TODO: POST /api/access-keys
 */
export async function mockCreateAccessKey(payload: {
    key_code: string;
    key_type: KeyType;
    amount: number;
    deduct_trial_fee: boolean;
}): Promise<AccessKey> {
    await delay(700);
    return {
        id: genId(),
        key_code: payload.key_code,
        key_type: payload.key_type,
        is_active: false,
        activated_at: null,
        expires_at: null,
        amount: payload.amount,
        deduct_trial_fee: payload.deduct_trial_fee,
        created_on: nowIso(),
        // business: null,
    };
}

/**
 * Search businesses by ID fragment or name.
 * TODO: GET /api/businesses?q=...
 */
export async function mockSearchBusinesses(query: string): Promise<Business[]> {
    await delay(400);
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_BUSINESSES.filter(
        (b) =>
            b.id.toLowerCase().includes(q) ||
            b.name.toLowerCase().includes(q)
    );
}

/**
 * Link an existing business to an access key.
 * TODO: PATCH /api/businesses/:id  { access_key_id }
 */
export async function mockLinkBusinessToKey(businessId: string, accessKeyId: string): Promise<void> {}

/**
 * Step 1 — Create a user account for the business manager.
 * Generates a secure password internally.
 * TODO: POST /api/auth/create-user
 */
export async function mockCreateUser(payload: {
    email: string;
    phone: string;
    my_business?: boolean; // true = this user is the authenticated user themselves
}): Promise<{ user: UserAccount; generatedPassword: string }> {
    await delay(800);
    const password = genPassword();
    const user: UserAccount = {
        id: genId(),
        email: payload.email,
        phone: payload.phone,
        is_active: true,
        is_business: false,
        my_business: payload.my_business || false,
        is_individual: true,
        email_verified: false,
        phone_verified: false,
        created_on: nowIso(),
        updated_on: nowIso(),
    };
    return { user, generatedPassword: password };
}

/**
 * Step 2 — Create the manager's user profile.
 * TODO: POST /api/user-profiles
 */
export async function mockCreateUserProfile(payload: {
    user_id: string;
    full_name: string;
    date_of_birth: string;
    country: string;
    region_city: string;
}): Promise<UserProfile> {
    await delay(700);
    const profile: UserProfile = {
        id: genId(),
        user_id: payload.user_id,
        full_name: payload.full_name,
        date_of_birth: payload.date_of_birth,
        country: payload.country,
        region_city: payload.region_city,
        is_channel_partner: false,
        created_on: nowIso(),
        updated_on: nowIso(),
    };
    return profile;
}

/**
 * Step 3 — Create the business and link it to the access key.
 * TODO: POST /api/businesses
 */
export async function mockCreateBusiness(payload: {
    owner_id: string;
    name: string;
    country: string;
    region_city: string;
    access_key_id: string;
}): Promise<Business> {
    await delay(900);
    const business: Business = {
        id: genId(),
        owner_id: payload.owner_id,
        name: payload.name,
        country: payload.country,
        region_city: payload.region_city,
        access_key_id: payload.access_key_id,
        access_key: null, // will be linked later
        channel_partner: null,
        created_on: nowIso(),
        updated_on: nowIso(),
    };
    return business;
}