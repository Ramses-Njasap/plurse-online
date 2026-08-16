"use client";

import { useState } from "react";
import { BusinessWizard } from "@/components/dashboard/my/business-wizard/index";
import { KeyForm, type KeyFormValues } from "@/components/dashboard/my/keys/phases/KeyForm";
import { PaymentModal } from "@/components/dashboard/my/payment/PaymentModal";
import { ModalShell } from "@/components/dashboard/my/keys/new-key-modal/ModalPrimitives";
import { provisionPendingBusinessAction, activateAccessKeyAction } from "@/app/actions/businesses";
import type { Business, AccessKey } from "@/types/users.types";

type Phase = "wizard" | "key-prompt" | "key-form" | "payment";

interface AddBusinessFlowProps {
    onDone: (business: Business, key?: AccessKey) => void;
    onClose: () => void;
}

const STUB_KEY: AccessKey = {
    id: "", key_code: "", key_type: "TRIAL", is_active: false,
    activated_at: null, expires_at: null, amount: 0,
    deduct_trial_fee: false, created_on: ""
};

export function AddBusinessFlow({ onDone, onClose }: AddBusinessFlowProps) {
    const [phase, setPhase] = useState<Phase>("wizard");

    // Aggregation buffers for multi-phase assembly
    const [wizardPayload, setWizardPayload] = useState<any>(null);
    const [keyPayload, setKeyPayload] = useState<KeyFormValues | null>(null);

    // Tracking database creation state before payment gateway returns
    const [liveBusiness, setLiveBusiness] = useState<Business | null>(null);
    const [liveKey, setLiveKey] = useState<AccessKey | null>(null);
    const [isSavingRecords, setIsSavingRecords] = useState(false);
    const [serverError, setServerError] = useState("");

    function handleWizardDone(collectedSteps: any) {
        setWizardPayload(collectedSteps);
        // setPhase("key-prompt"); // Skip key prompt and go directly to key form
        setPhase("key-form");
    }

    function handleKeyFormSubmit(values: KeyFormValues) {
        setKeyPayload(values);
        setPhase("payment");
    }

    /** Triggered directly when the PaymentModal initiates a pay trigger */
    async function handleInitiatePaymentRecords(): Promise<boolean> {
        if (!wizardPayload || !keyPayload) return false;
        if (liveBusiness && liveKey) return true; // Already saved to DB on a prior click/retry

        setIsSavingRecords(true);
        setServerError("");

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
            isSelfOwned: isSelfOwned
        };

        // Fallback for full name mapping of self-profile if present
        if (isSelfOwned && wizardPayload.profile?.full_name) {
            cleanPayload.managerFullName = wizardPayload.profile.full_name;
        }

        const result = await provisionPendingBusinessAction(cleanPayload);

        setIsSavingRecords(false);

        if (result.success) {
            setLiveBusiness(result.business);
            setLiveKey(result.accessKey);
            return true;
        } else {
            setServerError(result.message);
            return false;
        }
    }

    /** Triggered when the mobile network confirms cash collection successfully */
    async function handlePaymentSuccess(transactionId: string) {
        if (!liveKey || !liveBusiness) return;

        try {
            await activateAccessKeyAction(liveKey.id);
            const activeKey = { ...liveKey, is_active: true, activated_at: new Date().toISOString() };
            onDone(liveBusiness, activeKey);
        } catch {
            // Payment succeeded but updating the flag encountered a hiccup.
            // Pass it through anyway—it's linked, so the partner can re-verify it from the dashboard safely!
            onDone(liveBusiness, liveKey);
        }
    }

    /** User closes the modal or aborts mid-payment process */
    function handleFlowClose() {
        if (liveBusiness) {
            // If the records were already provisioned in the DB before they aborted payment,
            // call onDone anyway so the pending business pops up immediately on their dashboard list!
            onDone(liveBusiness, liveKey || undefined);
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
                onBeforePay={handleInitiatePaymentRecords} // Hook to run server action right at click time
                isPreparing={isSavingRecords}
                preflightError={serverError}
                onSuccess={handlePaymentSuccess}
                onClose={handleFlowClose}
            />
        );
    }

    return null;
}