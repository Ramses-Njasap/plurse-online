// src/components/dashboard/my/settings/accesskeys/TierLadder.tsx

"use client";

import { TIERS, getTier, formatXAF } from "./commission";

interface TierLadderProps {
    price: number;
    /** Selecting a tier jumps the price to that tier's threshold. */
    onSelect: (threshold: number) => void;
}

export function TierLadder({ price, onSelect }: TierLadderProps) {
    const active = getTier(price).threshold;

    return (
        <div>
            <p className="mb-2 text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
                Commission tiers
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIERS.map((t) => {
                    const isActive = t.threshold === active;
                    return (
                        <button
                            key={t.threshold}
                            type="button"
                            onClick={() => onSelect(t.threshold)}
                            aria-pressed={isActive}
                            title={`Set price to ${formatXAF(t.threshold)}`}
                            className="rounded-xl border px-3 py-2.5 text-left transition-all focus:outline-none focus-visible:[box-shadow:0_0_0_3px_var(--brand-ring)]"
                            style={{
                                borderColor: isActive ? "var(--brand)" : "var(--border)",
                                background: isActive ? "var(--brand-light)" : "var(--surface)",
                            }}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface-muted)"; }}
                            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface)"; }}
                        >
                            <p className="text-[12px] font-medium" style={{ color: isActive ? "var(--brand)" : "var(--text-muted)" }}>
                                {formatXAF(t.threshold)}+
                            </p>
                            <p className="mt-0.5 text-[15px] font-semibold" style={{ color: isActive ? "var(--brand)" : "var(--foreground)" }}>
                                {t.partnerPercent}%
                                <span className="ml-1 text-[11px] font-medium" style={{ color: isActive ? "var(--brand)" : "var(--text-subtle)" }}>
                                    your share
                                </span>
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}