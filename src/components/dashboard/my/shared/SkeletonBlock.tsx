// src/components/dashboard/my/shared/SkeletonBlock.tsx

import type { CSSProperties } from "react";

interface SkeletonBlockProps {
    className?: string;
    style?: CSSProperties;
    /** "strong" is for blocks sitting on a muted background (e.g. a table header row). */
    tone?: "muted" | "strong";
}

/** The single pulsing placeholder shape used by every loading skeleton. */
export function SkeletonBlock({ className = "", style, tone = "muted" }: SkeletonBlockProps) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse ${className}`}
            style={{ background: tone === "muted" ? "var(--surface-muted)" : "var(--border)", ...style }}
        />
    );
}