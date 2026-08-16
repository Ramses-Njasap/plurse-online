"use client";

import { InfoRow } from "../../keys/new-key-modal/ModalPrimitives";
import type { AccessKey } from "@/types/users.types";

interface LinkMethodProps {
    createdKey: AccessKey | null;
    onSearchExisting: () => void;
    onCreateNew: () => void;
}

export function LinkMethod({ createdKey, onSearchExisting, onCreateNew }: LinkMethodProps) {
    return (
        <div className="space-y-5">
            {/* Created key summary */}
            <div className="space-y-2 rounded-xl p-4" style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>
                    Linking Process...
                </p>
                {createdKey && (
                    <>
                        <InfoRow label="ID" value={<span className="font-mono text-[11px]">{createdKey.id}</span>} />
                        <InfoRow label="Code" value={<span className="font-mono text-[12px]">{createdKey.key_code.slice(0, 18)}…</span>} />
                        <InfoRow label="Type" value={createdKey.key_type === "TRIAL" ? "Trial" : "Lifetime"} />
                        <InfoRow label="Amount" value={`${createdKey.amount.toLocaleString()} XAF`} />
                    </>
                )}
            </div>

            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Now link this key to a business. You can either search for an existing business
                by its unique ID, or register a new one.
            </p>

            <div className="grid grid-cols-1 gap-3">
                {/* Search existing */}
                <OptionCard
                    icon={<SearchIcon />}
                    title="Link existing business"
                    subtitle="Search by business ID or name and link instantly."
                    onClick={onSearchExisting}
                    primary
                />

                {/* Create new */}
                <OptionCard
                    icon={<PlusCircleIcon />}
                    title="Register new business"
                    subtitle="Create a manager account, profile, and business in 3 steps."
                    onClick={onCreateNew}
                />
            </div>
        </div>
    );
}

function OptionCard({
    icon, title, subtitle, onClick, primary = false,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void;
    primary?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-start gap-4 rounded-xl border p-4 text-left transition-all"
            style={{
                borderColor: primary ? "rgba(59,130,246,0.25)" : "var(--border)",
                background: primary ? "var(--brand-light)" : "var(--surface-muted)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = primary ? "rgba(59,130,246,0.25)" : "var(--border)")}
        >
            <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: primary ? "var(--brand)" : "var(--surface)", color: primary ? "white" : "var(--brand)" }}
            >
                {icon}
            </div>
            <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>{title}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
            </div>
        </button>
    );
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
    );
}
function PlusCircleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
        </svg>
    );
}