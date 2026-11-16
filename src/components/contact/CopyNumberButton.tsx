// src/components/contact/CopyNumberButton.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./ContactIcons";

interface CopyNumberButtonProps {
    /** The text that gets copied (usually the phone number with "+"). */
    value: string;
}

/* Desktop browsers usually have no dialer, so "Call now" may do nothing there.
   This lets those visitors copy the number and dial from their phone. */
export function CopyNumberButton({ value }: CopyNumberButtonProps) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard blocked (e.g. insecure context): the number is visible on screen anyway.
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="flex h-[40px] w-full items-center justify-center gap-2 rounded-xl border bg-white text-[13px] font-medium transition-colors hover:bg-[var(--surface-muted)]"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            <span aria-live="polite">{copied ? "Number copied" : "Copy number"}</span>
        </button>
    );
}