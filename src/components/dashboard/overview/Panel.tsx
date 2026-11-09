// src/components/dashboard/overview/Panel.tsx

import Link from "next/link";
import { ArrowRightIcon } from "./OverviewIcons";


interface PanelProps {
    title: string;
    subtitle?: string;
    /** Small link in the header, e.g. "View all". */
    action?: { label: string; href: string };
    /** Free-form content on the right of the header (a badge, a total…). Shown instead of `action`. */
    headerRight?: React.ReactNode;
    children: React.ReactNode;
    bodyClassName?: string;
}

/** The card shell used by every Overview section. */
export function Panel({ title, subtitle, action, headerRight, children, bodyClassName = "p-5" }: PanelProps) {
    return (
        <section
            className="flex h-full flex-col overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            <header className="flex min-h-[57px] items-center justify-between gap-3 border-b px-5 py-3" style={{ borderColor: "var(--border)" }}>
                <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>{title}</h3>
                    {subtitle && <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-subtle)" }}>{subtitle}</p>}
                </div>
                {headerRight ?? (action && (
                    <Link
                        href={action.href}
                        className="flex shrink-0 items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-80"
                        style={{ color: "var(--brand)" }}
                    >
                        {action.label}
                        <ArrowRightIcon size={12} />
                    </Link>
                ))}
            </header>
            <div className={`flex-1 ${bodyClassName}`}>{children}</div>
        </section>
    );
}

export function PanelEmpty({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
            <span
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "var(--surface-muted)", color: "var(--text-subtle)" }}
            >
                {icon}
            </span>
            <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{title}</p>
            <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed" style={{ color: "var(--text-subtle)" }}>{description}</p>
        </div>
    );
}