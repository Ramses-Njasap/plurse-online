"use client";

import { useState } from "react";
import { mockCreateUser } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
import type { UserAccount } from "@/types/users.types";
import { Field, TextInput, ButtonRow } from "../../keys/new-key-modal/ModalPrimitives";

interface Step1CredentialsProps {
    /* Persisted values — passed down from the wizard so back/forward keeps data */
    initialEmail?: string;
    initialPhone?: string;
    initialIsMyBusiness?: boolean;
    onNext: (user: UserAccount | null, isMyBusiness: boolean, email: string, phone: string) => void;
    onBack: () => void;
}

export function Step1Credentials({
    initialEmail = "",
    initialPhone = "",
    initialIsMyBusiness = false,
    onNext,
    onBack,
}: Step1CredentialsProps) {
    const [email, setEmail] = useState(initialEmail);
    const [phone, setPhone] = useState(initialPhone);
    const [isMyBusiness, setIsMyBusiness] = useState(initialIsMyBusiness);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const canContinue = isMyBusiness || (isValidEmail && phone.trim().length >= 8);

    function handleToggle() {
        setIsMyBusiness((prev) => !prev);
        setError("");
    }

    async function handleNext() {
        if (!canContinue) return;
        setError("");

        if (isMyBusiness) {
            /* Skip user creation — wizard will use the authenticated user */
            onNext(null, true, email, phone);
            return;
        }

        setLoading(true);
        try {
            const { user } = await mockCreateUser({ email: email.trim(), phone: phone.trim() });
            onNext(user, false, email, phone);
        } catch {
            setError("Failed to create user account. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Enter the manager's contact details. A secure password will be generated
                automatically and sent to them via email.
            </p>

            {/* Email */}
            <Field label="Business email">
                <TextInput
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="manager@business.com"
                    disabled={isMyBusiness}
                    readOnly={isMyBusiness}
                />
            </Field>

            {/* Phone */}
            <Field label="Phone number" hint="Include country code, e.g. +237 6XX XXX XXX">
                <TextInput
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+237 6XX XXX XXX"
                    disabled={isMyBusiness}
                    readOnly={isMyBusiness}
                />
            </Field>

            {/* ── OR divider ── */}
            <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--text-subtle)" }}>
                    or
                </span>
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
            </div>

            {/* ── My business toggle ── */}
            <button
                type="button"
                onClick={handleToggle}
                className="flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all"
                style={
                    isMyBusiness
                        ? {
                            borderColor: "var(--brand)",
                            background: "var(--brand-light)",
                        }
                        : {
                            borderColor: "var(--border)",
                            background: "var(--surface-muted)",
                        }
                }
            >
                {/* Custom radio-style indicator */}
                <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                    style={
                        isMyBusiness
                            ? { borderColor: "var(--brand)", background: "var(--brand)" }
                            : { borderColor: "var(--border-strong)", background: "white" }
                    }
                >
                    {isMyBusiness && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                </span>

                <div className="min-w-0 flex-1">
                    <p
                        className="text-[13px] font-semibold"
                        style={{ color: isMyBusiness ? "var(--brand)" : "var(--foreground)" }}
                    >
                        This is my own business
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                        Use my existing account credentials — skip to business profile setup.
                    </p>
                </div>
            </button>

            {isMyBusiness && (
                <p
                    className="rounded-xl px-4 py-3 text-[12px] leading-relaxed"
                    style={{ background: "var(--brand-light)", color: "var(--brand)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                    Your existing account will be used as the business owner. No new user will be created.
                </p>
            )}

            {error && (
                <p className="rounded-lg px-3 py-2 text-[12px]" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                    {error}
                </p>
            )}

            <ButtonRow
                primary={{ label: isMyBusiness ? "Continue to business profile" : "Continue", onClick: handleNext, disabled: !canContinue }}
                secondary={{ label: "Back", onClick: onBack }}
                loading={loading}
            />
        </div>
    );
}