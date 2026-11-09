// src/components/dashboard/my/settings/businesses/usePagination.ts

"use client";

import { useState, useMemo, useCallback } from "react";

/** Client-side pagination over an already filtered list. */
export function usePagination<T>(items: T[], initialPageSize: number) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSizeState] = useState(initialPageSize);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    /* Clamp so deleting/filtering never leaves us on a page that no longer exists */
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, items.length);

    const paged = useMemo(() => items.slice(startIndex, startIndex + pageSize), [items, startIndex, pageSize]);

    const setPageSize = useCallback((n: number) => {
        setPageSizeState(n);
        setPage(1);
    }, []);

    const resetPage = useCallback(() => setPage(1), []);

    return {
        page: safePage, setPage, resetPage,
        pageSize, setPageSize,
        totalPages, totalCount: items.length,
        startIndex, endIndex, paged,
    };
}