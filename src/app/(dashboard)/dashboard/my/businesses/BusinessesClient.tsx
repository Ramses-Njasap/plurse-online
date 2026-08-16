"use client";

import { useState, useCallback, useEffect } from "react";
import type { Business, AccessKey } from "@/types/users.types";
import { useBusinessFilters } from "./hooks/useBusinessFilters";
import { BusinessesHeader } from "@/components/dashboard/my/businesses/BusinessesHeader";
import { BusinessesTable } from "@/components/dashboard/my/businesses/BusinessesTable";
import { ViewBusinessModal } from "@/components/dashboard/my/businesses/ViewBusinessModal";
import { DeleteBusinessModal } from "@/components/dashboard/my/businesses/DeleteBusinessModal";
import { DeleteBulkOffcanvas } from "@/components/dashboard/my/businesses/DeleteBulkOffcanvas";
import { AddBusinessFlow } from "@/components/dashboard/my/businesses/AddBusinessFlow";
import { fetchAuthenticatedBusinesses } from "@/app/actions/businesses";
import { deleteOrUnlinkBusinessAction, deleteOrUnlinkBusinessesBulkAction, type DeleteResult } from "@/app/actions/businesses";
import { upgradeAccessKeyToLifetimeAction } from "@/app/actions/accesskeys";
import { useToast } from "@/components/ui";
import { formatAmount } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
// TODO: fix this import path to wherever PaymentModal.tsx actually lives in your project.
// Based on its own relative import ("../keys/new-key-modal/ModalPrimitives"), it's a sibling
// of the "keys" folder under components/dashboard/my/ -- adjust the folder name below.
import { PaymentModal, type PaymentModalContext } from "@/components/dashboard/my/payment/PaymentModal";
import Link from "next/link";

const LIFETIME_UPGRADE_AMOUNT = 14500;

export function BusinessesClient() {
    const toast = useToast();

    // 1. Local state to manage the active, mutable dataset
    const [liveBusinesses, setLiveBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Track explicit error state for UI rendering
    const [authError, setAuthError] = useState<string | null>(null);

    // 2. Fetch data directly on mount
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await fetchAuthenticatedBusinesses();

            if (response.success) {
                setLiveBusinesses(response.data);
            } else {
                if (response.errorType === "UNAUTHORIZED") {
                    setAuthError(response.message);
                } else {
                    console.error(response.message);
                    toast.error(response.message, { title: "Couldn't load businesses" });
                }
            }

        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred while loading your businesses.", { title: "Couldn't load businesses" });
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const {
        filters, setFilter, resetFilters,
        page, setPage, totalPages, totalCount,
        paginated, allFiltered, countries, PAGE_SIZE,
    } = useBusinessFilters(liveBusinesses);

    /* ── Selection ── */
    const [multiSelectMode, setMultiSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    /* ── Modal / flow state ── */
    const [showAddFlow, setShowAddFlow] = useState(false);
    const [viewTarget, setViewTarget] = useState<Business | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
    const [bulkTargets, setBulkTargets] = useState<Business[] | null>(null);

    /* ── Trial -> Lifetime key upgrade ── */
    const [upgradeTarget, setUpgradeTarget] = useState<Business | null>(null);
    const [upgradePreflightError, setUpgradePreflightError] = useState("");

    /* ── Selection ── */
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
    function selectAllOnPage() {
        const allOnPage = paginated.map((b) => b.id);
        const allSelected = allOnPage.every((id) => selectedIds.has(id));
        setSelectedIds((prev) => {
            const next = new Set(prev);
            allOnPage.forEach((id) => allSelected ? next.delete(id) : next.add(id));
            return next;
        });
    }

    /* ── Bulk delete ── */
    function handleBulkDeleteClick() {
        const targets = allFiltered.filter((b) => selectedIds.has(b.id));
        if (targets.length === 1) setDeleteTarget(targets[0]);
        else setBulkTargets(targets);
    }

    /* ── CONFIRMED ACTION HANDLERS ── */

    const confirmSingleDelete = useCallback(async (b: Business) => {
        try {
            const result: DeleteResult = await deleteOrUnlinkBusinessAction(b.id);

            if (result.success) {
                if (result.action === "deleted") {
                    // Fully deleted (Case 2): Scrub from local component state
                    setLiveBusinesses((prev) => prev.filter((item) => item.id !== b.id));
                } else if (result.action === "unlinked") {
                    // Unlinked (Case 1): Locally modify state to reflect "from_company = true"
                    setLiveBusinesses((prev) =>
                        prev.map((item) => {
                            if (item.id === b.id && item.access_key) {
                                return {
                                    ...item,
                                    access_key: {
                                        ...item.access_key,
                                        from_company: true
                                    }
                                };
                            }
                            return item;
                        })
                    );
                }
                toast.success(result.message, { title: b.name });
            } else {
                toast.error(result.message, { title: "Operation failed" });
            }
        } catch (error) {
            console.error("Single delete client transaction issue:", error);
            toast.error("A critical system error occurred while updating the business status.", {
                title: "Something went wrong",
            });
        } finally {
            setDeleteTarget(null);
            setSelectedIds((prev) => { const n = new Set(prev); n.delete(b.id); return n; });
        }
    }, [toast]);

    const confirmBulkDelete = useCallback(async (ids: string[]) => {
        try {
            const results: DeleteResult[] = await deleteOrUnlinkBusinessesBulkAction(ids);

            const successfulDeletes = results.filter(r => r.success && r.action === "deleted").map(r => r.id);
            const successfulUnlinks = results.filter(r => r.success && r.action === "unlinked").map(r => r.id);
            const failures = results.filter(r => !r.success);

            // 1. Remove hard-deleted elements from local state array
            if (successfulDeletes.length > 0) {
                setLiveBusinesses((prev) => prev.filter((item) => !successfulDeletes.includes(item.id)));
            }

            // 2. Adjust property values of unlinked records in-place
            if (successfulUnlinks.length > 0) {
                setLiveBusinesses((prev) =>
                    prev.map((item) => {
                        if (successfulUnlinks.includes(item.id) && item.access_key) {
                            return {
                                ...item,
                                access_key: {
                                    ...item.access_key,
                                    from_company: true
                                }
                            };
                        }
                        return item;
                    })
                );
            }

            // 3. Report outcome as distinct toasts instead of one blended alert
            const summaryParts: string[] = [];
            if (successfulDeletes.length > 0) summaryParts.push(`${successfulDeletes.length} deleted`);
            if (successfulUnlinks.length > 0) summaryParts.push(`${successfulUnlinks.length} unlinked`);

            if (summaryParts.length > 0) {
                toast.success(summaryParts.join(" · "), { title: "Bulk action complete" });
            }

            if (failures.length > 0) {
                // One toast per failure so each business's specific reason stays visible and dismissible on its own.
                failures.forEach((f) => {
                    toast.error(f.message, { title: f.name });
                });
            }

            if (summaryParts.length === 0 && failures.length === 0) {
                toast.info("No records were updated.");
            }

        } catch (error) {
            console.error("Bulk delete client transaction issue:", error);
            toast.error("An unexpected exception occurred during the bulk modification request.", {
                title: "Bulk action failed",
            });
        } finally {
            setBulkTargets(null);
            setSelectedIds(new Set());
            setMultiSelectMode(false);
        }
    }, [toast]);

    /* ── Trial -> Lifetime key upgrade ── */

    function handleUpgradeKeyClick(b: Business) {
        setUpgradePreflightError("");
        setUpgradeTarget(b);
    }

    // Runs right when the user hits "Pay" inside the modal. Re-checks against the latest
    // local state in case the key stopped being eligible between opening the modal and
    // actually paying (e.g. it was upgraded from another tab, or unlinked in the meantime).
    const handleUpgradeBeforePay = useCallback(async () => {
        const current = liveBusinesses.find((item) => item.id === upgradeTarget?.id);
        const stillEligible = !!current?.access_key && current.access_key.key_type === "TRIAL";

        if (!stillEligible) {
            setUpgradePreflightError("This key is no longer eligible for a Lifetime upgrade.");
        }
        return stillEligible;
    }, [liveBusinesses, upgradeTarget]);

    // Runs after the (mock) payment succeeds. Persists the upgrade server-side, then reflects
    // it locally without needing a full refetch.
    const handleUpgradeSuccess = useCallback(async (transactionId: string) => {
        const business = upgradeTarget;
        const keyId = business?.access_key?.id;

        if (!business || !keyId) {
            setUpgradeTarget(null);
            return;
        }

        try {
            const result = await upgradeAccessKeyToLifetimeAction(keyId, transactionId);

            if (result.success) {
                setLiveBusinesses((prev) =>
                    prev.map((item) =>
                        item.id === business.id && item.access_key
                            ? { ...item, access_key: { ...item.access_key, key_type: "LIFETIME", expires_at: null } }
                            : item
                    )
                );
                toast.success(`"${business.name}"'s access key is now Lifetime.`, { title: "Upgrade complete" });
            } else {
                toast.error(result.message, { title: "Upgrade didn't save" });
            }
        } catch (error) {
            console.error("Key upgrade client transaction issue:", error);
            toast.error("Payment succeeded, but we couldn't confirm the upgrade. Please refresh and check.", {
                title: "Something went wrong",
            });
        } finally {
            setUpgradeTarget(null);
        }
    }, [upgradeTarget, toast]);

    const upgradeContext: PaymentModalContext | undefined = upgradeTarget
        ? {
            titles: {
                idle: "Upgrade to Lifetime",
                success: "Key upgraded",
            },
            subtitles: {
                idle: `Pay ${formatAmount(LIFETIME_UPGRADE_AMOUNT)} to upgrade "${upgradeTarget.name}" to a Lifetime access key.`,
                success: "Your access key has been upgraded to Lifetime.",
            },
            amountBanner: {
                label: "Upgrade amount",
                badgeText: "Lifetime key",
            },
            successMessage: "Updating your business record…",
        }
        : undefined;

    /* ── Add business flow done ── */
    function handleAddDone(business: Business, key?: AccessKey) {
        setShowAddFlow(false);
        setLiveBusinesses((prev) => [business, ...prev]);
        toast.success(`"${business.name}" was added to your businesses.`, { title: "Business created" });
    }

    /* ── Edit stub ── */
    function handleEdit(b: Business) {}

    if (isLoading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                <p className="text-sm font-medium text-gray-500">Retrieving secure business records...</p>
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
                <BusinessesHeader
                    filters={filters}
                    totalCount={totalCount}
                    selectedCount={selectedIds.size}
                    multiSelectMode={multiSelectMode}
                    countries={countries}
                    onFilterChange={setFilter}
                    onResetFilters={resetFilters}
                    onToggleMultiSelect={toggleMultiSelect}
                    onBulkDelete={handleBulkDeleteClick}
                    onAddBusiness={() => setShowAddFlow(true)}
                />

                <BusinessesTable
                    businesses={paginated}
                    page={page}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    multiSelectMode={multiSelectMode}
                    selectedIds={selectedIds}
                    onSelectOne={selectOne}
                    onSelectAll={selectAllOnPage}
                    onPageChange={setPage}
                    onView={setViewTarget}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    onUpgradeKey={handleUpgradeKeyClick}
                />
            </div>

            {/* Add business flow */}
            {showAddFlow && (
                <AddBusinessFlow
                    onDone={handleAddDone}
                    onClose={() => setShowAddFlow(false)}
                />
            )}

            {/* View modal */}
            {viewTarget && (
                <ViewBusinessModal
                    business={viewTarget}
                    onClose={() => setViewTarget(null)}
                    onEdit={(b) => { setViewTarget(null); handleEdit(b); }}
                />
            )}

            {/* Single delete */}
            {deleteTarget && (
                <DeleteBusinessModal
                    business={deleteTarget}
                    onConfirm={confirmSingleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Bulk delete */}
            {bulkTargets && (
                <DeleteBulkOffcanvas
                    businesses={bulkTargets}
                    onConfirm={confirmBulkDelete}
                    onCancel={() => setBulkTargets(null)}
                />
            )}

            {/* Trial -> Lifetime key upgrade payment */}
            {upgradeTarget?.access_key && (
                <PaymentModal
                    amount={LIFETIME_UPGRADE_AMOUNT}
                    onBeforePay={handleUpgradeBeforePay}
                    onSuccess={handleUpgradeSuccess}
                    preflightError={upgradePreflightError}
                    onClose={() => setUpgradeTarget(null)}
                    context={upgradeContext}
                />
            )}
        </>
    );
}