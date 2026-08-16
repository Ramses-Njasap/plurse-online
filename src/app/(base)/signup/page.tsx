"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BrandPanel, type PanelCopyKey } from "@/components/signup/shared-with-login/BrandPanel";
import { StepBar } from "@/components/signup/steps/Bar";
import { Step1AccountType, type AccountType } from "@/components/signup/steps/AccountType";
import { Step2Contact } from "@/components/signup/steps/Contact";
import { Step3Password } from "@/components/signup/steps/Password";

// Import your centralized server execution logic
import { registerUserAction } from "@/app/actions/auth";

/* ── Types ── */
type Step = 1 | 2 | 3;

/* ════════════════════════════════════════════ */
export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    /* Operational Transaction & Feedback states */
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /* Derive which brand-panel copy to show */
    const copyKey: PanelCopyKey =
        step === 3
            ? "finishing"
            : accountType === "individual"
                ? "individual"
                : accountType === "business"
                    ? "business"
                    : "default";

    /* Centralized Form Submission Event Handler */
    async function onSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault(); // Defensive block against automatic browser reloads
        if (!accountType) return;

        setErrorMessage(null);

        // Centralized Client-Side Password Check
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        const result = await registerUserAction({
            accountType,
            email,
            phone,
            password
        });

        setIsLoading(false);

        if (!result.success) {
            setErrorMessage(result.message);
            return;
        }

        // Success transition: Route user instantly into your OTP step while passing context
        router.push(`/signup/verify?email=${encodeURIComponent(email)}`);
    }

    return (
        <div className="flex min-h-[calc(100vh-68px)]">

            {/* Left: animated brand panel (Unchanged UI design) */}
            <BrandPanel copyKey={copyKey} />

            {/* Right: form panel (Unchanged UI design) */}
            <div className="flex flex-1 items-center justify-center px-8 py-16">
                <div className="w-full max-w-[400px]">

                    {/* Mobile wordmark */}
                    <div className="mb-6 lg:hidden">
                        <span className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
                            Plurse
                        </span>
                    </div>

                    {/* Step progress bar */}
                    <StepBar current={step} />

                    {/* Integrated Dynamic Error Feedback Node */}
                    {errorMessage && (
                        <div className="mt-4 mb-2 p-3 text-xs font-medium border border-red-200 bg-red-50 text-red-600 rounded-md transition-all duration-200">
                            {errorMessage}
                        </div>
                    )}

                    {/* Step 1 */}
                    {step === 1 && (
                        <Step1AccountType
                            accountType={accountType}
                            onSelect={setAccountType}
                            onContinue={() => setStep(2)}
                        />
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <Step2Contact
                            email={email}
                            phone={phone}
                            onEmailChange={setEmail}
                            onPhoneChange={setPhone}
                            onBack={() => setStep(1)}
                            onContinue={() => setStep(3)}
                        />
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <Step3Password
                            password={password}
                            confirmPassword={confirmPassword}
                            onPasswordChange={setPassword}
                            onConfirmChange={setConfirmPassword}
                            onBack={() => setStep(2)}
                            onSubmit={onSubmit}
                            // Optional parameter if you wish to hook state feedback down to subcomponents
                            // disabled={isLoading}
                        />
                    )}

                    {/* Footer link */}
                    <p className="mt-7 text-center text-[13px] text-[#0F0F0F]/35">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-[#0F0F0F] transition-opacity hover:opacity-60"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}