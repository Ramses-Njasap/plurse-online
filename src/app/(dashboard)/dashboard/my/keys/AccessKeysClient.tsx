// src/app/(dashboard)/dashboard/my/keys/AccessKeysClient.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import type { AccessKey } from "@/types/users.types";
import { useKeyFilters } from "./hooks/useKeyFilters";
import { KeysHeader } from "@/components/dashboard/my/keys/KeysHeader";
import { KeysTable } from "@/components/dashboard/my/keys/KeysTable";
import { DeleteSingleModal } from "@/components/dashboard/my/keys/DeleteSingleModal";
import { DeleteBulkOffcanvas } from "@/components/dashboard/my/keys/DeleteBulkOffcanvas";
import { NewKeyModal } from "@/components/dashboard/my/keys/new-key-modal";
import { fetchAuthenticatedAccessKeys, deleteAccessKeysBulkAction, deleteAccessKeyAction, linkBusinessToAccessKeyAction, type KeyDeleteResult } from "@/app/actions/accesskeys";
import { provisionPendingBusinessActionV2 } from "@/app/actions/businesses";
import { useToast } from "@/components/ui";
import Link from "next/link";


export function AccessKeysClient() {
    const toast = useToast();

    const [dbKeys, setDbKeys] = useState<AccessKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    // Fetch key records dynamically on mount
    const loadKeys = useCallback(async () => {
        setIsLoading(true);
        setAuthError(null);
        try {
            // No parameter passed, fetched securely via the server-side action session
            const response = await fetchAuthenticatedAccessKeys();
            if (response.success && response.data) {
                setDbKeys(response.data as AccessKey[]);
            } else {
                if (response.errorType === "UNAUTHORIZED") {
                    setAuthError(response.error || "Session expired.");
                } else {
                    console.error(response.error);
                }
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadKeys();
    }, [loadKeys]);

    const {
        filters, setFilter, resetFilters,
        page, setPage, totalPages, totalCount, paginated, allFiltered, PAGE_SIZE,
    } = useKeyFilters(dbKeys);

    /* ── Selection state ── */
    const [multiSelectMode, setMultiSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    /* ── Modal / offcanvas state ── */
    const [deleteTarget, setDeleteTarget] = useState<AccessKey | null>(null);
    const [bulkTargets, setBulkTargets] = useState<AccessKey[] | null>(null);
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);

    /* ── Selection handlers ── */
    function toggleMultiSelect() {
        setMultiSelectMode((m) => !m);
        setSelectedIds(new Set());
    }

    function selectOne(id: string) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    // function selectAllOnPage() {
    //     const allOnPage = paginated.map((k) => k.id);
    //     const allSelected = allOnPage.every((id) => selectedIds.has(id));
    //     setSelectedIds((prev) => {
    //         const next = new Set(prev);
    //         allOnPage.forEach((id) => allSelected ? next.delete(id) : next.add(id));
    //         return next;
    //     });
    // }

    function selectAllOnPage() {
        // 1. Filter the current page's keys to only include those the user directly owns
        const selectableKeysOnPage = paginated.filter(
            (k) => !(k.channel_partner_id && k.from_company === false)
        );
        const selectableIds = selectableKeysOnPage.map((k) => k.id);

        if (selectableIds.length === 0) return; // Nothing on this page can be selected

        // 2. Check if all selectable keys on this page are already checked
        const allSelectableOnPageChecked = selectableIds.every((id) => selectedIds.has(id));

        setSelectedIds((prev) => {
            const next = new Set(prev);
            selectableIds.forEach((id) => {
                if (allSelectableOnPageChecked) {
                    next.delete(id); // Deselect all selectable keys on the page
                } else {
                    next.add(id);    // Select all selectable keys on the page
                }
            });
            return next;
        });
    }

    /* ── Delete triggers ── */
    function handleRowDelete(k: AccessKey) {
        setDeleteTarget(k);
    }

    function handleBulkDeleteClick() {
        const targets = allFiltered.filter((k) => selectedIds.has(k.id));
        if (targets.length === 1) {
            setDeleteTarget(targets[0]);
        } else {
            setBulkTargets(targets);
        }
    }

    // const confirmSingleDelete = useCallback(async (k: AccessKey) => {
    //     console.log("Delete single key from DB:", k.id);
    //     setDeleteTarget(null);
    //     setSelectedIds((prev) => { const n = new Set(prev); n.delete(k.id); return n; });
    //     await loadKeys();
    // }, [loadKeys]);

    const confirmSingleDelete = useCallback(async (k: AccessKey) => {
        try {
            // 1. Dispatch the request to your server action
            const result: KeyDeleteResult = await deleteAccessKeyAction(k.id);

            if (result.success) {
                // 2. Success: Filter out the deleted key from local component state dynamically
                setDbKeys((prev) => prev.filter((item) => item.id !== k.id));

                toast.success(result.message, {
                    title: "Key Deleted"
                });
            } else {
                // 3. Handle specific validation failures
                if (result.errorType === "UNAUTHORIZED") {
                    // If the user's session expired, drop them into the fallback view
                    setAuthError(result.message);
                } else {
                    // For business rule violations (e.g. attempting to delete unowned keys)
                    toast.error(result.message, {
                        title: "Operation Failed"
                    });
                }
            }
        } catch (error) {
            // 4. Catch unexpected system or network exceptions
            console.error("Single key delete client transaction issue:", error);
            toast.error("A critical system error occurred while updating the access key status.", {
                title: "Something went wrong",
            });
        } finally {
            // Always close out modal overlays and clear row selectors
            setDeleteTarget(null);
            setSelectedIds((prev) => {
                const n = new Set(prev);
                n.delete(k.id);
                return n;
            });
        }
    }, [toast]);

    // const confirmBulkDelete = useCallback(async (ids: string[]) => {
    //     console.log("Bulk delete keys from DB:", ids);
    //     setBulkTargets(null);
    //     setSelectedIds(new Set());
    //     setMultiSelectMode(false);
    //     await loadKeys();
    // }, [loadKeys]);

    const confirmBulkDelete = useCallback(async (ids: string[]) => {
        try {
            // 1. Dispatch the bulk action to the server layer
            const results: KeyDeleteResult[] = await deleteAccessKeysBulkAction(ids);

            // 2. Separate successful outcomes from failures
            const successfulDeletes = results.filter(r => r.success).map(r => r.id);
            const failures = results.filter(r => !r.success);

            // 3. Scrub successfully deleted items from local state in a single sweep
            if (successfulDeletes.length > 0) {
                setDbKeys((prev) => prev.filter((item) => !successfulDeletes.includes(item.id)));

                toast.success(`${successfulDeletes.length} access key(s) successfully removed.`, {
                    title: "Bulk action complete"
                });
            }

            // 4. Report specific business rule failures using individual toasts
            if (failures.length > 0) {
                failures.forEach((f) => {
                    // If any failure is due to expired auth, trigger global re-auth state
                    if (f.errorType === "UNAUTHORIZED") {
                        setAuthError(f.message);
                    } else {
                        toast.error(f.message, { title: "Deletion Denied" });
                    }
                });
            }

            if (successfulDeletes.length === 0 && failures.length === 0) {
                toast.info("No records were updated.");
            }

        } catch (error) {
            console.error("Bulk key delete client transaction issue:", error);
            toast.error("An unexpected exception occurred during the bulk modification request.", {
                title: "Bulk action failed",
            });
        } finally {
            // Clean up UI layouts and selection structures
            setBulkTargets(null);
            setSelectedIds(new Set());
            setMultiSelectMode(false);
        }
    }, [toast]);

    if (isLoading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                <p className="text-sm font-medium text-gray-500">Retrieving secure access keys...</p>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center my-12">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Session Expired</h3>
                <p className="mt-2 text-sm text-gray-500">{authError}</p>
                <div className="mt-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                        Sign Back In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-5">
                <KeysHeader
                    filters={filters}
                    totalCount={totalCount}
                    selectedCount={selectedIds.size}
                    multiSelectMode={multiSelectMode}
                    onFilterChange={setFilter}
                    onResetFilters={resetFilters}
                    onToggleMultiSelect={toggleMultiSelect}
                    onBulkDelete={handleBulkDeleteClick}
                    onAddKey={() => setShowNewKeyModal(true)}
                />

                <KeysTable
                    keys={paginated}
                    page={page}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    multiSelectMode={multiSelectMode}
                    selectedIds={selectedIds}
                    onSelectOne={selectOne}
                    onSelectAll={selectAllOnPage}
                    onPageChange={setPage}
                    onView={(k) => {}}
                    onEdit={(k) => {}}
                    onDelete={handleRowDelete}
                />
            </div>

            {deleteTarget && (
                <DeleteSingleModal
                    keyItem={deleteTarget}
                    onConfirm={confirmSingleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {bulkTargets && (
                <DeleteBulkOffcanvas
                    keys={bulkTargets}
                    onConfirm={confirmBulkDelete}
                    onCancel={() => setBulkTargets(null)}
                />
            )}

            {showNewKeyModal && (
                <NewKeyModal
                    onClose={() => setShowNewKeyModal(false)}
                    onKeyCreated={async (payload) => {
                        try {
                            // 1. Execute the server action to persist the creation/linking in the DB
                            if (payload) {
                                if (!payload.isExistingBusiness) {
                                    const res = await provisionPendingBusinessActionV2(payload);

                                    if (!res.success) {
                                        toast.error(res.message || "Failed to link business to key.", {
                                            title: "Linking Error",
                                        });
                                        return;
                                    }

                                    // 2. Re-fetch fresh table records from the server
                                    await loadKeys();

                                    // 3. Feedback toast
                                    toast.success(
                                        res.business && res.business.name
                                            ? `Key ${res.accessKey.key_code} successfully linked to ${res.business.name}.`
                                            : `Key ${res.accessKey.key_code} created successfully.`,
                                        { title: "Operation Complete" }
                                    );
                                } else {
                                    const res = await linkBusinessToAccessKeyAction(payload);

                                    if (!res.success) {
                                        toast.error(res.message || "Failed to link business to key.", {
                                            title: "Linking Error",
                                        });
                                        return;
                                    }

                                    // 2. Re-fetch fresh table records from the server
                                    await loadKeys();

                                    // 3. Feedback toast
                                    toast.success(
                                        res.data && res.data.name
                                            ? `Key ${res.data?.access_key?.key_code} successfully linked to ${res.data.name}.`
                                            : `Key ${res.data?.access_key?.key_code} created successfully.`,
                                        { title: "Operation Complete" }
                                    );
                                }
                            } else {
                                toast.error("No payload returned from the key creation workflow.", {
                                    title: "Unexpected Error",
                                });
                            }
                        } catch (error) {
                            console.error("Error finalizing key/business workflow:", error);
                            toast.error("An unexpected error occurred while completing the request.", {
                                title: "Action Failed",
                            });
                        }
                    }}
                />
            )}
        </>
    );
}