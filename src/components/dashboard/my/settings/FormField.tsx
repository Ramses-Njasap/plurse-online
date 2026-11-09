"use client";

import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function FormField({ label, className = "", ...inputProps }: FormFieldProps) {
    return (
        <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                {label}
            </label>
            <input
                {...inputProps}
                className={`w-full rounded-xl border px-3.5 py-2 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-stone-100/60 ${className}`}
                style={{ borderColor: "var(--border)" }}
            />
        </div>
    );
}