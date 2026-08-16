// components/dashboard/layout/DashboardShell.tsx
"use client";

import { useState, useEffect } from "react";

import GridBackground from "@/components/Background";
import { DashboardSidebar } from "@/components/dashboard/layout/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/layout/Topbar";
import { ToastProvider } from "@/components/ui";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileNavOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileNavOpen]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#FAFAF9]">
            <DashboardSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
            <GridBackground />

            <div className="flex flex-1 z-10 flex-col overflow-hidden">
                <DashboardTopbar
                    mobileNavOpen={mobileNavOpen}
                    onMenuClick={() => setMobileNavOpen((prev) => !prev)}
                />

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </main>
            </div>
        </div>
    );
}