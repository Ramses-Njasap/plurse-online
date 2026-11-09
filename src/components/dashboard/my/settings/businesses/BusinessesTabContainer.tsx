// src/components/dashboard/my/settings/BusinessesTabContainer.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { Business } from "@/types/users.types";
import { fetchAuthenticatedBusinesses, updateBusinessAction } from "@/app/actions/businesses";
import BusinessesTab from "../BusinessesTab";
import { BusinessesSkeleton } from "./BusinessesSkeleton";

type LoadState =
    | { status: "loading" }
    | { status: "ready"; data: Business[] }
    | { status: "unauthorized"; message: string }
    | { status: "error"; message: string };

/**
 * Loads the signed-in user's businesses from Supabase and renders the Businesses settings tab.
 * Keeps data fetching out of the presentational BusinessesTab.
 */
export default function BusinessesTabContainer() {
    const [state, setState] = useState<LoadState>({ status: "loading" });
    const requestId = useRef(0);

    const load = useCallback(async () => {
        const id = ++requestId.current;
        setState({ status: "loading" });

        try {
            const response = await fetchAuthenticatedBusinesses();
            if (id !== requestId.current) return; // a newer request superseded this one

            if (response.success) {
                setState({ status: "ready", data: response.data });
            } else if (response.errorType === "UNAUTHORIZED") {
                setState({ status: "unauthorized", message: response.message });
            } else {
                setState({ status: "error", message: response.message });
            }
        } catch (err) {
            console.error(err);
            if (id !== requestId.current) return;
            setState({ status: "error", message: "An unexpected error occurred while loading your businesses." });
        }
    }, []);

    useEffect(() => {
        load();
        return () => { requestId.current++; }; // ignore results after unmount
    }, [load]);

    if (state.status === "loading") return <BusinessesSkeleton />;

    if (state.status === "unauthorized") {
        return (
            <StatusCard
                title="Session expired"
                message={state.message}
                action={
                    <Link
                        href="/login"
                        className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: "var(--foreground)" }}
                    >
                        Sign back in
                    </Link>
                }
            />
        );
    }

    if (state.status === "error") {
        return (
            <StatusCard
                title="Couldn't load your businesses"
                message={state.message}
                action={
                    <button
                        type="button"
                        onClick={load}
                        className="h-9 rounded-lg px-4 text-[13px] font-medium text-white transition-all"
                        style={{ background: "var(--brand)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                    >
                        Try again
                    </button>
                }
            />
        );
    }

    return <BusinessesTab businesses={state.data} onUpdateBusiness={updateBusinessAction} />;
}

function StatusCard({ title, message, action }: { title: string; message: string; action: React.ReactNode }) {
    return (
        <div
            className="mx-auto my-8 max-w-md rounded-2xl border p-6 text-center"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
            <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "rgba(245,158,11,0.10)", color: "#d97706" }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>{title}</h3>
            <p className="mt-2 text-[13px]" style={{ color: "var(--text-subtle)" }}>{message}</p>
            <div className="mt-5">{action}</div>
        </div>
    );
}