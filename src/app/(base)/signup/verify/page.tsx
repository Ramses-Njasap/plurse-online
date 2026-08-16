"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { BrandPanel } from "@/components/signup/shared-with-login/BrandPanel";
import { OtpVerification } from "@/components/signup/verify/shared-with-forgot-password/OtpVerification";

// Import your optimized manual backend operations
import { verifyOtpAction } from "@/app/actions/verify";
import { resendOtpAction } from "@/app/actions/resend";

/* ════════════════════════════════════════════ */
// 1. Inner Content Component
/* ════════════════════════════════════════════ */
function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract contextual address context dynamically from routing parameters
    const email = searchParams.get("email") ?? "";

    // Dynamic layout notification state to report errors to the user
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /* Centralized Code Submission Callback */
    async function handleVerifyOtp(otp: string): Promise<void> {
        setErrorMessage(null);

        // Enforce exact 6-digit string structure requirement locally before network hop
        if (otp.length !== 6) {
            setErrorMessage("Verification tokens must be exactly 6 digits.");
            throw new Error("Invalid token size length.");
        }

        const result = await verifyOtpAction(email, otp);

        if (!result.success) {
            setErrorMessage(result.message);
            // Throwing standard error communicates failure cleanly down to your child OtpVerification status components
            throw new Error(result.message);
        }

        // Success: Route the user to their entry panel dashboard layout!
        router.push("/dashboard");
    }

    /* Manual Resend Trigger Callback */
    async function handleResendOtp(): Promise<void> {
        setErrorMessage(null);

        const result = await resendOtpAction(email);

        if (!result.success) {
            setErrorMessage(result.message);
            throw new Error(result.message);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-68px)]">
            {/* Left Side: Brand presentation container */}
            <BrandPanel copyKey="finishing" />

            {/* Right Side: Primary data form view frame */}
            <div className="flex flex-1 items-center justify-center px-8 py-16">
                <div className="w-full max-w-[400px]">

                    {/* Mobile localized wordmark layout element */}
                    <div className="mb-6 lg:hidden">
                        <span className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
                            Plurse
                        </span>
                    </div>

                    {/* Inline Notification Alert Node */}
                    {errorMessage && (
                        <div className="mb-4 p-3 text-xs font-medium border border-red-200 bg-red-50 text-red-600 rounded-md transition-all duration-200">
                            {errorMessage}
                        </div>
                    )}

                    {/* Pristine functional mapping connection onto child node styles */}
                    <OtpVerification
                        email={email || "your registration email"}
                        onVerify={handleVerifyOtp}
                        onResend={handleResendOtp}
                        onSuccess={() => router.push("/dashboard")}
                    />
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════ */
// 2. Exported Default Page Component Wrapped in Suspense
/* ════════════════════════════════════════════ */
export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[calc(100vh-68px)] items-center justify-center text-xs font-medium text-[#0F0F0F]/40">
                Loading verification...
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}