// src/components/dashboard/my/settings/businesses/DetailPrimitives.tsx

import { LockIcon } from "./BusinessIcons";

export function Section({
    title, icon, action, children,
}: {
    title: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <div
                className="flex min-h-[44px] items-center justify-between gap-3 border-b px-4 py-2"
                style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
            >
                <div className="flex items-center gap-2">
                    {icon && <span style={{ color: "var(--brand)" }}>{icon}</span>}
                    <h4 className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>{title}</h4>
                </div>
                {action}
            </div>
            <div className="space-y-1 px-4 py-3">{children}</div>
        </section>
    );
}

export function Row({ label, value, locked = false }: { label: string; value: React.ReactNode; locked?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 py-1">
            <span className="flex shrink-0 items-center gap-1.5 text-[12px]" style={{ color: "var(--text-subtle)" }}>
                {label}
                {locked && <LockIcon size={10} />}
            </span>
            <span className="min-w-0 break-words text-right text-[12px] font-medium" style={{ color: "var(--foreground)" }}>
                {value}
            </span>
        </div>
    );
}

export function Mono({ children }: { children: React.ReactNode }) {
    return <span className="break-all font-mono text-[11px]">{children}</span>;
}

export function Note({ children }: { children: React.ReactNode }) {
    return (
        <p className="pt-1 text-[12px] leading-relaxed" style={{ color: "var(--text-subtle)" }}>
            {children}
        </p>
    );
}