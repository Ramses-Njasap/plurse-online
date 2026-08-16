"use client";

import { useState, useEffect, useRef } from "react";
import { searchBusinessesAction, linkBusinessToAccessKeyAction } from "@/app/actions/accesskeys";
import type { AccessKey, Business } from "@/types/users.types";
import { ButtonRow } from "../../keys/new-key-modal/ModalPrimitives";

interface SearchBusinessProps {
    createdKey: AccessKey | null;
    onLinked: (business: Business) => void;
    onBack: () => void;
}

export function SearchBusiness({ createdKey, onLinked, onBack }: SearchBusinessProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Business[]>([]);
    const [selected, setSelected] = useState<Business | null>(null);
    const [searching, setSearching] = useState(false);
    const [linking, setLinking] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setSearching(true);
        debounceRef.current = setTimeout(async () => {
            const res = await searchBusinessesAction(query);
            setResults(res);
            setSearching(false);
        }, 350);
    }, [query]);

    async function handleLink() {
        if (!selected) return;

        onLinked(selected);
    }

    return (
        <div className="space-y-4">
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                Search by business <strong>code</strong>. Enter the full code (e.g., PLUR-003E4F-BIZ) or just the unique part (e.g., 003E4F). Only unlinked businesses are selectable.
            </p>

            {errorMsg && (
                <p className="text-[12px] font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {errorMsg}
                </p>
            )}

            {/* Search input */}
            <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }}>
                    <MagnifyIcon />
                </span>
                {searching && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }}>
                        <SpinnerIcon />
                    </span>
                )}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                    placeholder="e.g. PLUR-003E4F-BIZ or 003E4F"
                    className="h-[42px] w-full rounded-lg border pl-9 pr-4 text-[13px] focus:outline-none"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "white" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: "260px" }}>
                    {results.map((b) => {
                        const alreadyLinked = b.access_key_id !== null && !b.access_key?.is_expired; // If the business has an access key and it's not expired, it's considered already linked
                        const isSelected = selected?.id === b.id;
                        return (
                            <button
                                key={b.id}
                                type="button"
                                disabled={alreadyLinked}
                                onClick={() => setSelected(isSelected ? null : b)}
                                className="w-full rounded-xl border p-3.5 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    borderColor: isSelected ? "var(--brand)" : "var(--border)",
                                    background: isSelected ? "var(--brand-light)" : "var(--surface-muted)",
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                                            {b.name}
                                        </p>
                                        <p className="mt-0.5 font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                            {b.business_code}
                                        </p>
                                        <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                                            {b.region_city}, {b.country}
                                        </p>
                                    </div>
                                    {alreadyLinked ? (
                                        <span
                                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                            style={{ background: "rgba(245,158,11,0.10)", color: "#d97706" }}
                                        >
                                            Already linked
                                        </span>
                                    ) : isSelected ? (
                                        <span
                                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                            style={{ background: "var(--brand)", color: "white" }}
                                        >
                                            Selected
                                        </span>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {query.trim() && !searching && results.length === 0 && (
                <p className="py-4 text-center text-[13px]" style={{ color: "var(--text-subtle)" }}>
                    No business found with code "{query}".
                </p>
            )}

            {/* Selected summary */}
            {selected && (
                <div
                    className="rounded-xl p-3"
                    style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>
                        Will link to:
                    </p>
                    <p className="mt-1 text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{selected.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{selected.business_code}</p>
                </div>
            )}

            <ButtonRow
                primary={{ label: linking ? "Linking…" : "Link to this business", onClick: handleLink, disabled: !selected || linking }}
                secondary={{ label: "Back", onClick: onBack }}
                loading={linking}
            />
        </div>
    );
}

function MagnifyIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
    );
}
function SpinnerIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
}