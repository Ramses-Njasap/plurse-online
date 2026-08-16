"use client";

import { useState, useRef, useEffect } from "react";
import type { AccessKey } from "@/types/users.types";

interface KeyRowMenuProps {
    keyItem: AccessKey;
    onView: (k: AccessKey) => void;
    onEdit: (k: AccessKey) => void;
    onDelete: (k: AccessKey) => void;
}

export function KeyRowMenu({ keyItem, onView, onEdit, onDelete }: KeyRowMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative flex justify-end">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={{ color: "var(--text-subtle)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label="Row actions"
            >
                <DotsIcon />
            </button>

            {open && (
                <div
                    className="absolute right-0 top-8 z-50 w-40 overflow-hidden rounded-xl border py-1 shadow-lg"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                    {/* <MenuItem
                        icon={<EyeIcon />}
                        label="View"
                        onClick={() => { onView(keyItem); setOpen(false); }}
                    />
                    <MenuItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => { onEdit(keyItem); setOpen(false); }}
                    />
                    <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} /> */}
                    <MenuItem
                        icon={<TrashIcon />}
                        label="Delete"
                        danger
                        onClick={() => { onDelete(keyItem); setOpen(false); }}
                    />
                </div>
            )}
        </div>
    );
}

function MenuItem({
    icon, label, onClick, danger = false,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors"
            style={{ color: danger ? "#ef4444" : "var(--foreground)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "rgba(239,68,68,0.06)" : "var(--surface-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            {icon}
            {label}
        </button>
    );
}

function DotsIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
        </svg>
    );
}
function EyeIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function EditIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
    );
}