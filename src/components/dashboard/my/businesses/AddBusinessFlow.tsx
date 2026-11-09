// app/components/dashboard/my/businesses/AddBusinessFlow.tsx

"use client";

import { useRef, useState } from "react";
import { BusinessWizard } from "@/components/dashboard/my/business-wizard/index";
import { KeyForm, type KeyFormValues } from "@/components/dashboard/my/keys/phases/KeyForm";
import { PaymentModal } from "@/components/dashboard/my/payment/PaymentModal";
import { ModalShell } from "@/components/dashboard/my/keys/new-key-modal/ModalPrimitives";
import {
    finalizeBusinessProvisioningActionOnFailure,
    finalizeBusinessProvisioningActionOnSuccess,
    provisionPendingBusinessActionV2,
} from "@/app/actions/businesses";
import type { Business, AccessKey } from "@/types/users.types";
import { useToast } from "@/components/ui";

type Phase = "wizard" | "key-prompt" | "key-form" | "payment";

interface AddBusinessFlowProps {
    onDone: (business: Business, key?: AccessKey) => void;
    onClose: () => void;
}

const STUB_KEY: AccessKey = {
    id: "",
    key_code: "",
    key_type: "TRIAL",
    is_active: false,
    activated_at: null,
    expires_at: null,
    amount: 0,
    deduct_trial_fee: false,
    created_on: "",
};

export function AddBusinessFlow({ onDone, onClose }: AddBusinessFlowProps) {
    const toast = useToast();
    const [phase, setPhase] = useState<Phase>("wizard");

    // Aggregation buffers for multi-phase assembly
    const [wizardPayload, setWizardPayload] = useState<any>(null);
    const [keyPayload, setKeyPayload] = useState<KeyFormValues | null>(null);

    // Tracking database creation state before payment gateway returns
    const [liveBusiness, setLiveBusiness] = useState<Business | null>(null);
    const [liveKey, setLiveKey] = useState<AccessKey | null>(null);
    const [liveTransactionId, setLiveTransactionId] = useState<string | null>(null);

    // ── Refs mirroring the live state ──
    // These are read by async callbacks (payment success/failure, retry guard)
    // because closures captured before a re-render would otherwise see `null`.
    const liveBusinessRef = useRef<Business | null>(null);
    const liveKeyRef = useRef<AccessKey | null>(null);
    const liveTransactionIdRef = useRef<string | null>(null);

    const [isSavingRecords, setIsSavingRecords] = useState(false);
    const [serverError, setServerError] = useState("");

    function handleWizardDone(collectedSteps: any) {
        setWizardPayload(collectedSteps);
        setPhase("key-form");
    }

    function handleKeyFormSubmit(values: KeyFormValues) {
        setKeyPayload(values);
        setPhase("payment");
    }

    /** Triggered directly when the PaymentModal initiates a pay trigger */
    async function handleInitiatePaymentRecords(): Promise<boolean> {
        if (!wizardPayload || !keyPayload) return false;

        // Already saved to DB on a prior click/retry — read via refs so we see
        // the latest values even inside a stale closure.
        if (liveBusinessRef.current && liveKeyRef.current) return true;

        setIsSavingRecords(true);
        setServerError("");

        const isSelfOwned = Boolean(wizardPayload.my_business);
        console.log("Initiating payment records with wizardPayload:", wizardPayload, "and keyPayload:", keyPayload, "isSelfOwned:", isSelfOwned);

        const cleanPayload = {
            email: isSelfOwned ? "" : String(wizardPayload.user?.email || ""),
            phone: isSelfOwned ? "" : String(wizardPayload.user?.phone || ""),
            managerFullName: String(wizardPayload.business?.name + " Manager"),
            managerDob: new Date().toISOString().split("T")[0],
            managerCountry: String(wizardPayload.business?.country || "Not Specified"),
            managerCity: String(wizardPayload.profile?.region_city || "Not Specified"),
            businessName: String(wizardPayload.business?.name || wizardPayload.profile?.full_name + " Business" || "Unnamed Business"),
            businessCountry: String(wizardPayload.business?.country || "Not Specified"),
            businessCity: String(wizardPayload.business?.region_city || "Not Specified"),
            key_code: String(keyPayload.key_code),
            key_type: keyPayload.key_type as "TRIAL" | "LIFETIME",
            amount: Number(keyPayload.amount),
            deduct_trial_fee: Boolean(keyPayload.deduct_trial_fee),
            isSelfOwned: isSelfOwned,
            transactionTarget: "access_keys" as const,
        };

        const result = await provisionPendingBusinessActionV2(cleanPayload);
        console.log("Provisioning result:", result);

        setIsSavingRecords(false);

        if (result.success && result.business && result.accessKey && result.transactionId) {
            // Sync BOTH state (for rendering) and refs (for async callbacks).
            setLiveBusiness(result.business);
            setLiveKey(result.accessKey);
            setLiveTransactionId(result.transactionId);

            liveBusinessRef.current = result.business;
            liveKeyRef.current = result.accessKey;
            liveTransactionIdRef.current = result.transactionId;

            return true;
        }

        if (!result.success && result.message) {
            const txId = liveTransactionIdRef.current;
            if (txId) {
                await finalizeBusinessProvisioningActionOnFailure(txId, result.message);
            }
            // setServerError(result.message);
            toast.error(result.message, { title: "Provisioning Error" });
            onClose();
            return false;
        }

        const txId = liveTransactionIdRef.current;
        if (txId) {
            await finalizeBusinessProvisioningActionOnFailure(txId, "An unknown error occurred while saving records.");
        }
        // setServerError("An unknown error occurred while saving records.");
        toast.error("An unknown error occurred while saving records.", { title: "Provisioning Error" });
        onClose();
        return false;
    }

    /** Triggered when the mobile network confirms cash collection successfully */
    async function handlePaymentSuccess(gatewayTransactionId: string) {
        // Read the latest values from refs — NOT from the closure state, which
        // was captured before `handleInitiatePaymentRecords` ran its setState
        // calls. That stale closure was the root cause of the
        // `Live key and business state before finalization: null null null` log.
        const biz = liveBusinessRef.current;
        const key = liveKeyRef.current;
        const txId = liveTransactionIdRef.current;

        console.log("Payment success callback received with gateway transaction ID:", gatewayTransactionId);
        console.log("Live key and business state before finalization:", key, biz, txId);

        if (!biz || !key) return;

        try {
            if (key.id && txId) {
                console.log("Finalizing business provisioning with key ID:", key.id, "and transaction ID:", txId);
                const res = await finalizeBusinessProvisioningActionOnSuccess(key.id, txId);

                if (!res.success) {
                    console.error("Failed to activate access key after payment:", res.message);
                }

                const activeKey: AccessKey = {
                    ...key,
                    is_active: true,
                    activated_at: new Date().toISOString(),
                };
                onDone(biz, activeKey);
            } else {
                console.error("Missing liveKey.id or liveTransactionId for finalization.");
                onDone(biz, key);
            }
        } catch (err) {
            console.error("Error finalizing business provisioning:", err);
            onDone(biz, key);
        }
    }

    /** User closes the modal or aborts mid-payment process */
    function handleFlowClose() {
        // Read from refs for the same closure-safety reason.
        const biz = liveBusinessRef.current;
        const key = liveKeyRef.current;

        if (biz) {
            onDone(biz, key || undefined);
        } else {
            onClose();
        }
    }

    /* ── Phase Handlers ── */
    if (phase === "wizard") {
        return (
            <BusinessWizard
                accessKey={STUB_KEY}
                onDone={handleWizardDone}
                onBack={onClose}
                onClose={onClose}
            />
        );
    }

    if (phase === "key-form") {
        return (
            <ModalShell
                title="Create access key"
                subtitle="Configure a key to link to this business."
                onClose={onClose}
                onBack={() => setPhase("wizard")}
                width="500px"
            >
                <KeyForm
                    createOnlyMode
                    onRequestCreate={handleKeyFormSubmit}
                    onRequestCreateAndLink={handleKeyFormSubmit}
                />
            </ModalShell>
        );
    }

    if (phase === "payment" && keyPayload) {
        return (
            <PaymentModal
                keyType={keyPayload.key_type}
                amount={keyPayload.amount}
                onBeforePay={handleInitiatePaymentRecords}
                isPreparing={isSavingRecords}
                preflightError={serverError}
                onSuccess={handlePaymentSuccess}
                onClose={handleFlowClose}
            />
        );
    }

    return null;
}