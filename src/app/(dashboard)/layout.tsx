// app/dashboard/layout.tsx
import type { Metadata } from "next";
import { whichUser } from "@/app/utils/auth";
import "../globals.css";

import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";

export const metadata: Metadata = {
    title: {
        template: "%s · Plurse | Dashboard",
        default: "Dashboard · Plurse",
    },
    description:
        "Manage your inventory, cashflow, sales and team — all in one place.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Plurse Dashboard",
        description: "Your business operating layer.",
        siteName: "Plurse",
        type: "website",
    },
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser = await whichUser.info;
    return <DashboardShell currentUser={currentUser}>{children}</DashboardShell>;
}