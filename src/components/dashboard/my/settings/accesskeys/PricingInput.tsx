// src/components/dashboard/my/settings/accesskeys/PricingInput.tsx

"use client";

import { MIN_PRICE, formatXAF } from "./commission";

interface PricingInputProps {
    value: string;
    onChange: (digits: string) => void;
    onBlur: () => void;
    error?: string;
}

export function PricingInput({ value, onChange, onBlur, error }: PricingInputProps) {
    return (
        <div>
            <label htmlFor="key-price" className="mb-1.5 block text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
                Selling price per key
            </label>
            <div className="relative max-w-xs">
                <input
                    id="key-price"
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
                    onBlur={onBlur}
                    aria-invalid={!!error}
                    aria-describedby="key-price-hint"
                    className={`h-10 w-full rounded-lg border bg-white pl-3 pr-14 font-mono text-[14px] transition-colors focus:outline-none ${error ? "border-[#ef4444]" : "border-[color:var(--border)] focus:border-[color:var(--brand)]"
                        }`}
                    style={{ color: "var(--foreground)" }}
                />
                <span
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold"
                    style={{ color: "var(--text-subtle)" }}
                >
                    XAF
                </span>
            </div>
            <p
                id="key-price-hint"
                className="mt-1.5 text-[12px]"
                style={{ color: error ? "#dc2626" : "var(--text-subtle)" }}
            >
                {error ?? `Minimum ${formatXAF(MIN_PRICE)}. A higher price moves you up the commission ladder.`}
            </p>
        </div>
    );
}