// app/(dashboard)/dashboard/hooks/useOverviewData.ts

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { AccessKey } from "@/types/users.types";
import { fetchAuthenticatedBusinesses } from "@/app/actions/businesses";
import { fetchAuthenticatedAccessKeys } from "@/app/actions/accesskeys";
import { fetchAuthenticatedTransactions } from "@/app/actions/transactions";
import { checkChannelPartnerStatus } from "@/app/actions/channel_partners";
import type { OverviewData } from "../data/overviewMetrics";

export interface SourceFailure {
    source: "Businesses" | "Access keys" | "Transactions";
    message: string;
}

export type OverviewState =
    | { status: "loading" }
    | { status: "unauthorized"; message: string }
    | { status: "ready"; data: OverviewData; failures: SourceFailure[]; loadedAt: number };

/**
 * Loads everything the Overview needs in parallel. One source failing doesn't blank the page:
 * that source is returned as null and listed in `failures`.
 */
export function useOverviewData() {
    const [state, setState] = useState<OverviewState>({ status: "loading" });
    const [refreshing, setRefreshing] = useState(false);
    const requestId = useRef(0);

    const load = useCallback(async (initial: boolean) => {
        const id = ++requestId.current;
        if (initial) setState({ status: "loading" });
        else setRefreshing(true);

        try {
            const [businessesRes, keysRes, transactionsRes, partnerRes] = await Promise.allSettled([
                fetchAuthenticatedBusinesses(),
                fetchAuthenticatedAccessKeys(),
                fetchAuthenticatedTransactions(),
                checkChannelPartnerStatus(),
            ]);
            if (id !== requestId.current) return; // superseded or unmounted

            const failures: SourceFailure[] = [];
            let unauthorizedMessage: string | null = null;

            const data: OverviewData = {
                businesses: null,
                keys: null,
                transactions: null,
                isPartner: partnerRes.status === "fulfilled" ? partnerRes.value : false,
            };

            // Businesses
            if (businessesRes.status === "fulfilled" && businessesRes.value.success) {
                data.businesses = businessesRes.value.data;
            } else if (businessesRes.status === "fulfilled" && !businessesRes.value.success) {
                if (businessesRes.value.errorType === "UNAUTHORIZED") unauthorizedMessage = businessesRes.value.message;
                else failures.push({ source: "Businesses", message: businessesRes.value.message });
            } else {
                failures.push({ source: "Businesses", message: "Request failed." });
            }

            // Access keys (this action uses `error` rather than `message`)
            if (keysRes.status === "fulfilled" && keysRes.value.success) {
                data.keys = (keysRes.value.data ?? []) as AccessKey[];
            } else if (keysRes.status === "fulfilled") {
                if (keysRes.value.errorType === "UNAUTHORIZED") unauthorizedMessage ??= keysRes.value.error ?? null;
                else failures.push({ source: "Access keys", message: keysRes.value.error ?? "Request failed." });
            } else {
                failures.push({ source: "Access keys", message: "Request failed." });
            }

            // Transactions
            if (transactionsRes.status === "fulfilled" && transactionsRes.value.success) {
                data.transactions = transactionsRes.value.data;
            } else if (transactionsRes.status === "fulfilled" && !transactionsRes.value.success) {
                if (transactionsRes.value.errorType === "UNAUTHORIZED") unauthorizedMessage ??= transactionsRes.value.message;
                else failures.push({ source: "Transactions", message: transactionsRes.value.message });
            } else {
                failures.push({ source: "Transactions", message: "Request failed." });
            }

            if (unauthorizedMessage) {
                setState({ status: "unauthorized", message: unauthorizedMessage });
            } else {
                setState({ status: "ready", data, failures, loadedAt: Date.now() });
            }
        } finally {
            if (id === requestId.current) setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load(true);
        return () => { requestId.current++; }; // ignore results after unmount
    }, [load]);

    const reload = useCallback(() => load(false), [load]);
    const retryAll = useCallback(() => load(true), [load]);

    return { state, refreshing, reload, retryAll };
}