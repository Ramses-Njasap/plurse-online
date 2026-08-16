/* ── 6-digit OTP input ── */

"use client";

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";

interface OtpInputProps {
    value: string[]; // always length 6
    onChange: (next: string[]) => void;
    hasError: boolean;
}

export function OtpInput({ value, onChange, hasError }: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    function focus(index: number) {
        refs.current[index]?.focus();
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>, i: number) {
        const raw = e.target.value.replace(/\D/g, ""); // digits only
        if (!raw) return;

        const digit = raw[raw.length - 1]; // take last digit if somehow >1
        const next = [...value];
        next[i] = digit;
        onChange(next);

        if (i < 5) focus(i + 1);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, i: number) {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...value];
            if (next[i]) {
                // clear current cell
                next[i] = "";
                onChange(next);
            } else if (i > 0) {
                // move back and clear
                next[i - 1] = "";
                onChange(next);
                focus(i - 1);
            }
        } else if (e.key === "ArrowLeft" && i > 0) {
            focus(i - 1);
        } else if (e.key === "ArrowRight" && i < 5) {
            focus(i + 1);
        }
    }

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;

        const next = [...value];
        pasted.split("").forEach((d, idx) => {
            if (idx < 6) next[idx] = d;
        });
        onChange(next);

        // focus the cell after the last pasted digit
        const nextFocus = Math.min(pasted.length, 5);
        focus(nextFocus);
    }

    const borderColor = hasError
        ? "rgba(248,113,113,0.7)"   // red-400
        : "rgba(15,15,15,0.12)";

    const focusBrand = hasError ? "#f87171" : "var(--brand)";

    return (
        <div className="flex gap-3">
            {value.map((digit, i) => (
                <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    onFocus={(e) => {
                        e.currentTarget.select();
                        e.currentTarget.style.borderColor = focusBrand;
                        e.currentTarget.style.boxShadow = `0 0 0 3px var(--brand-ring)`;
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = hasError
                            ? "rgba(248,113,113,0.7)"
                            : "rgba(15,15,15,0.12)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    className="h-[56px] w-full rounded-xl border bg-white text-center text-[22px] font-semibold text-[#0F0F0F] outline-none transition-all duration-150 caret-transparent"
                    style={{
                        borderColor,
                        letterSpacing: 0,
                        color: hasError ? "#ef4444" : "#0F0F0F",
                    }}
                    aria-label={`Digit ${i + 1}`}
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
}
