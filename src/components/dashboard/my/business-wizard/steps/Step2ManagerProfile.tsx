"use client";

import { useState } from "react";
import { mockCreateUserProfile } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
import type { UserAccount, UserProfile } from "@/types/users.types";
import { Field, TextInput, ButtonRow } from "../../keys/new-key-modal/ModalPrimitives";

interface Step2ManagerProfileProps {
    user: UserAccount;
    /* Persisted values — passed down from wizard so back/forward keeps data */
    initialFullName?: string;
    initialDob?: string;
    initialCountry?: string;
    initialRegionCity?: string;
    onNext: (profile: UserProfile, fullName: string, dob: string, country: string, regionCity: string) => void;
    onBack: () => void;
}

export function Step2ManagerProfile({
    user,
    initialFullName = "",
    initialDob = "",
    initialCountry = "",
    initialRegionCity = "",
    onNext,
    onBack,
}: Step2ManagerProfileProps) {
    const [fullName, setFullName] = useState(initialFullName);
    const [dob, setDob] = useState(initialDob);
    const [country, setCountry] = useState(initialCountry);
    const [regionCity, setRegionCity] = useState(initialRegionCity);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = fullName.trim() && dob && country.trim() && regionCity.trim();

    async function handleNext() {
        if (!isValid) return;
        setLoading(true);
        setError("");
        try {
            const profile = await mockCreateUserProfile({
                user_id: user.id,
                full_name: fullName.trim(),
                date_of_birth: dob,
                country: country.trim(),
                region_city: regionCity.trim(),
            });
            onNext(profile, fullName, dob, country, regionCity);
        } catch {
            setError("Failed to create manager profile. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Provide the manager's personal details. This creates their profile linked to the
                account created in the previous step.
            </p>

            {/* Linked user reference */}
            <div
                className="rounded-xl px-4 py-3 text-[12px]"
                style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
                <span style={{ color: "var(--text-subtle)" }}>Manager account: </span>
                <span className="font-medium" style={{ color: "var(--foreground)" }}>{user.email}</span>
                {/* <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>({user.id})</span> */}
            </div>

            <Field label="Full name">
                <TextInput value={fullName} onChange={setFullName} placeholder="e.g. Amara Nkosi" />
            </Field>

            <Field label="Date of birth">
                <TextInput type="date" value={dob} onChange={setDob} />
            </Field>

            <Field label="Country">
                <TextInput value={country} onChange={setCountry} placeholder="e.g. Cameroon" />
            </Field>

            <Field label="Region / City">
                <TextInput value={regionCity} onChange={setRegionCity} placeholder="e.g. Douala" />
            </Field>

            {error && (
                <p className="rounded-lg px-3 py-2 text-[12px]" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                    {error}
                </p>
            )}

            <ButtonRow
                primary={{ label: "Continue", onClick: handleNext, disabled: !isValid }}
                secondary={{ label: "Back", onClick: onBack }}
                loading={loading}
            />
        </div>
    );
}