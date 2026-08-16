"use client";

import { useState, useRef, useEffect, useMemo } from "react";

export interface SelectOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    /** Show search input when option count exceeds this. Default: 5 */
    searchThreshold?: number;
    width?: string;
}

export function FilterSelect({
    value,
    onChange,
    options,
    placeholder = "Select…",
    searchThreshold = 5,
    width,
}: FilterSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find((o) => o.value === value);
    const showSearch = options.length > searchThreshold;

    const filtered = useMemo(() => {
        if (!query.trim()) return options;
        const q = query.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, query]);

    /* Close on outside click */
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* Close on Escape */
    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.key === "Escape") { setOpen(false); setQuery(""); }
        }
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    /* Focus search input when panel opens */
    useEffect(() => {
        if (open && showSearch) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open, showSearch]);

    function handleSelect(optValue: string) {
        onChange(optValue);
        setOpen(false);
        setQuery("");
    }

    const isDefault = value === options[0]?.value;

    return (
        <div ref={ref} className="relative" style={{ width }}>
            {/* Trigger pill */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-all whitespace-nowrap"
                style={{
                    borderColor: open
                        ? "var(--brand)"
                        : isDefault ? "var(--border)" : "rgba(59,130,246,0.4)",
                    background: open
                        ? "var(--brand-light)"
                        : isDefault ? "var(--surface)" : "var(--brand-light)",
                    color: isDefault && !open ? "var(--text-muted)" : "var(--brand)",
                    boxShadow: open ? "0 0 0 3px var(--brand-ring)" : "none",
                }}
            >
                <span className="flex-1 text-left">
                    {selected?.label ?? placeholder}
                </span>
                <ChevronIcon open={open} />
            </button>

            {/* Floating panel */}
            {open && (
                <div
                    className="absolute left-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border shadow-xl"
                    style={{
                        minWidth: "180px",
                        width: width ?? "auto",
                        background: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    {/* Search input */}
                    {showSearch && (
                        <div
                            className="border-b px-3 py-2"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <div className="relative">
                                <SearchIcon />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search…"
                                    className="h-8 w-full rounded-lg border bg-white pl-7 pr-3 text-[12px] focus:outline-none"
                                    style={{
                                        borderColor: "var(--border)",
                                        color: "var(--foreground)",
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                                />
                            </div>
                        </div>
                    )}

                    {/* Options list */}
                    <div className="max-h-[220px] overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-3 text-center text-[12px]" style={{ color: "var(--text-subtle)" }}>
                                No results for "{query}"
                            </p>
                        ) : (
                            filtered.map((opt) => {
                                const isActive = opt.value === value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] transition-colors"
                                        style={{
                                            background: isActive ? "var(--brand-light)" : "transparent",
                                            color: isActive ? "var(--brand)" : "var(--foreground)",
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.background = "var(--surface-muted)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.background = "transparent";
                                        }}
                                    >
                                        <span>{opt.label}</span>
                                        {isActive && <CheckIcon />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Icons ── */
function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
                transition: "transform 180ms ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink: 0,
            }}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
function SearchIcon() {
    return (
        <span
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-subtle)" }}
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
        </span>
    );
}
function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}