// src/components/dashboard/my/settings/businesses/BusinessDetailPanel.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Business } from "@/types/users.types";
import {
    formatDate, formatAmount, maskKeyCode, getInitials, getKeyStatus, getRole,
    type BusinessEditablePatch, type UpdateBusinessResult,
} from "./businessUtils";
import { RoleBadge, KeyTypeBadge, KeyStatusBadge } from "./BusinessBadges";
import { BusinessEditForm } from "./BusinessEditForm";
import { Section, Row, Mono, Note } from "./DetailPrimitives";
import { CloseIcon, PencilIcon, KeyIcon, UserIcon, LinkIcon, BuildingIcon, DatabaseIcon } from "./BusinessIcons";

interface BusinessDetailPanelProps {
    business: Business;
    onClose: () => void;
    onUpdate: (id: string, patch: BusinessEditablePatch) => Promise<UpdateBusinessResult>;
}

const ANIMATION_MS = 180;

export function BusinessDetailPanel({ business: b, onClose, onUpdate }: BusinessDetailPanelProps) {
    const [entered, setEntered] = useState(false);
    const [editing, setEditing] = useState(false);

    const canEdit = !!b.my_business;
    const key = b.access_key;
    const keyStatus = getKeyStatus(key);

    /* Slide in after mount */
    useEffect(() => {
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const requestClose = useCallback(() => {
        setEntered(false);
        window.setTimeout(onClose, ANIMATION_MS);
    }, [onClose]);

    /* Escape: leave edit mode first, then close */
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key !== "Escape") return;
            if (editing) setEditing(false);
            else requestClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [editing, requestClose]);

    async function handleSubmit(patch: BusinessEditablePatch): Promise<UpdateBusinessResult> {
        const result = await onUpdate(b.id, patch);
        if (result.success) setEditing(false);
        return result;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 transition-opacity"
                style={{ background: "rgba(0,0,0,0.45)", opacity: entered ? 1 : 0, transitionDuration: `${ANIMATION_MS}ms` }}
                onClick={requestClose}
            />

            {/* Panel */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={`${b.name} details`}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col border-l shadow-2xl transition-transform ease-out"
                style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    transform: entered ? "translateX(0)" : "translateX(100%)",
                    transitionDuration: `${ANIMATION_MS}ms`,
                }}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-3 border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-bold text-white"
                            style={{ background: "var(--brand)" }}
                        >
                            {getInitials(b.name)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>{b.name}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <RoleBadge role={getRole(b)} />
                                {b.business_code && (
                                    <span className="font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>{b.business_code}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={requestClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                        style={{ color: "var(--text-subtle)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        aria-label="Close"
                    >
                        <CloseIcon size={15} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                    {/* Business details — the only editable section */}
                    <Section
                        title="Business details"
                        icon={<BuildingIcon size={15} />}
                        action={
                            canEdit && !editing ? (
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className="flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-all"
                                    style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                                >
                                    <PencilIcon size={12} />
                                    Edit
                                </button>
                            ) : undefined
                        }
                    >
                        {editing ? (
                            <BusinessEditForm
                                initial={{ name: b.name, country: b.country, region_city: b.region_city }}
                                onSubmit={handleSubmit}
                                onCancel={() => setEditing(false)}
                            />
                        ) : (
                            <>
                                <Row label="Name" value={b.name} />
                                <Row label="Country" value={b.country} />
                                <Row label="Region / City" value={b.region_city} />
                                {!canEdit && (
                                    <Note>Only the owner can edit these details. You can view this business because you manage it as a channel partner.</Note>
                                )}
                            </>
                        )}
                    </Section>

                    {/* Access key — read only */}
                    <Section title="Access key" icon={<KeyIcon size={15} />}>
                        {key ? (
                            <>
                                <Row label="Key code" value={<Mono>{maskKeyCode(key.key_code)}</Mono>} />
                                <Row label="Type" value={<KeyTypeBadge type={key.key_type} />} />
                                <Row label="Status" value={<KeyStatusBadge status={keyStatus} />} />
                                <Row label="Amount" value={formatAmount(key.amount)} />
                                {key.key_type === "TRIAL" && (
                                    <Row label="Trial fee deducted" value={key.deduct_trial_fee ? "Yes" : "No"} />
                                )}
                                <Row label="Activated" value={key.activated_at ? formatDate(key.activated_at) : "Not yet"} />
                                <Row label="Expires" value={key.expires_at ? formatDate(key.expires_at) : "Never"} />
                                <Note>
                                    Keys are managed from{" "}
                                    <Link href="/dashboard/my/keys" className="font-medium underline-offset-2 hover:underline" style={{ color: "var(--brand)" }}>
                                        My Keys
                                    </Link>
                                    .
                                    {key.key_type === "TRIAL" && (
                                        <>
                                            {" "}Upgrade this trial to Lifetime from the{" "}
                                            <Link href="/dashboard/my/businesses" className="font-medium underline-offset-2 hover:underline" style={{ color: "var(--brand)" }}>
                                                Businesses
                                            </Link>{" "}
                                            page.
                                        </>
                                    )}
                                </Note>
                            </>
                        ) : (
                            <Note>No access key is linked to this business.</Note>
                        )}
                    </Section>

                    {/* Manager */}
                    <Section title="Manager" icon={<UserIcon size={15} />}>
                        {b.manager_profile || b.manager_user ? (
                            <>
                                <Row label="Full name" value={b.manager_profile?.full_name ?? "—"} />
                                <Row label="Email" value={b.manager_user?.email ?? "—"} />
                                <Row label="Phone" value={b.manager_user?.phone ?? "—"} />
                                <Row label="Location" value={b.manager_profile ? `${b.manager_profile.region_city}, ${b.manager_profile.country}` : "—"} />
                            </>
                        ) : (
                            <Note>Manager details aren't available for this business.</Note>
                        )}
                    </Section>

                    {/* Channel partner */}
                    <Section title="Channel partner" icon={<LinkIcon size={15} />}>
                        {b.channel_partner ? (
                            <>
                                <Row label="Partner" value={b.channel_partner.profile?.full_name ?? "—"} />
                                <Row label="Email" value={b.channel_partner.user?.email ?? "—"} />
                                <Row label="Valid from" value={formatDate(b.channel_partner.valid_from)} />
                                <Row label="Valid to" value={b.channel_partner.valid_to ? formatDate(b.channel_partner.valid_to) : "No expiry"} />
                                <Row label="Amount" value={formatAmount(b.channel_partner.amount)} />
                            </>
                        ) : (
                            <Note>No channel partner is assigned to this business.</Note>
                        )}
                    </Section>

                    {/* Record — system managed */}
                    <Section title="Record" icon={<DatabaseIcon size={15} />}>
                        <Row label="Business ID" value={<Mono>{b.id}</Mono>} locked />
                        <Row label="Business code" value={b.business_code ? <Mono>{b.business_code}</Mono> : "—"} locked />
                        <Row label="Owner ID" value={<Mono>{b.owner_id}</Mono>} locked />
                        <Row label="Created" value={formatDate(b.created_on)} locked />
                        <Row label="Last updated" value={formatDate(b.updated_on)} locked />
                        <Note>Fields with a lock are generated by the system and can't be changed.</Note>
                    </Section>
                </div>
            </aside>
        </>
    );
}