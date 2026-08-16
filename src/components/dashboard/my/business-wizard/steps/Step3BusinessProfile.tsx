"use client";

import { useState } from "react";
import {
    mockCreateBusiness,
} from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
import type { UserAccount, UserProfile, Business, AccessKey } from "@/types/users.types";
import { Field, TextInput, InfoRow, ButtonRow } from "../../keys/new-key-modal/ModalPrimitives";

/* ── Updated WizardFullData — adds my_business flag ── */
export interface WizardFullData {
    user: UserAccount;
    profile: UserProfile | null; // null when my_business = true (no profile created)
    business: Business;
    access_key: AccessKey;
    my_business: boolean;            // true = owner is the authenticated user themselves
}

interface Step3BusinessProfileProps {
    user: UserAccount;
    profile: UserProfile | null;  // null when isMyBusiness = true
    accessKey: AccessKey;
    isMyBusiness: boolean;
    hideKeyInfo?: boolean;
    /* Persisted values */
    initialName?: string;
    initialCountry?: string;
    initialRegionCity?: string;
    onDone: (data: WizardFullData) => void;
    onBack: () => void;
}

export function Step3BusinessProfile({
    user,
    profile,
    accessKey,
    isMyBusiness,
    hideKeyInfo = false,
    initialName = "",
    initialCountry = "",
    initialRegionCity = "",
    onDone,
    onBack,
}: Step3BusinessProfileProps) {
    const [name, setName] = useState(initialName);
    const [country, setCountry] = useState(initialCountry || (profile?.country ?? ""));
    const [regionCity, setRegionCity] = useState(initialRegionCity || (profile?.region_city ?? ""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = name.trim() && country.trim() && regionCity.trim();

    async function handleCreate() {
        if (!isValid) return;
        setLoading(true);
        setError("");
        try {
            const business = await mockCreateBusiness({
                owner_id: user.id,
                name: name.trim(),
                country: country.trim(),
                region_city: regionCity.trim(),
                access_key_id: hideKeyInfo ? "" : accessKey.id,
            });

            onDone({
                user,
                profile,
                business,
                access_key: accessKey,
                my_business: isMyBusiness,
            });
        } catch {
            setError("Failed to create business. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {hideKeyInfo
                    ? "Last step — enter the business details to complete registration."
                    : "Almost done. Enter the business details. The access key will be linked automatically on creation."}
            </p>

            {/* Progress summary */}
            <div
                className="space-y-2 rounded-xl p-4"
                style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                    Created so far
                </p>

                {/* Owner indicator */}
                {isMyBusiness ? (
                    <div className="flex items-center gap-2">
                        <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                        >
                            Your account
                        </span>
                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                            {user.email}
                        </span>
                    </div>
                ) : (
                    <>
                        <InfoRow label="Manager" value={profile?.full_name ?? "—"} />
                        <InfoRow label="Email" value={user.email} />
                    </>
                )}

                {!hideKeyInfo && (
                    <InfoRow
                        label="Access key"
                        value={<span className="font-mono text-[11px]">{accessKey.id || "—"}</span>}
                    />
                )}
            </div>

            <Field label="Business name">
                <TextInput value={name} onChange={setName} placeholder="e.g. Eto & Sons Trading" />
            </Field>

            <Field label="Country">
                <TextInput value={country} onChange={setCountry} placeholder="e.g. Cameroon" />
            </Field>

            <Field label="Region / City">
                <TextInput value={regionCity} onChange={setRegionCity} placeholder="e.g. Yaoundé" />
            </Field>

            {!hideKeyInfo && accessKey.id && (
                <div
                    className="rounded-xl px-4 py-3"
                    style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>
                        Access key to link
                    </p>
                    <p className="mt-1 font-mono text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                        {accessKey.key_code}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {accessKey.key_type === "TRIAL" ? "Trial" : "Lifetime"} · {accessKey.amount.toLocaleString()} XAF
                    </p>
                </div>
            )}

            {error && (
                <p className="rounded-lg px-3 py-2 text-[12px]" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                    {error}
                </p>
            )}

            <ButtonRow
                primary={{ label: loading ? "Creating…" : "Create business", onClick: handleCreate, disabled: !isValid }}
                secondary={{ label: "Back", onClick: onBack }}
                loading={loading}
            />
        </div>
    );
}