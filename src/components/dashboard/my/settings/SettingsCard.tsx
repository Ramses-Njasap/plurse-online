"use client";

import { ReactNode } from "react";

interface SettingsCardProps {
    title?: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function SettingsCard({ title, description, action, children, className = "" }: SettingsCardProps) {
    return (
        <div
            className={`p-6 rounded-2xl border space-y-4 ${className}`}
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            {(title || action) && (
                <div className="flex items-center justify-between gap-4">
                    {title && (
                        <div>
                            <h2 className="text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                                {title}
                            </h2>
                            {description && (
                                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    {action}
                </div>
            )}
            {!title && description && (
                <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}