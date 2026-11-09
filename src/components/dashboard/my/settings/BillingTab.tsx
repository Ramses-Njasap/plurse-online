"use client";

import { IconClock } from "./icons"

export default function BillingTab() {
    return (
        <div
            className="p-12 text-center rounded-2xl border space-y-3"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center bg-blue-50">
                <IconClock className="w-5 h-5" style={{ color: "var(--brand)" }} />
            </div>
            <h2 className="text-[18px] font-semibold" style={{ color: "var(--foreground)" }}>
                Billing & Invoicing Coming Soon
            </h2>
            <p className="text-[13px] max-w-sm mx-auto" style={{ color: "var(--text-subtle)" }}>
                Subscriptions and automated mobile money logs will appear here.
            </p>
        </div>
    );
}