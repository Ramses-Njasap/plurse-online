import type { Metadata } from "next";
import "../globals.css";

import GridBackground from "@/components/Background";
import { DashboardSidebar } from "@/components/dashboard/layout/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/layout/Topbar";
import { ToastProvider } from "@/components/ui";

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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#FAFAF9]">

            <DashboardSidebar />
            <GridBackground />

            <div className="flex flex-1 z-10 flex-col overflow-hidden">
                <DashboardTopbar />

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </main>
            </div>
        </div>
    );
}