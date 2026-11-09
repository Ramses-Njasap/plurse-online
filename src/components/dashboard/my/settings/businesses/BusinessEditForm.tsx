// src/components/dashboard/my/settings/businesses/BusinessEditForm.tsx

"use client";

import { useState } from "react";
import type { BusinessEditablePatch, UpdateBusinessResult } from "./businessUtils";

interface BusinessEditFormProps {
    initial: BusinessEditablePatch;
    onSubmit: (patch: BusinessEditablePatch) => Promise<UpdateBusinessResult>;
    onCancel: () => void;
}

const COUNTRY_SUGGESTIONS = [
    "Cameroon", "Nigeria", "Ghana", "Kenya", "Senegal", "Côte d'Ivoire", "Gabon", "Chad",
    "Congo", "DR Congo", "Rwanda", "Uganda", "Tanzania", "Ethiopia", "South Africa", "Benin", "Togo",
];

function validate(v: BusinessEditablePatch): Partial<Record<keyof BusinessEditablePatch, string>> {
    const errors: Partial<Record<keyof BusinessEditablePatch, string>> = {};
    const name = v.name.trim();
    if (name.length < 2) errors.name = "Enter at least 2 characters.";
    else if (name.length > 80) errors.name = "Keep the name under 80 characters.";
    if (v.country.trim().length < 2) errors.country = "Enter a country.";
    if (v.region_city.trim().length < 2) errors.region_city = "Enter a region or city.";
    return errors;
}

export function BusinessEditForm({ initial, onSubmit, onCancel }: BusinessEditFormProps) {
    const [values, setValues] = useState<BusinessEditablePatch>(initial);
    const [touched, setTouched] = useState<Partial<Record<keyof BusinessEditablePatch, boolean>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const errors = validate(values);
    const hasErrors = Object.keys(errors).length > 0;
    const isDirty =
        values.name.trim() !== initial.name ||
        values.country.trim() !== initial.country ||
        values.region_city.trim() !== initial.region_city;

    function set<K extends keyof BusinessEditablePatch>(key: K, v: string) {
        setValues((prev) => ({ ...prev, [key]: v }));
        setServerError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({ name: true, country: true, region_city: true });
        if (hasErrors || !isDirty) return;

        setSubmitting(true);
        const result = await onSubmit({
            name: values.name.trim(),
            country: values.country.trim(),
            region_city: values.region_city.trim(),
        });
        if (!result.success) {
            setServerError(result.message ?? "We couldn't save your changes. Try again.");
            setSubmitting(false);
        }
        // On success the parent leaves edit mode and unmounts this form.
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3.5 py-1" noValidate>
            <Field label="Business name" error={touched.name ? errors.name : undefined}>
                <input
                    type="text"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    maxLength={80}
                    autoFocus
                    className={inputClassFor(!!(touched.name && errors.name))}
                    style={inputStyle}
                />
            </Field>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <Field label="Country" error={touched.country ? errors.country : undefined}>
                    <input
                        type="text"
                        list="settings-country-options"
                        value={values.country}
                        onChange={(e) => set("country", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, country: true }))}
                        className={inputClassFor(!!(touched.country && errors.country))}
                        style={inputStyle}
                    />
                    <datalist id="settings-country-options">
                        {COUNTRY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
                    </datalist>
                </Field>

                <Field label="Region / City" error={touched.region_city ? errors.region_city : undefined}>
                    <input
                        type="text"
                        value={values.region_city}
                        onChange={(e) => set("region_city", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, region_city: true }))}
                        className={inputClassFor(!!(touched.region_city && errors.region_city))}
                        style={inputStyle}
                    />
                </Field>
            </div>

            {serverError && (
                <p
                    className="rounded-lg border px-3 py-2 text-[12px]"
                    style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)", color: "#dc2626" }}
                    role="alert"
                >
                    {serverError}
                </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="h-9 rounded-lg border px-3 text-[13px] font-medium transition-all disabled:opacity-50"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting || !isDirty || hasErrors}
                    className="h-9 rounded-lg px-3.5 text-[13px] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: "var(--brand)" }}
                >
                    {submitting ? "Saving…" : "Save changes"}
                </button>
            </div>
        </form>
    );
}

/* ── Field primitives ── */

const inputBase = "h-9 w-full rounded-lg border bg-white px-3 text-[13px] transition-colors focus:outline-none";

function inputClassFor(hasError: boolean): string {
    return `${inputBase} ${hasError ? "border-[#ef4444]" : "border-[color:var(--border)] focus:border-[color:var(--brand)]"}`;
}

const inputStyle: React.CSSProperties = { color: "var(--foreground)" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 block text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
            {children}
            {error && <span className="mt-1 block text-[11px]" style={{ color: "#dc2626" }}>{error}</span>}
        </label>
    );
}