"use client";

/* ─────────────────────────────────────────────────────────────────
   <BusinessWizard />
   Changes vs previous version:
   1. All step field values lifted to wizard state — back navigation
      never wipes data the user already entered.
   2. Step 1 now includes a "This is my business" toggle. When set,
      the wizard jumps directly from step 1 → step 3 (skips step 2).
   3. WizardFullData now includes `my_business: boolean`.
   4. No existing functionality removed.
   ───────────────────────────────────────────────────────────────── */

import { useState } from "react";
import type { UserAccount, UserProfile, AccessKey } from "@/types/users.types";
import { ModalShell } from "../keys/new-key-modal/ModalPrimitives";
import { Step1Credentials } from "./steps/Step1Credentials";
import { Step2ManagerProfile } from "./steps/Step2ManagerProfile";
import {
    Step3BusinessProfile,
    type WizardFullData,
} from "./steps/Step3BusinessProfile";

type WizardStep = 1 | 2 | 3;

interface BusinessWizardProps {
    accessKey: AccessKey;
    hideKeyInfo?: boolean;
    onDone: (data: WizardFullData) => void;
    onBack: () => void;
    onClose: () => void;
}

const TITLES: Record<WizardStep, { title: string; subtitle: string }> = {
    1: { title: "Manager account", subtitle: "Create the login credentials for the business manager." },
    2: { title: "Manager profile", subtitle: "Personal details for the business manager." },
    3: { title: "Business profile", subtitle: "Register the business and link the access key." },
};

export function BusinessWizard({
    accessKey,
    hideKeyInfo = false,
    onDone,
    onBack,
    onClose,
}: BusinessWizardProps) {
    const [step, setStep] = useState<WizardStep>(1);

    /* ── Lifted step-1 state ── */
    const [s1Email, setS1Email] = useState("");
    const [s1Phone, setS1Phone] = useState("");
    const [s1IsMyBusiness, setS1IsMyBusiness] = useState(false);

    /* ── Lifted step-2 state ── */
    const [s2FullName, setS2FullName] = useState("");
    const [s2Dob, setS2Dob] = useState("");
    const [s2Country, setS2Country] = useState("");
    const [s2RegionCity, setS2RegionCity] = useState("");

    /* ── Lifted step-3 state ── */
    const [s3Name, setS3Name] = useState("");
    const [s3Country, setS3Country] = useState("");
    const [s3RegionCity, setS3RegionCity] = useState("");

    /* ── Created entities (held so step3 can reference them) ── */
    const [createdUser, setCreatedUser] = useState<UserAccount | null>(null);
    const [createdProfile, setCreatedProfile] = useState<UserProfile | null>(null);

    const { title, subtitle } = TITLES[step];

    /* ── Step 1 → 2 or 1 → 3 ── */
    function handleStep1Done(
        user: UserAccount | null,
        isMyBusiness: boolean,
        email: string,
        phone: string,
    ) {
        /* Persist step-1 field values */
        setS1Email(email);
        setS1Phone(phone);
        setS1IsMyBusiness(isMyBusiness);
        setCreatedUser(user);

        if (isMyBusiness) {
            /* Skip step 2 entirely */
            setStep(3);
        } else {
            setStep(2);
        }
    }

    /* ── Step 2 → 3 ── */
    function handleStep2Done(
        profile: UserProfile,
        fullName: string,
        dob: string,
        country: string,
        regionCity: string,
    ) {
        /* Persist step-2 field values */
        setS2FullName(fullName);
        setS2Dob(dob);
        setS2Country(country);
        setS2RegionCity(regionCity);
        setCreatedProfile(profile);
        setStep(3);
    }

    /* ── Back from step 3 ── */
    function handleStep3Back() {
        /* If isMyBusiness we skipped step 2 — go back to step 1 */
        setStep(s1IsMyBusiness ? 1 : 2);
    }

    /* ── Step 3 persists its own values via initialXxx props ── */
    function handleStep3FieldChange(name: string, country: string, regionCity: string) {
        setS3Name(name);
        setS3Country(country);
        setS3RegionCity(regionCity);
    }

    /* ─ Determine the effective user for step 3.
       If isMyBusiness, createdUser is null — Step3 will use a stub.
       The consuming page (AddBusinessFlow) is responsible for resolving
       the authenticated user's real data when my_business = true. ─ */
    const step3User: UserAccount = createdUser ?? {
        id: "SELF",
        email: s1Email || "(your account)",
        phone: s1Phone || "",
        is_deleted: false,
        is_banned: false,
        is_business: false,
        is_individual: true,
        is_active: true,
        email_verified: true,
        phone_verified: true,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
    };

    return (
        <ModalShell
            title={title}
            subtitle={subtitle}
            onClose={onClose}
            onBack={step === 1 ? onBack : () => {
                if (step === 3) handleStep3Back();
                else setStep((s) => (s - 1) as WizardStep);
            }}
            step={(s1IsMyBusiness && step === 3) ? 2 : step}
            totalSteps={s1IsMyBusiness ? 2 : 3}   /* show 2-step bar when skipping step 2 */
            width="520px"
        >
            {/* ── Step 1 ── */}
            {step === 1 && (
                <Step1Credentials
                    initialEmail={s1Email}
                    initialPhone={s1Phone}
                    initialIsMyBusiness={s1IsMyBusiness}
                    onNext={handleStep1Done}
                    onBack={onBack}
                />
            )}

            {/* ── Step 2 (skipped when isMyBusiness) ── */}
            {step === 2 && createdUser && (
                <Step2ManagerProfile
                    user={createdUser}
                    initialFullName={s2FullName}
                    initialDob={s2Dob}
                    initialCountry={s2Country}
                    initialRegionCity={s2RegionCity}
                    onNext={handleStep2Done}
                    onBack={() => setStep(1)}
                />
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
                <Step3BusinessProfile
                    user={step3User}
                    profile={createdProfile}
                    accessKey={accessKey}
                    isMyBusiness={s1IsMyBusiness}
                    hideKeyInfo={hideKeyInfo}
                    initialName={s3Name}
                    initialCountry={s3Country}
                    initialRegionCity={s3RegionCity}
                    onDone={onDone}
                    onBack={handleStep3Back}
                />
            )}
        </ModalShell>
    );
}