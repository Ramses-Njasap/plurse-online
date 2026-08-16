"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandPanel } from "@/components/signup/shared-with-login/BrandPanel";
import { OtpVerification } from "@/components/signup/verify/shared-with-forgot-password/OtpVerification";
import { EyeIcon, EyeOffIcon } from "@/components/signup/shared-with-login/Icons";
import { passwordStrength, strengthLabel, strengthBarColor } from "@/lib/signup/password";

/* ─────────────────────────────────────────────────────
   Production Core Infrastructure Connections
   ───────────────────────────────────────────────────── */
import { forgotPasswordSubmitAction } from "@/app/actions/forgot-password-submit";
import { sendForgotPasswordOtpAction } from "@/app/actions/send-forgot-password-otp";
import { verifyForgotPasswordOtpAction } from "@/app/actions/verify-forgot-password-otp";

type Step = "email" | "verify" | "password";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [verifiedOtp, setVerifiedOtp] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    async function onEmailSubmit() {
        if (!isValidEmail) return;
        setErrorMessage(null);
        setIsSending(true);

        const result = await sendForgotPasswordOtpAction(email);

        setIsSending(false);

        if (!result.success) {
            setErrorMessage(result.message ?? "An error occurred checking your account parameters.");
            return;
        }

        setStep("verify");
    }

    return (
        <div className="flex min-h-[calc(100vh-68px)]">
            <BrandPanel copyKey="default" />

            <div className="flex flex-1 items-center justify-center px-8 py-16">
                <div className="w-full max-w-[400px]">

                    {/* Mobile wordmark */}
                    <div className="mb-6 lg:hidden">
                        <span className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
                            Plurse
                        </span>
                    </div>

                    {/* Dynamic Error Status Alert Notification */}
                    {errorMessage && (
                        <div className="mb-4 p-3 text-xs font-medium border border-red-200 bg-red-50 text-red-600 rounded-md transition-all duration-200">
                            {errorMessage}
                        </div>
                    )}

                    {/* Step: email */}
                    {step === "email" && (
                        <EmailStep
                            email={email}
                            isValid={isValidEmail}
                            isSending={isSending}
                            onChange={setEmail}
                            onSubmit={onEmailSubmit}
                        />
                    )}

                    {/* Step: verify */}
                    {step === "verify" && (
                        <OtpVerification
                            email={email}
                            heading="Check your inbox."
                            onVerify={async (otp) => {
                                setErrorMessage(null);
                                // Calls the purpose-built forgot-password validator action
                                const result = await verifyForgotPasswordOtpAction(email, otp);
                                if (!result.success) {
                                    setErrorMessage(result.message ?? "Invalid verification code.");
                                    throw new Error(result.message);
                                }
                                // Safely seed local state and step forward
                                setVerifiedOtp(otp);
                                setStep("password");
                            }}
                            onResend={async () => {
                                setErrorMessage(null);
                                const result = await sendForgotPasswordOtpAction(email);
                                if (!result.success) {
                                    setErrorMessage(result.message ?? "Failed to request a new code.");
                                    throw new Error(result.message);
                                }
                            }}
                            onSuccess={() => { }}
                        />
                    )}

                    {/* Step: new password */}
                    {step === "password" && (
                        <NewPasswordStep
                            onSubmit={async (password) => {
                                setErrorMessage(null);
                                const result = await forgotPasswordSubmitAction(email, verifiedOtp, password);
                                if (!result.success) {
                                    setErrorMessage(result.message ?? "Failed to save password.");
                                    return;
                                }
                                router.push("/login");
                            }}
                        />
                    )}

                    {/* Footer */}
                    <p className="mt-7 text-center text-[13px] text-[#0F0F0F]/35">
                        Remembered it?{" "}
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

/* ── Step 1: Email input ── */
function EmailStep({
    email, isValid, isSending, onChange, onSubmit,
}: {
    email: string;
    isValid: boolean;
    isSending: boolean;
    onChange: (v: string) => void;
    onSubmit: () => void;
}) {
    return (
        <div>
            <div
                className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
                <LockIcon />
            </div>

            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.10em]" style={{ color: "var(--brand)" }}>
                Password reset
            </p>
            <h2 className="mb-2 text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">
                Forgot your<br />password?
            </h2>
            <p className="mb-8 text-[13.5px] leading-relaxed text-[#0F0F0F]/45">
                No problem. Enter your account email and we&apos;ll send you a reset code.
            </p>

            <div className="mb-6">
                <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
                    Email address
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="you@business.com"
                    autoComplete="email"
                    className="h-[44px] w-full rounded-lg border border-[#0F0F0F]/10 bg-white px-4 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,15,15,0.10)")}
                    onKeyDown={(e) => e.key === "Enter" && isValid && onSubmit()}
                />
            </div>

            <button
                type="button"
                disabled={!isValid || isSending}
                onClick={onSubmit}
                className="h-[44px] w-full rounded-lg text-[14px] font-medium text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30"
                style={{ background: "var(--brand)" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--brand-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--brand)"; }}
            >
                {isSending ? (
                    <span className="flex items-center justify-center gap-2">
                        <SmallSpinner /> Sending code…
                    </span>
                ) : (
                    "Send reset code"
                )}
            </button>
        </div>
    );
}

/* ── Step 3: New password ── */
function NewPasswordStep({ onSubmit }: { onSubmit: (password: string) => Promise<void> }) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [loading, setLoading] = useState(false);

    const pwStrength = passwordStrength(password);
    const { label: strengthText, color: strengthColor } = strengthLabel(pwStrength);
    const mismatch = confirm.length > 0 && confirm !== password;
    const canSubmit = password.length >= 8 && password === confirm;

    async function handleSubmit() {
        if (!canSubmit) return;
        setLoading(true);
        await onSubmit(password);
        setLoading(false);
    }

    return (
        <div>
            <div
                className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
                <ShieldIcon />
            </div>

            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.10em]" style={{ color: "var(--brand)" }}>
                Almost done
            </p>
            <h2 className="mb-2 text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">
                Set a new<br />password.
            </h2>
            <p className="mb-8 text-[13.5px] leading-relaxed text-[#0F0F0F]/45">
                Choose something strong. You won&apos;t need to change it again unless you want to.
            </p>

            <div className="mb-6 space-y-4">
                <div>
                    <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
                        New password
                    </label>
                    <div className="relative">
                        <input
                            type={showPw ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            autoComplete="new-password"
                            className="h-[44px] w-full rounded-lg border border-[#0F0F0F]/10 bg-white px-4 pr-12 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,15,15,0.10)")}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F0F0F]/25 hover:text-[#0F0F0F]/55 transition-colors">
                            {showPw ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {password.length > 0 && (
                        <div className="mt-2.5">
                            <div className="mb-1 flex gap-1">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className={`h-[2px] flex-1 rounded-full transition-all duration-300 ${pwStrength > i ? strengthBarColor(pwStrength) : "bg-[#0F0F0F]/10"}`} />
                                ))}
                            </div>
                            <p className={`text-[11px] ${strengthColor}`}>{strengthText}</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
                        Confirm password
                    </label>
                    <div className="relative">
                        <input
                            type={showCf ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            className="h-[44px] w-full rounded-lg border bg-white px-4 pr-12 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
                            style={{ borderColor: mismatch ? "rgba(248,113,113,0.7)" : "rgba(15,15,15,0.10)" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = mismatch ? "#f87171" : "var(--brand)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = mismatch ? "rgba(248,113,113,0.7)" : "rgba(15,15,15,0.10)")}
                        />
                        <button type="button" onClick={() => setShowCf(!showCf)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F0F0F]/25 hover:text-[#0F0F0F]/55 transition-colors">
                            {showCf ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {mismatch && <p className="mt-1.5 text-[12px] text-red-400">Passwords don&apos;t match.</p>}
                </div>
            </div>

            <button
                type="button"
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
                className="h-[44px] w-full rounded-lg text-[14px] font-medium text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30"
                style={{ background: "var(--brand)" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--brand-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--brand)"; }}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2"><SmallSpinner /> Saving…</span>
                ) : (
                    "Reset password"
                )}
            </button>
        </div>
    );
}

/* ── Icons ── */
function LockIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--brand)" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

// Security layout shield decoration
function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--brand)" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function SmallSpinner() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
}