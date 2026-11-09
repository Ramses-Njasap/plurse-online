"use client";

import { useState, useCallback, useRef } from "react";

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

export function useTabCache<T>(
    fetchFn: () => Promise<{ success: boolean; data?: T; message?: string }>,
    ttlMs: number = 5 * 60 * 1000 // 5 minutes persistence
) {
    const cacheRef = useRef<CacheItem<T> | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async (forceRefresh = false) => {
        const now = Date.now();

        // Serve from memory cache if within TTL window
        if (!forceRefresh && cacheRef.current && (now - cacheRef.current.timestamp < ttlMs)) {
            setData(cacheRef.current.data);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchFn();
            if (result.success && result.data) {
                cacheRef.current = { data: result.data, timestamp: Date.now() };
                setData(result.data);
            } else {
                setError(result.message || "Failed to fetch data.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }, [fetchFn, ttlMs]);

    const invalidate = useCallback(() => {
        cacheRef.current = null;
    }, []);

    return { data, loading, error, loadData, invalidate };
}