// src/app/(dashboard)/dashboard/my/settings/page.tsx

"use client";

import { useState } from "react";
import AccountTab from "@/components/dashboard/my/settings/AccountTab";
import BusinessesTabContainer from "@/components/dashboard/my/settings/businesses/BusinessesTabContainer";
import AccessKeysTab from "@/components/dashboard/my/settings/AccessKeysTab";
import BillingTab from "@/components/dashboard/my/settings/BillingTab";

export type SettingsTab = "account" | "businesses" | "access-keys" | "billing";

const TABS: { id: SettingsTab; label: string; badge?: string }[] = [
    { id: "account", label: "Account" },
    { id: "businesses", label: "Businesses" },
    { id: "access-keys", label: "Access Keys" },
    { id: "billing", label: "Billing", badge: "Soon" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("account");

    return (
        <div className="mx-auto lg:p-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                    Settings
                </h1>
                <p className="text-[14px] mt-1" style={{ color: "var(--text-subtle)" }}>
                    Manage your personal account, business portfolios, channel partnership, and key pricing settings.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b gap-6 text-[14px] font-medium" style={{ borderColor: "var(--border)" }}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className="pb-3 border-b-2 transition-colors flex items-center gap-2"
                        style={{
                            borderColor: activeTab === tab.id ? "var(--brand)" : "transparent",
                            color: activeTab === tab.id ? "var(--brand)" : "var(--text-muted)",
                        }}
                    >
                        {tab.label}
                        {tab.badge && (
                            <span
                                className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: "rgba(59,130,246,0.1)", color: "var(--brand)" }}
                            >
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "account" && <AccountTab />}
            {activeTab === "businesses" && <BusinessesTabContainer />}
            {activeTab === "access-keys" && <AccessKeysTab />}
            {activeTab === "billing" && <BillingTab />}
        </div>
    );
}