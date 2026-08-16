"use client";

/* ─────────────────────────────────────────────────────────────────
   <NewKeyModal />
   Phase router — single persistent shell, no stacked modals.

   Phase order:
     key-form
       → user clicks "Create" or "Create & Link"
       → payment (PaymentModal overlays)
       → on payment success → createStandaloneAccessKeyAction()
       → "Create"      → done
       → "Create & Link" → link-method → search-business | create-business
   ───────────────────────────────────────────────────────────────── */

import { useState } from "react";
import { createStandaloneAccessKeyAction } from "@/app/actions/accesskeys";
import { ModalShell } from "./ModalPrimitives";
import { KeyForm, type KeyFormValues } from "../phases/KeyForm";
import { LinkMethod } from "../phases/LinkMethod";
import { SearchBusiness } from "../phases/SearchBusiness";
import { PaymentModal } from "../../payment/PaymentModal";
import { BusinessWizard } from "../../business-wizard/index";
import type { AccessKey, Business } from "@/types/users.types";

type Phase =
    | "key-form"
    | "payment"
    | "link-method"
    | "search-business"
    | "create-business";

type AccessKeyPayload = {
    key_code: string;
    key_type: "TRIAL" | "LIFETIME";
    amount: number;
    deduct_trial_fee: boolean;
}

const STUB_KEY: AccessKey = {
    id: "", key_code: "", key_type: "TRIAL", is_active: false,
    activated_at: null, expires_at: null, amount: 0,
    deduct_trial_fee: false, created_on: ""
};

interface NewKeyModalProps {
    onClose: () => void;
    onKeyCreated: (payload: any) => Promise<void> | void;
    /**
     * When true, hides "Create & link to a business" button.
     * Used on the marketing/download page where no business context exists.
     */
    standalone?: boolean;
}

const PHASE_META: Partial<Record<Phase, { title: string; subtitle?: string }>> = {
    "key-form": { title: "New access key", subtitle: "Configure and generate a new access key." },
    "link-method": { title: "Link to a business", subtitle: "Choose how to link this key." },
    "search-business": { title: "Find existing business", subtitle: "Search by ID or name." },
};

export function NewKeyModal({ onClose, onKeyCreated, standalone = false }: NewKeyModalProps) {
    const [phase, setPhase] = useState<Phase>("key-form");
    const [pendingValues, setPendingValues] = useState<KeyFormValues | null>(null);
    const [pendingMode, setPendingMode] = useState<"create" | "link" | null>(null);
    const [createdKey, setCreatedKey] = useState<AccessKey | null>(null);
    const [creating, setCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleRequestCreate(values: KeyFormValues) {
        setPendingValues(values);
        setPendingMode("create");
        setPhase("payment");
    }

    function handleRequestCreateAndLink(values: KeyFormValues) {
        setPendingValues(values);
        setPendingMode("link");
        setPhase("payment");
    }

    async function handlePaymentSuccess(gatewayTxId: string) {
        if (!pendingValues || !pendingMode) return;
        setCreating(true);
        setErrorMessage(null);

        try {
            if (pendingMode === "create" || standalone) {
                const res = await createStandaloneAccessKeyAction({
                    key_code: pendingValues.key_code,
                    key_type: pendingValues.key_type,
                    amount: pendingValues.amount,
                    deduct_trial_fee: pendingValues.deduct_trial_fee,
                    payment_gateway_tx_id: gatewayTxId,
                });

                if (!res.success) {
                    setErrorMessage(res.message);
                    return;
                }

                const key = res.data;
                setCreatedKey(key);

                await onKeyCreated(key);
                if (!standalone) onClose();
            } else {

                if (standalone) {
                    onKeyCreated(null);
                    if (!standalone) onClose();
                } else {
                    setPhase("link-method");
                }
            }

        } finally {
            setCreating(false);
        }
    }

    function handleBusinessLinked(wizardPayload: any) {

        if (phase === "create-business") {
            // if (!createdKey) return;
            if (!pendingValues) return;
            // Cleaning up the payload to include only the necessary fields for the onKeyCreated callback
            const keyPayload: AccessKeyPayload = {
                key_code: pendingValues.key_code,
                key_type: pendingValues.key_type,
                amount: pendingValues.amount,
                deduct_trial_fee: pendingValues.deduct_trial_fee,
            }

            if (!wizardPayload || !keyPayload) return false;

            const isSelfOwned = Boolean(wizardPayload.my_business);

            const cleanPayload = {
                email: isSelfOwned ? "" : String(wizardPayload.user?.email || ""),
                phone: isSelfOwned ? "" : String(wizardPayload.user?.phone || ""),
                managerFullName: isSelfOwned
                    ? String(wizardPayload.business?.name + " Manager")
                    : String(wizardPayload.profile?.full_name || ""),
                managerDob: isSelfOwned
                    ? new Date().toISOString().split("T")[0]
                    : String(wizardPayload.profile?.date_of_birth || ""),
                managerCountry: String(wizardPayload.business?.country || "Not Specified"),
                managerCity: String(wizardPayload.profile?.region_city || "Not Specified"),
                businessName: String(wizardPayload.business?.name || ""),
                businessCountry: String(wizardPayload.business?.country || "Not Specified"),
                businessCity: String(wizardPayload.business?.region_city || "Not Specified"),
                key_code: String(keyPayload.key_code),
                key_type: keyPayload.key_type as "TRIAL" | "LIFETIME",
                amount: Number(keyPayload.amount),
                deduct_trial_fee: Boolean(keyPayload.deduct_trial_fee),
                isSelfOwned: isSelfOwned,
                businessId: String(wizardPayload.business?.id || null),
                isExistingBusiness: false, // Since this is a new business creation flow, we can set this to false
            };

            // Fallback for full name mapping of self-profile if present
            if (isSelfOwned && wizardPayload.profile?.full_name) {
                cleanPayload.managerFullName = wizardPayload.profile.full_name;
            }
            onKeyCreated(cleanPayload);
            onClose();
        } else if (phase === "search-business") {
            if (!pendingValues) return;

            const keyPayload: AccessKeyPayload = {
                key_code: pendingValues.key_code,
                key_type: pendingValues.key_type,
                amount: pendingValues.amount,
                deduct_trial_fee: pendingValues.deduct_trial_fee,
            };

            const cleanPayload = {
                key_code: String(keyPayload.key_code),
                key_type: keyPayload.key_type as "TRIAL" | "LIFETIME",
                amount: Number(keyPayload.amount),
                deduct_trial_fee: Boolean(keyPayload.deduct_trial_fee),
                isSelfOwned: false,
                businessId: String(wizardPayload?.id || null),
                isExistingBusiness: true
            };

            onKeyCreated(cleanPayload);
            onClose();
        } else {
            onKeyCreated(wizardPayload);
            onClose();
        }
    }

    if (phase === "create-business") {
        return (
            <BusinessWizard
                accessKey={STUB_KEY}
                onDone={(data: any) => handleBusinessLinked(data as any)}
                onBack={() => setPhase("link-method")}
                onClose={onClose}
            />
        );
    }

    if (phase === "payment" && pendingValues) {
        return (
            <PaymentModal
                onBeforePay={() => Promise.resolve(true)}
                keyType={pendingValues.key_type}
                amount={pendingValues.amount}
                onSuccess={handlePaymentSuccess}
                onClose={() => setPhase("key-form")}
            />
        );
    }

    const meta = PHASE_META[phase] ?? { title: "Access key" };

    return (
        <ModalShell
            title={meta.title}
            subtitle={meta.subtitle}
            onClose={onClose}
            onBack={phase === "search-business" ? () => setPhase("link-method") : undefined}
            width="500px"
        >
            {errorMessage && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-[13px] text-red-600 border border-red-200">
                    {errorMessage}
                </div>
            )}

            {phase === "key-form" && (
                <KeyForm
                    onRequestCreate={handleRequestCreate}
                    onRequestCreateAndLink={handleRequestCreateAndLink}
                    createOnlyMode={standalone}
                />
            )}

            {phase === "link-method" && !standalone && (
                <LinkMethod
                    createdKey={createdKey}
                    onSearchExisting={() => setPhase("search-business")}
                    onCreateNew={() => setPhase("create-business")}
                />
            )}

            {phase === "search-business" && !standalone && (
                <SearchBusiness
                    createdKey={STUB_KEY}
                    onLinked={(data: any) => handleBusinessLinked(data as any)}
                    onBack={() => setPhase("link-method")}
                />
            )}
        </ModalShell>
    );
}