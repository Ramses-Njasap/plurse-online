"use client";

import { useState, useEffect } from "react";
import {
    formatDate, maskKeyCode, formatAmount,
} from "@/app/(dashboard)/dashboard/my/businesses/data/mockBusinessData";
import type { Business } from "@/types/users.types";

interface ViewBusinessModalProps {
    business: Business;
    onClose: () => void;
    onEdit: (b: Business) => void;
}

type Section = "business" | "manager" | "partner";

export function ViewBusinessModal({ business, onClose, onEdit }: ViewBusinessModalProps) {
    const [open, setOpen] = useState<Set<Section>>(new Set(["business"]));

    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    function toggle(s: Section) {
        setOpen((prev) => {
            const next = new Set(prev);
            next.has(s) ? next.delete(s) : next.add(s);
            return next;
        });
    }

    const b = business;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50"
                style={{ background: "rgba(0,0,0,0.45)" }}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-32px)] max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl shadow-2xl"
                style={{ background: "var(--surface)" }}
            >
                {/* Header */}
                <div
                    className="flex shrink-0 items-start justify-between border-b px-6 py-5"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div className="flex items-center gap-3">
                        {/* Business avatar */}
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[14px] font-bold text-white"
                            style={{ background: "var(--brand)" }}
                        >
                            {b.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                                {b.name}
                            </h3>
                            <p className="font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>{b.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <button
                            type="button"
                            onClick={() => onEdit(b)}
                            className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[12px] font-medium transition-all"
                            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                        >
                            <EditIcon /> Edit
                        </button> */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                            style={{ color: "var(--text-subtle)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            aria-label="Close"
                        >
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Scrollable accordion body */}
                <div className="flex-1 space-y-2 overflow-y-auto px-6 py-4">

                    {/* ── Section 1: Business ── */}
                    <Accordion
                        label="Business"
                        icon={<BuildingIcon />}
                        isOpen={open.has("business")}
                        onToggle={() => toggle("business")}
                    >
                        {/* Core info */}
                        <SubSection label="Details">
                            <Row label="Name" value={b.name} />
                            <Row label="Location" value={`${b.region_city}, ${b.country}`} />
                            <Row label="Owner ID" value={<Mono>{b.owner_id}</Mono>} />
                            <Row label="Created" value={formatDate(b.created_on)} />
                            <Row label="Updated" value={formatDate(b.updated_on)} />
                        </SubSection>

                        {/* Access key */}
                        <SubSection label="Access key">
                            {b.access_key ? (
                                <>
                                    <Row label="Key code" value={<Mono>{maskKeyCode(b.access_key.key_code)}</Mono>} />
                                    <Row label="Type" value={<TypeBadge type={b.access_key.key_type} />} />
                                    <Row label="Status" value={<ActiveBadge active={b.access_key.is_active} />} />
                                    <Row label="Amount" value={formatAmount(b.access_key.amount)} />
                                    <Row label="Trial fee" value={b.access_key.key_type === "TRIAL" ? (b.access_key.deduct_trial_fee ? "Yes" : "No") : "—"} />
                                    <Row label="Expires" value={b.access_key.expires_at ? formatDate(b.access_key.expires_at) : "Never"} />
                                    <Row label="Activated" value={b.access_key.activated_at ? formatDate(b.access_key.activated_at) : "Not yet"} />
                                    <Row
                                        label="Created"
                                        value={formatDate(b.access_key.created_on || (b.access_key as any).created_at)}
                                    />
                                </>
                            ) : (
                                <Empty>No access key linked to this business.</Empty>
                            )}
                        </SubSection>
                    </Accordion>

                    {/* ── Section 2: Manager ── */}
                    <Accordion
                        label="Manager"
                        icon={<PersonIcon />}
                        isOpen={open.has("manager")}
                        onToggle={() => toggle("manager")}
                        badge={b.manager_profile ? b.manager_profile.full_name : "..."}
                    >
                        {/* User account */}
                        <SubSection label="Account">
                            <Row label="User ID" value={<Mono>{b.manager_user ? b.manager_user.id : "..."}</Mono>} />
                            <Row label="Email" value={b.manager_user ? b.manager_user.email : "..."} />
                            <Row label="Phone" value={b.manager_user ? b.manager_user.phone : "..."} />
                            <Row label="Account active" value={<BoolBadge val={b.manager_user?.is_active ?? false} />} />
                            <Row label="Email verified" value={<BoolBadge val={b.manager_user?.email_verified ?? false} />} />
                            <Row label="Phone verified" value={<BoolBadge val={b.manager_user?.phone_verified ?? false} />} />
                            <Row label="Is company" value={<BoolBadge val={b.manager_user?.is_business ?? false} />} />
                            <Row label="Is individual" value={<BoolBadge val={b.manager_user?.is_individual ?? false} />} />
                            <Row label="Banned" value={<BoolBadge val={b.manager_user?.is_banned ?? false} negative />} />
                            <Row label="Deleted" value={<BoolBadge val={b.manager_user?.is_deleted ?? false} negative />} />
                            <Row label="Joined" value={b.manager_user ? formatDate(b.manager_user.created_on) : "..."} />
                        </SubSection>

                        {/* User profile */}
                        <SubSection label="Profile">
                            <Row label="Profile ID" value={<Mono>{b.manager_profile?.id ?? "..."}</Mono>} />
                            <Row label="Full name" value={b?.manager_profile?.full_name ?? "..."} />
                            <Row label="Date of birth" value={formatDate(b.manager_profile?.date_of_birth ?? "")} />
                            <Row label="Country" value={b.manager_profile?.country ?? "..."} />
                            <Row label="Region / City" value={b.manager_profile?.region_city ?? "..."} />
                            <Row label="Channel partner" value={<BoolBadge val={b.manager_profile?.is_channel_partner ?? false} />} />
                            <Row label="Profile created" value={formatDate(b.manager_profile?.created_on ?? "")} />
                        </SubSection>
                    </Accordion>

                    {/* ── Section 3: Channel partner ── */}
                    <Accordion
                        label="Channel partner"
                        icon={<LinkIcon />}
                        isOpen={open.has("partner")}
                        onToggle={() => toggle("partner")}
                        badge={b.channel_partner?.profile?.full_name}
                        empty={!b.channel_partner}
                        emptyLabel="No channel partner assigned"
                    >
                        {b.channel_partner && (
                            <>
                                {/* Partnership */}
                                <SubSection label="Partnership">
                                    <Row label="Partner ID" value={<Mono>{b.channel_partner.id}</Mono>} />
                                    <Row
                                        label="Valid from"
                                        value={formatDate(b.channel_partner.valid_from || (b.channel_partner as any).created_at || (b.channel_partner as any).created_on)}
                                    />
                                    <Row label="Valid to" value={b.channel_partner.valid_to ? formatDate(b.channel_partner.valid_to) : "No expiry"} />
                                    <Row label="Amount" value={formatAmount(b.channel_partner.amount)} />
                                    <Row label="Key ID" value={b.channel_partner.access_key_id ? <Mono>{b.channel_partner.access_key_id}</Mono> : "—"} />
                                </SubSection>

                                {/* Partner's account */}
                                <SubSection label="Partner account">
                                    <Row label="User ID" value={<Mono>{b.channel_partner.user.id}</Mono>} />
                                    <Row label="Email" value={b.channel_partner.user.email} />
                                    <Row label="Phone" value={b.channel_partner.user.phone} />
                                    <Row label="Active" value={<BoolBadge val={b.channel_partner.user.is_active} />} />
                                    <Row label="Email verified" value={<BoolBadge val={b.channel_partner.user.email_verified} />} />
                                    <Row label="Joined" value={formatDate(b.channel_partner.user.created_on)} />
                                </SubSection>

                                {/* Partner's profile */}
                                <SubSection label="Partner profile">
                                    <Row label="Full name" value={b.channel_partner.profile.full_name} />
                                    <Row label="Date of birth" value={formatDate(b.channel_partner.profile.date_of_birth)} />
                                    <Row label="Country" value={b.channel_partner.profile.country} />
                                    <Row label="Region / City" value={b.channel_partner.profile.region_city} />
                                </SubSection>
                            </>
                        )}
                    </Accordion>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Accordion primitives
   ───────────────────────────────────────────────────────────────── */

function Accordion({
    label, icon, isOpen, onToggle, badge, empty = false, emptyLabel, children,
}: {
    label: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    badge?: string;
    empty?: boolean;
    emptyLabel?: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            className="overflow-hidden rounded-xl border transition-all"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            {/* Header row */}
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors"
                style={{ background: isOpen ? "var(--surface-muted)" : "transparent" }}
                onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "var(--surface-muted)"; }}
                onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
            >
                <div className="flex items-center gap-2.5">
                    <span style={{ color: "var(--brand)" }}>{icon}</span>
                    <span className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                        {label}
                    </span>
                    {badge && (
                        <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                        >
                            {badge}
                        </span>
                    )}
                    {empty && (
                        <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={{ background: "var(--surface-muted)", color: "var(--text-subtle)" }}
                        >
                            {emptyLabel ?? "None"}
                        </span>
                    )}
                </div>
                <ChevronIcon open={isOpen} />
            </button>

            {/* Collapsible content */}
            {isOpen && (
                <div
                    className="border-t px-4 py-4 space-y-4"
                    style={{ borderColor: "var(--border)" }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p
                className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "var(--text-subtle)" }}
            >
                {label}
            </p>
            <div
                className="space-y-1.5 rounded-xl p-3"
                style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
                {children}
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-0.5">
            <span className="text-[12px] shrink-0" style={{ color: "var(--text-subtle)" }}>{label}</span>
            <span className="text-right text-[12px] font-medium" style={{ color: "var(--foreground)" }}>{value}</span>
        </div>
    );
}

function Mono({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-[11px]">{children}</span>;
}

function Empty({ children }: { children: React.ReactNode }) {
    return <p className="text-[12px] py-1" style={{ color: "var(--text-subtle)" }}>{children}</p>;
}

/* ── Badge components ── */
function TypeBadge({ type }: { type: "TRIAL" | "LIFETIME" }) {
    return (
        <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={type === "LIFETIME"
                ? { background: "rgba(59,130,246,0.10)", color: "#3b82f6" }
                : { background: "rgba(245,158,11,0.10)", color: "#d97706" }}
        >
            {type === "LIFETIME" ? "Lifetime" : "Trial"}
        </span>
    );
}

function ActiveBadge({ active }: { active: boolean }) {
    return (
        <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={active
                ? { background: "rgba(34,197,94,0.10)", color: "#16a34a" }
                : { background: "rgba(100,116,139,0.12)", color: "#64748b" }}
        >
            {active ? "Active" : "Inactive"}
        </span>
    );
}

function BoolBadge({ val, negative = false }: { val: boolean; negative?: boolean }) {
    const good = negative ? !val : val;
    return (
        <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={good
                ? { background: "rgba(34,197,94,0.10)", color: "#16a34a" }
                : { background: "rgba(239,68,68,0.10)", color: "#dc2626" }}
        >
            {val ? "Yes" : "No"}
        </span>
    );
}

/* ── Icons ── */
function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
                color: "var(--text-subtle)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
            }}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
function BuildingIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></svg>;
}
function PersonIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function LinkIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}
function EditIcon() {
    return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>;
}
function XIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}