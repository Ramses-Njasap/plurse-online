// src/components/contact/FormField.tsx

import type { ReactNode } from "react";

/** Shared look for inputs, textarea and select so every field stays consistent. */
export function fieldClass(hasError: boolean, extra = "") {
    const state = hasError
        ? "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
        : "border-[var(--border)] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_var(--brand-light)]";

    return `w-full rounded-xl border bg-white px-3.5 text-[14px] text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--text-subtle)] ${state} ${extra}`;
}

interface FormFieldProps {
    /** id of the control inside; also used to link label, hint and error. */
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    /** Small text on the right of the footer, e.g. "12/1000". */
    counter?: string;
    children: ReactNode;
}

export function FormField({ id, label, required, error, hint, counter, children }: FormFieldProps) {
    return (
        <div className="space-y-1.5">
            <label
                htmlFor={id}
                className="block text-[13px] font-medium"
                style={{ color: "var(--foreground)" }}
            >
                {label}
                {required && (
                    <span style={{ color: "var(--brand)" }} aria-hidden="true">
                        {" "}
                        *
                    </span>
                )}
            </label>

            {children}

            {(error || hint || counter) && (
                <div className="flex items-start justify-between gap-3">
                    {error ? (
                        <p
                            id={`${id}-error`}
                            role="alert"
                            className="text-[12px] leading-snug"
                            style={{ color: "#dc2626" }}
                        >
                            {error}
                        </p>
                    ) : hint ? (
                        <p
                            id={`${id}-hint`}
                            className="text-[12px] leading-snug"
                            style={{ color: "var(--text-subtle)" }}
                        >
                            {hint}
                        </p>
                    ) : (
                        <span />
                    )}

                    {counter && (
                        <span
                            className="shrink-0 font-mono text-[11px]"
                            style={{ color: "var(--text-subtle)" }}
                        >
                            {counter}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}