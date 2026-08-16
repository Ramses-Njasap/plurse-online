"use client";

/* ─────────────────────────────────────────────────────────────────
   <OtpVerification />
   Fully self-contained OTP UI. Caller provides:
     - email       : shown in the subtitle
     - onVerify    : (otp: string) => Promise<void>  — throw to signal failure
     - onResend    : () => Promise<void>
     - onSuccess   : () => void  — called after successful verification
     - title/subtitle overrides are optional
   ───────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef } from "react";
import { OtpInput } from "../OtpInput";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 6;
const EMPTY: string[] = Array(OTP_LENGTH).fill("");

type Status = "idle" | "submitting" | "waiting" | "success" | "error";

interface OtpVerificationProps {
    email: string;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    onSuccess: () => void;
    heading?: string;
    subheading?: string;
}

export function OtpVerification({
    email,
    onVerify,
    onResend,
    onSuccess,
    heading = "Check your inbox.",
    subheading,
}: OtpVerificationProps) {
    const [digits, setDigits] = useState<string[]>(EMPTY);
    const [status, setStatus] = useState<Status>("idle");
    const [shake, setShake] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
    const submitRef = useRef(false);

    const otp = digits.join("");
    const filledCount = digits.filter(Boolean).length;
    const complete = filledCount === OTP_LENGTH;
    const hasError = status === "error";

    /* Resend countdown */
    useEffect(() => {
        if (resendSeconds <= 0) return;
        const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [resendSeconds]);

    /* Auto-submit on 6th digit */
    useEffect(() => {
        if (complete && status === "idle") void submit(otp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [complete, otp]);

    async function submit(code: string) {
        if (submitRef.current) return;
        submitRef.current = true;
        setStatus("submitting");

        const waitTimer = setTimeout(() => setStatus("waiting"), 800);

        try {
            await onVerify(code);
            clearTimeout(waitTimer);
            setStatus("success");
            setTimeout(onSuccess, 800); // brief "Verified ✓" beat before navigating
        } catch {
            clearTimeout(waitTimer);
            setStatus("error");
            setShake(true);
            setTimeout(() => {
                setShake(false);
                setDigits(EMPTY);
                setStatus("idle");
                submitRef.current = false;
            }, 700);
        }
    }

    async function resend() {
        if (resendSeconds > 0) return;
        setStatus("idle");
        setDigits(EMPTY);
        submitRef.current = false;
        setResendSeconds(RESEND_SECONDS);
        await onResend();
    }

    /* Button config per status */
    type BtnConfig = { label: React.ReactNode; bg: string; opacity?: number };
    const btnMap: Record<Status, BtnConfig> = {
        idle: {
            label: complete
                ? "Verify email"
                : `Verify email — ${OTP_LENGTH - filledCount} digit${OTP_LENGTH - filledCount !== 1 ? "s" : ""} left`,
            bg: "var(--brand)",
            opacity: complete ? 1 : 0.35,
        },
        submitting: {
            label: <Row icon={<Spinner />} text="Verifying…" />,
            bg: "var(--brand)",
        },
        waiting: {
            label: <Row icon={<Ping />} text="Waiting for response…" />,
            bg: "var(--brand)",
        },
        success: { label: "Verified ✓", bg: "#22c55e" },
        error: { label: "Incorrect code — try again", bg: "#ef4444" },
    };

    const { label, bg, opacity = 1 } = btnMap[status];

    return (
        <div>
            {/* Mail icon */}
            <div
                className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
                <MailIcon />
            </div>

            {/* Heading */}
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.10em]" style={{ color: "var(--brand)" }}>
                Verify your email
            </p>
            <h2 className="mb-2 text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">{heading}</h2>
            <p className="mb-8 text-[13.5px] leading-relaxed text-[#0F0F0F]/45">
                {subheading ?? (
                    <>
                        We sent a 6-digit code to{" "}
                        <span className="font-medium text-[#0F0F0F]/70">{email}</span>.
                        Enter it below to continue.
                    </>
                )}
            </p>

            {/* OTP boxes */}
            <div
                className="mb-6"
                style={{ animation: shake ? "shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both" : "none" }}
            >
                <OtpInput
                    value={digits}
                    onChange={(next) => { if (status === "idle") setDigits(next); }}
                    hasError={hasError}
                />
            </div>

            {/* Hint */}
            <div className="mb-5 h-4 text-center">
                {status === "error" ? (
                    <p className="text-[12px] text-red-400">That code doesn&apos;t match. Clearing in a moment…</p>
                ) : status === "idle" && !complete && filledCount > 0 ? (
                    <p className="text-[12px] text-[#0F0F0F]/30">
                        {OTP_LENGTH - filledCount} more digit{OTP_LENGTH - filledCount !== 1 ? "s" : ""} to go
                    </p>
                ) : null}
            </div>

            {/* State button */}
            <button
                type="button"
                disabled
                className="h-[44px] w-full rounded-lg text-[13.5px] font-medium text-white transition-all duration-300 disabled:cursor-default"
                style={{ background: bg, opacity }}
            >
                {label}
            </button>

            {/* Resend */}
            <p className="mt-6 text-center text-[13px] text-[#0F0F0F]/35">
                Didn&apos;t receive a code?{" "}
                {resendSeconds <= 0 ? (
                    <button
                        type="button"
                        onClick={resend}
                        className="font-medium transition-opacity"
                        style={{ color: "var(--brand)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                        Resend code
                    </button>
                ) : (
                    <span className="font-medium tabular-nums text-[#0F0F0F]/35">
                        Resend in {resendSeconds}s
                    </span>
                )}
            </p>

            <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
      `}</style>
        </div>
    );
}

/* ── Small helpers ── */

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <span className="flex items-center justify-center gap-2">{icon}{text}</span>
    );
}

function MailIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--brand)" }}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function Spinner() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
}

function Ping() {
    return (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
    );
}