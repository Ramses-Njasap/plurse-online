"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { checkChannelPartnerStatus } from "@/app/actions/channel_partners";

interface ChannelPartnerContextValue {
    /** null = still resolving, true = already a partner, false = not a partner */
    isPartner: boolean | null;
    refresh: () => Promise<void>;
    markAsPartner: () => void;
}

const ChannelPartnerContext = createContext<ChannelPartnerContextValue | null>(null);

/**
 * Wrap the dashboard layout with this once so every ChannelPartnerPromo
 * instance (banner, sidebar, or anywhere else) shares one status check
 * and stays in sync — activating from one place hides it everywhere.
 *
 *   // app/(dashboard)/layout.tsx
 *   <ChannelPartnerProvider>
 *     <DashboardSidebar />
 *     {children}
 *   </ChannelPartnerProvider>
 */
export function ChannelPartnerProvider({ children }: { children: ReactNode }) {
    const [isPartner, setIsPartner] = useState<boolean | null>(null);

    const refresh = useCallback(async () => {
        const status = await checkChannelPartnerStatus();
        setIsPartner(status);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const markAsPartner = useCallback(() => setIsPartner(true), []);

    return (
        <ChannelPartnerContext.Provider value={{ isPartner, refresh, markAsPartner }}>
            {children}
        </ChannelPartnerContext.Provider>
    );
}

export function useChannelPartner() {
    const ctx = useContext(ChannelPartnerContext);
    if (!ctx) {
        throw new Error("useChannelPartner must be used within a ChannelPartnerProvider");
    }
    return ctx;
}