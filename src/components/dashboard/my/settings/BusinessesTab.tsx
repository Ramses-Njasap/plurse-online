// src/components/dashboard/my/settings/BusinessesTab.tsx

"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { Business } from "@/types/users.types";
import { useToast } from "@/components/ui";
import { BusinessesGrid } from "./businesses/BusinessesGrid";
import { BusinessesList } from "./businesses/BusinessesList";
import { BusinessesPagination } from "./businesses/BusinessesPagination";
import { BusinessDetailPanel } from "./businesses/BusinessDetailPanel";
import { BusinessesToolbar, type RoleFilter, type ViewMode } from "./businesses/BusinessesToolbar";
import { usePagination } from "./businesses/usePagination";
import {
    getRole,
    type BusinessEditablePatch, type UpdateBusinessFn, type UpdateBusinessResult,
} from "./businesses/businessUtils";

/** Page sizes per layout. The first value is the default. */
const PAGE_SIZES: Record<ViewMode, number[]> = {
    grid: [6, 12, 24],
    list: [10, 20, 50],
};

interface BusinessesTabProps {
    businesses: Business[];
    /** Persists an edit (the updateBusinessAction server action). Required for edits to reach the database. */
    onUpdateBusiness: UpdateBusinessFn;
}

export default function BusinessesTab({ businesses, onUpdateBusiness }: BusinessesTabProps) {
    const toast = useToast();

    const [items, setItems] = useState<Business[]>(businesses);
    useEffect(() => setItems(businesses), [businesses]);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState<RoleFilter>("all");
    const [view, setView] = useState<ViewMode>("grid");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const listTopRef = useRef<HTMLDivElement>(null);

    /* Derive from the live list so the panel reflects saved edits */
    const selected = selectedId ? items.find((b) => b.id === selectedId) ?? null : null;

    /* The query has no ORDER BY, so sort here to keep pages stable: newest first */
    const sorted = useMemo(
        () => [...items].sort((a, b) => (b.created_on ?? "").localeCompare(a.created_on ?? "")),
        [items]
    );

    const counts = useMemo<Record<RoleFilter, number>>(() => ({
        all: items.length,
        owner: items.filter((b) => getRole(b) === "owner").length,
        partner: items.filter((b) => getRole(b) === "partner").length,
    }), [items]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return sorted.filter((b) => {
            if (role !== "all" && getRole(b) !== role) return false;
            if (!q) return true;
            return [b.name, b.business_code, b.region_city, b.country, b.manager_profile?.full_name]
                .some((v) => v?.toLowerCase().includes(q));
        });
    }, [sorted, search, role]);

    const {
        page, setPage, resetPage, pageSize, setPageSize,
        totalPages, totalCount, startIndex, endIndex, paged,
    } = usePagination(filtered, PAGE_SIZES.grid[0]);

    /* Filters and layout changes always return to the first page */
    function handleSearchChange(v: string) { setSearch(v); resetPage(); }
    function handleRoleChange(r: RoleFilter) { setRole(r); resetPage(); }
    function handleViewChange(v: ViewMode) {
        setView(v);
        setPageSize(PAGE_SIZES[v][0]);
    }

    function handlePageChange(p: number) {
        setPage(p);
        listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const handleUpdate = useCallback(async (id: string, patch: BusinessEditablePatch): Promise<UpdateBusinessResult> => {
        try {
            const result = await onUpdateBusiness(id, patch);

            if (result.success) {
                // Prefer what the server actually saved (trimmed values and the trigger-set timestamp)
                const saved = result.saved ?? patch;
                const updatedOn = result.updated_on ?? new Date().toISOString();
                setItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...saved, updated_on: updatedOn } : b)));
                toast.success(result.message ?? "Your changes were saved.", { title: saved.name });
            } else {
                toast.error(result.message ?? "We couldn't save your changes.", { title: "Update failed" });
            }
            return result;
        } catch (error) {
            console.error("Business update client issue:", error);
            toast.error("An unexpected error occurred while saving.", { title: "Something went wrong" });
            return { success: false, message: "An unexpected error occurred while saving." };
        }
    }, [onUpdateBusiness, toast]);

    return (
        <div className="space-y-5">
            <p className="text-[13px]" style={{ color: "var(--text-subtle)" }}>
                Businesses owned by you or managed under your channel partnership.
            </p>

            {items.length > 0 && (
                <BusinessesToolbar
                    search={search}
                    onSearchChange={handleSearchChange}
                    role={role}
                    onRoleChange={handleRoleChange}
                    counts={counts}
                    showLayoutControls={items.length > PAGE_SIZES.grid[0]}
                    view={view}
                    onViewChange={handleViewChange}
                    pageSize={pageSize}
                    pageSizeOptions={PAGE_SIZES[view]}
                    onPageSizeChange={setPageSize}
                />
            )}

            <div ref={listTopRef} className="scroll-mt-4">
                {items.length === 0 ? (
                    <EmptyState>No businesses linked to this account yet.</EmptyState>
                ) : totalCount === 0 ? (
                    <EmptyState>No businesses match your search.</EmptyState>
                ) : (
                    /* Re-keying on view + page replays the staggered reveal */
                    <div key={`${view}:${page}`}>
                        {view === "grid" ? (
                            <BusinessesGrid businesses={paged} onOpen={(b) => setSelectedId(b.id)} />
                        ) : (
                            <BusinessesList businesses={paged} onOpen={(b) => setSelectedId(b.id)} />
                        )}
                    </div>
                )}
            </div>

            <BusinessesPagination
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={handlePageChange}
            />

            {selected && (
                <BusinessDetailPanel
                    business={selected}
                    onClose={() => setSelectedId(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border p-10 text-center" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-[13px]" style={{ color: "var(--text-subtle)" }}>{children}</p>
        </div>
    );
}