/* ─────────────────────────────────────────────────────────────────
   mockBusinessData.ts
   Types and mock data that mirror the full schema relationships:
   businesses → users → user_profiles
              → access_keys
              → channel_partners → users → user_profiles
   ───────────────────────────────────────────────────────────────── */


import type { UserAccount, UserProfile, AccessKey, ChannelPartner, Business } from "@/types/users.types";


/* ── Fixed date anchor (no SSR mismatch) ── */
const ANCHOR = new Date("2025-05-01T00:00:00.000Z");
function daysBack(n: number): string {
    const d = new Date(ANCHOR);
    d.setDate(d.getDate() - n);
    return d.toISOString();
}
function daysFrom(n: number): string {
    const d = new Date(ANCHOR);
    d.setDate(d.getDate() + n);
    return d.toISOString();
}

// export function formatDate(iso: string): string {
//     return new Intl.DateTimeFormat("en-GB", {
//         day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
//     }).format(new Date(iso));
// }

/**
 * Safe, timezone-agnostic date formatter to prevent hydration mismatches
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  
  // Create a Date object safely
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
  // If invalid date string, fall back gracefully
  if (isNaN(date.getTime())) return "—";

  // Using UTC methods prevents local browser offsets from shifting the day
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

// export function maskKeyCode(key: string): string {
//     if (key.length <= 12) return key;
//     return key.slice(0, 11) + "••••••••" + key.slice(-4);
// }

/**
 * Masks intermediate key structures for secure visual displays
 */
export function maskKeyCode(code: string | null | undefined): string {
    if (!code) return "—";
    if (code.length <= 12) return code;
    return `${code.slice(0, 12)}••••••••${code.slice(-4)}`;
}

// export function formatAmount(n: number): string {
//     return new Intl.NumberFormat("fr-CM", {
//         style: "currency", currency: "XAF", maximumFractionDigits: 0,
//     }).format(n);
// }

/**
 * Highly defensive currency parser and formatter to prevent NaN FCFA
 */
export function formatAmount(amountInput: any): string {
    if (amountInput === null || amountInput === undefined || amountInput === "") {
        return "0 FCFA";
    }

    // Convert potential string input to numbers stably
    const parsed = typeof amountInput === "string" ? parseFloat(amountInput) : amountInput;

    if (isNaN(parsed)) {
        return "0 FCFA";
    }

    return `${parsed.toLocaleString()} FCFA`;
}

/* ── Types ── */

/* ── Mock user accounts ── */
const USERS: UserAccount[] = [
    { id: "u-001", email: "amara.nkosi@etosons.cm", phone: "+237677001001", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: true, phone_verified: true, created_on: daysBack(62), updated_on: daysBack(5) },
    { id: "u-002", email: "pierre.mballa@nkosi.cm", phone: "+237698002002", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: true, phone_verified: false, created_on: daysBack(91), updated_on: daysBack(10) },
    { id: "u-003", email: "grace.eto@mballatech.cm", phone: "+237655003003", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: true, phone_verified: true, created_on: daysBack(121), updated_on: daysBack(3) },
    { id: "u-004", email: "david.owusu@owusulog.gh", phone: "+233244004004", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: false, email_verified: false, phone_verified: false, created_on: daysBack(46), updated_on: daysBack(8) },
    { id: "u-005", email: "fatou.diallo@diallov.sn", phone: "+221776005005", is_deleted: false, is_banned: false, is_business: true, is_individual: false, is_active: true, email_verified: true, phone_verified: true, created_on: daysBack(31), updated_on: daysBack(1) },
    { id: "u-006", email: "tanko.ibrahim@tankofresh.ng", phone: "+234802006006", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: true, phone_verified: true, created_on: daysBack(26), updated_on: daysBack(11) },
    { id: "u-007", email: "amara.craft@studios.cm", phone: "+237677007007", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: false, phone_verified: false, created_on: daysBack(15), updated_on: daysBack(6) },
    // Channel partner user accounts
    { id: "u-cp1", email: "cp.agent1@plurse.cm", phone: "+237677901901", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: true, phone_verified: true, created_on: daysBack(180), updated_on: daysBack(20) },
    { id: "u-cp2", email: "cp.agent2@plurse.cm", phone: "+237698902902", is_deleted: false, is_banned: false, is_business: false, is_individual: true, is_active: true, email_verified: true, phone_verified: true, created_on: daysBack(150), updated_on: daysBack(15) },
];

/* ── Mock user profiles ── */
const PROFILES: UserProfile[] = [
    { id: "p-001", user_id: "u-001", full_name: "Amara Nkosi", date_of_birth: "1988-04-15", country: "Cameroon", region_city: "Yaoundé", is_channel_partner: false, created_on: daysBack(62), updated_on: daysBack(5) },
    { id: "p-002", user_id: "u-002", full_name: "Pierre Mballa", date_of_birth: "1992-11-03", country: "Cameroon", region_city: "Douala", is_channel_partner: false, created_on: daysBack(91), updated_on: daysBack(10) },
    { id: "p-003", user_id: "u-003", full_name: "Grace Eto", date_of_birth: "1990-07-22", country: "Cameroon", region_city: "Bafoussam", is_channel_partner: false, created_on: daysBack(121), updated_on: daysBack(3) },
    { id: "p-004", user_id: "u-004", full_name: "David Owusu", date_of_birth: "1985-02-10", country: "Ghana", region_city: "Accra", is_channel_partner: false, created_on: daysBack(46), updated_on: daysBack(8) },
    { id: "p-005", user_id: "u-005", full_name: "Fatou Diallo", date_of_birth: "1995-09-28", country: "Senegal", region_city: "Dakar", is_channel_partner: false, created_on: daysBack(31), updated_on: daysBack(1) },
    { id: "p-006", user_id: "u-006", full_name: "Tanko Ibrahim", date_of_birth: "1991-06-17", country: "Nigeria", region_city: "Lagos", is_channel_partner: false, created_on: daysBack(26), updated_on: daysBack(11) },
    { id: "p-007", user_id: "u-007", full_name: "Amara Craft", date_of_birth: "1997-01-05", country: "Cameroon", region_city: "Yaoundé", is_channel_partner: false, created_on: daysBack(15), updated_on: daysBack(6) },
    { id: "p-cp1", user_id: "u-cp1", full_name: "Jean-Marc Fotso", date_of_birth: "1983-08-12", country: "Cameroon", region_city: "Douala", is_channel_partner: true, created_on: daysBack(180), updated_on: daysBack(20) },
    { id: "p-cp2", user_id: "u-cp2", full_name: "Sophie Nguema", date_of_birth: "1989-03-30", country: "Cameroon", region_city: "Yaoundé", is_channel_partner: true, created_on: daysBack(150), updated_on: daysBack(15) },
];

/* ── Mock access keys ── */
const ACCESS_KEYS: AccessKey[] = [
    { id: "k01", key_code: "PLR-A1B2C3D4-E5F6G7H8", key_type: "TRIAL", is_active: true, activated_at: daysBack(5), expires_at: daysFrom(90), amount: 5000, deduct_trial_fee: true, created_on: daysBack(5) },
    { id: "k03", key_code: "PLR-C3D4E5F6-G7H8I9J0", key_type: "TRIAL", is_active: false, activated_at: daysBack(40), expires_at: daysBack(5), amount: 5000, deduct_trial_fee: false, created_on: daysBack(40) },
    { id: "k06", key_code: "PLR-F6G7H8I9-J0K1L2M3", key_type: "TRIAL", is_active: true, activated_at: daysBack(1), expires_at: daysFrom(30), amount: 5000, deduct_trial_fee: false, created_on: daysBack(1) },
    { id: "k09", key_code: "PLR-I9J0K1L2-M3N4O5P6", key_type: "TRIAL", is_active: true, activated_at: daysBack(12), expires_at: daysFrom(60), amount: 5000, deduct_trial_fee: true, created_on: daysBack(12) },
    { id: "k12", key_code: "PLR-L2M3N4O5-P6Q7R8S9", key_type: "TRIAL", is_active: true, activated_at: daysBack(20), expires_at: daysFrom(10), amount: 5000, deduct_trial_fee: true, created_on: daysBack(20) },
    { id: "k14", key_code: "PLR-N4O5P6Q7-R8S9T0U1", key_type: "LIFETIME", is_active: true, activated_at: daysBack(30), expires_at: null, amount: 150000, deduct_trial_fee: false, created_on: daysBack(30) },
    { id: "k35", key_code: "PLR-I5J6K7L8-M9N0O1P2", key_type: "LIFETIME", is_active: true, activated_at: daysBack(28), expires_at: null, amount: 150000, deduct_trial_fee: false, created_on: daysBack(28) },
];

/* ── Mock channel partners ── */
const CHANNEL_PARTNERS: ChannelPartner[] = [
    {
        id: "cp-001", user_id: "u-cp1",
        valid_from: daysBack(90), valid_to: null,
        amount: 25000, access_key_id: "k14",
        user: USERS[7], profile: PROFILES[7],
    },
    {
        id: "cp-002", user_id: "u-cp2",
        valid_from: daysBack(60), valid_to: daysFrom(120),
        amount: 15000, access_key_id: "k35",
        user: USERS[8], profile: PROFILES[8],
    },
];

/* ── 7 mock businesses ── */
export const MOCK_BUSINESSES: Business[] = [
    {
        id: "BIZ-001A2B", owner_id: "u-001", name: "Eto & Sons Trading",
        country: "Cameroon", region_city: "Yaoundé",
        access_key_id: "k01", created_on: daysBack(62), updated_on: daysBack(5),
        manager_user: USERS[0], manager_profile: PROFILES[0],
        access_key: ACCESS_KEYS[0], channel_partner: CHANNEL_PARTNERS[0],
    },
    {
        id: "BIZ-002C3D", owner_id: "u-002", name: "Nkosi Agro Supplies",
        country: "Cameroon", region_city: "Douala",
        access_key_id: "k03", created_on: daysBack(91), updated_on: daysBack(10),
        manager_user: USERS[1], manager_profile: PROFILES[1],
        access_key: ACCESS_KEYS[1], channel_partner: null,
    },
    {
        id: "BIZ-003E4F", owner_id: "u-003", name: "Mballa Tech Solutions",
        country: "Cameroon", region_city: "Bafoussam",
        access_key_id: "k06", created_on: daysBack(121), updated_on: daysBack(3),
        manager_user: USERS[2], manager_profile: PROFILES[2],
        access_key: ACCESS_KEYS[2], channel_partner: CHANNEL_PARTNERS[1],
    },
    {
        id: "BIZ-004G5H", owner_id: "u-004", name: "Owusu Logistics Ltd",
        country: "Ghana", region_city: "Accra",
        access_key_id: "k09", created_on: daysBack(46), updated_on: daysBack(8),
        manager_user: USERS[3], manager_profile: PROFILES[3],
        access_key: ACCESS_KEYS[3], channel_partner: null,
    },
    {
        id: "BIZ-005I6J", owner_id: "u-005", name: "Diallo Ventures",
        country: "Senegal", region_city: "Dakar",
        access_key_id: "k12", created_on: daysBack(31), updated_on: daysBack(1),
        manager_user: USERS[4], manager_profile: PROFILES[4],
        access_key: ACCESS_KEYS[4], channel_partner: null,
    },
    {
        id: "BIZ-006K7L", owner_id: "u-006", name: "Tanko Fresh Foods",
        country: "Nigeria", region_city: "Lagos",
        access_key_id: "k14", created_on: daysBack(26), updated_on: daysBack(11),
        manager_user: USERS[5], manager_profile: PROFILES[5],
        access_key: ACCESS_KEYS[5], channel_partner: CHANNEL_PARTNERS[0],
    },
    {
        id: "BIZ-007M8N", owner_id: "u-007", name: "Amara Craft Studios",
        country: "Cameroon", region_city: "Yaoundé",
        access_key_id: null, created_on: daysBack(15), updated_on: daysBack(6),
        manager_user: USERS[6], manager_profile: PROFILES[6],
        access_key: null, channel_partner: null,
    },
];

/* ─────────────────────────────────────────────────────────────────
   Mock service functions — replace bodies with real fetch() calls
   ───────────────────────────────────────────────────────────────── */

function delay(ms = 700): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

/** GET /businesses — list with all joins */
export async function mockFetchBusinesses(): Promise<Business[]> {
    await delay(400);
    return [...MOCK_BUSINESSES];
}

/** GET /businesses/:id */
export async function mockFetchBusiness(id: string): Promise<Business | null> {
    await delay(300);
    return MOCK_BUSINESSES.find((b) => b.id === id) ?? null;
}

/** DELETE /businesses/:id */
export async function mockDeleteBusiness(id: string): Promise<void> {}

/** DELETE /businesses (bulk) */
export async function mockDeleteBusinesses(ids: string[]): Promise<void> {}

/** PATCH /businesses/:id */
export async function mockUpdateBusiness(
    id: string,
    payload: Partial<Pick<Business, "name" | "country" | "region_city">>
): Promise<void> {}