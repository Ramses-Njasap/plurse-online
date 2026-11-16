// src/components/contact/MessageTypeSelect.tsx
"use client";

import { MESSAGE_TYPES } from "@/lib/contact/config";
import type { MessageTypeValue } from "@/lib/contact/types";
import { fieldClass } from "./FormField";
import { ChevronDownIcon } from "./ContactIcons";

interface MessageTypeSelectProps {
    id: string;
    value: MessageTypeValue | "";
    onChange: (value: MessageTypeValue | "") => void;
    onBlur: () => void;
    hasError: boolean;
    describedBy?: string;
}

/* A styled native <select>: fully accessible, and on phones it opens the
   system picker, which is the best experience for a long list. */
export function MessageTypeSelect({
    id,
    value,
    onChange,
    onBlur,
    hasError,
    describedBy,
}: MessageTypeSelectProps) {
    return (
        <div className="relative">
            <select
                id={id}
                name="messageType"
                value={value}
                onChange={(e) => onChange(e.target.value as MessageTypeValue | "")}
                onBlur={onBlur}
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={fieldClass(hasError, "h-[44px] cursor-pointer appearance-none pr-10")}
                style={{ color: value ? "var(--foreground)" : "var(--text-subtle)" }}
            >
                <option value="" disabled>
                    Choose a topic…
                </option>
                {MESSAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value} style={{ color: "#0f172a" }}>
                        {type.label}
                    </option>
                ))}
            </select>

            <span
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-subtle)" }}
            >
                <ChevronDownIcon size={16} />
            </span>
        </div>
    );
}