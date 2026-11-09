"use client";

import { useState } from "react";
import { formatAmount } from "@/app/(dashboard)/dashboard/my/keys/data/mockKeys";
import type { KeyType } from "@/types/users.types";
import { ModalShell, Field, Spinner } from "../keys/new-key-modal/ModalPrimitives";
import { useToast } from "@/components/ui";
import { error } from "console";

/* ─────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────── */

type PaymentMethod = "mobile_money" | "card";
type MoMoProvider = "mtn" | "orange";
type PaymentStatus = "idle" | "processing" | "success" | "failed";

export interface PaymentModalContext {
    titles?: Partial<Record<PaymentStatus, string>>;
    subtitles?: Partial<Record<PaymentStatus, string>>;
    amountBanner?: {
        label?: string;
        badgeText?: string;
        badgeColor?: string;
        badgeBg?: string;
        detailBox?: {
            lines: string[];
            color?: string;
            bg?: string;
            borderColor?: string;
        };
    };
    successMessage?: string;
    testHint?: string;
}

interface PaymentModalProps {
    amount: number;
    keyType?: KeyType;
    onSuccess: (transactionId: string) => void;
    onBeforePay: () => Promise<boolean>;
    isPreparing?: boolean;
    preflightError?: string;
    onClose: () => void;
    context?: PaymentModalContext;
}

/* ─────────────────────────────────────────────────────────────────
   Root modal
   ───────────────────────────────────────────────────────────────── */

export function PaymentModal({
    keyType,
    amount,
    onSuccess,
    onBeforePay,
    isPreparing,
    preflightError,
    onClose,
    context,
}: PaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>("mobile_money");
    const [status, setStatus] = useState<PaymentStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [txnId, setTxnId] = useState("");

    const toast = useToast();

    // Mobile money state
    const [provider, setProvider] = useState<MoMoProvider>("mtn");
    const [phone, setPhone] = useState("");

    // Card state
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const canPayMomo = phone.replace(/\s/g, "").length >= 9;
    const canPayCard =
        cardName.trim().length > 0 &&
        cardNumber.replace(/\s/g, "").length === 16 &&
        expiry.length === 5 &&
        cvv.length >= 3;
    const canPay = method === "mobile_money" ? canPayMomo : canPayCard;

    // ──────────────────────────────────────────────────────────────
    // Polling helper (Fapshi statuses)
    // ──────────────────────────────────────────────────────────────
    async function pollPaymentStatus(transId: string, maxAttempts = 24) {
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise((r) => setTimeout(r, 20000)); // every 5 s

            try {
                const res = await fetch(`/api/pay/status?ref=${encodeURIComponent(transId)}`);
                const data = await res.json();
                console.log("Payment status poll:", data);

                if (data.status === "SUCCESSFUL") {
                    return true;
                }
                if (data.status === "FAILED" || data.status === "EXPIRED") {
                    toast.error(data.message || "Payment was declined or expired.");
                    return false;
                }
                // CREATED / PENDING → keep waiting
            } catch (err) {
                // network error – continue polling
                console.warn("Status poll error:", err);
                toast.warning("Network error while checking payment status. Retrying...");
            }
        }
        toast.dismiss("Payment timed out. Please check your phone or try again.");
        return false;
    }

    // ──────────────────────────────────────────────────────────────
    // Main pay handler
    // ──────────────────────────────────────────────────────────────
    async function handlePay() {
        if (!canPay) return;
        setStatus("processing");
        setErrorMsg("");

        try {
            // 1. Pre-flight DB check
            const isReady = await onBeforePay();
            if (!isReady) {
                setStatus("failed");
                setErrorMsg(
                    preflightError || "Database sync failed before transaction could initiate."
                );
                return;
            }

            if (method === "mobile_money") {
                // 2. Call your backend (Fapshi Direct Pay)
                const res = await fetch("/api/pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount,
                        phone: phone.replace(/\s/g, ""),
                        provider, // "mtn" | "orange"
                        email: "ramsesnjasap11@gmail.com", // replace with real user data if available
                        name: "Valued Customer",
                    }),
                });

                const data = await res.json();


                if (!res.ok) {
                    toast.error(data.error || "Payment initiation failed.");
                    return false;
                }

                // Store references
                setTxnId(data.transaction_reference || data.fapshi_trans_id);

                // 3. Poll until SUCCESSFUL / FAILED
                const paymentSuccess = await pollPaymentStatus(data.fapshi_trans_id);

                if (!paymentSuccess) {
                    console.warn("Payment failed or timed out for transaction:", data.fapshi_trans_id);
                    return false;
                }

                setStatus("success");
                setTimeout(() => onSuccess(data.transaction_reference || data.fapshi_trans_id), 1200);
            } else {
                toast.error("Card payments are not yet available. Please use Mobile Money.");
                return false;
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Payment failed.";
            setErrorMsg(message);
            toast.error(message);
            setStatus("failed");
        }
    }

    function handleRetry() {
        setStatus("idle");
        setErrorMsg("");
        setCvv("");
    }

    /* ── Defaults ── */
    const defaultIdleSubtitle = keyType
        ? `Pay ${formatAmount(amount)} to create your ${keyType} key.`
        : `Pay ${formatAmount(amount)} to continue.`;

    const defaultSuccessMessage = keyType
        ? "Proceeding to key creation…"
        : "Proceeding…";

    const titleMap: Record<PaymentStatus, string> = {
        idle: context?.titles?.idle ?? "Complete payment",
        processing: context?.titles?.processing ?? "Processing payment",
        success: context?.titles?.success ?? "Payment successful",
        failed: context?.titles?.failed ?? "Payment failed",
    };

    const subtitleMap: Record<PaymentStatus, string> = {
        idle: context?.subtitles?.idle ?? defaultIdleSubtitle,
        processing:
            context?.subtitles?.processing ?? "Please wait. Do not close this window.",
        success:
            context?.subtitles?.success ?? "Your payment was confirmed. Proceeding…",
        failed:
            context?.subtitles?.failed ?? "Something went wrong. You can try again below.",
    };

    const testHint =
        context?.testHint ??
        "Test: use any number — end in 0000 to simulate failure.";
    const successMessage = context?.successMessage ?? defaultSuccessMessage;

    return (
        <ModalShell
            title={titleMap[status]}
            subtitle={subtitleMap[status]}
            onClose={status === "processing" ? () => { } : onClose}
            width="480px"
        >
            {/* ── Idle ── */}
            {status === "idle" && (
                <div className="space-y-5">
                    <AmountBanner amount={amount} keyType={keyType} banner={context?.amountBanner} />

                    <div
                        className="flex gap-1 rounded-xl p-1"
                        style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
                    >
                        <MethodTab
                            active={method === "mobile_money"}
                            icon={<PhoneIcon />}
                            label="Mobile money"
                            onClick={() => setMethod("mobile_money")}
                        />
                        <MethodTab
                            active={method === "card"}
                            icon={<CardIcon />}
                            label="Card"
                            onClick={() => setMethod("card")}
                        />
                    </div>

                    {method === "mobile_money" && (
                        <MoMoForm
                            provider={provider}
                            phone={phone}
                            amount={amount}
                            onProviderChange={setProvider}
                            onPhoneChange={setPhone}
                        />
                    )}

                    {method === "card" && (
                        <CardForm
                            cardName={cardName}
                            cardNumber={cardNumber}
                            expiry={expiry}
                            cvv={cvv}
                            onCardNameChange={setCardName}
                            onCardNumberChange={setCardNumber}
                            onExpiryChange={setExpiry}
                            onCvvChange={setCvv}
                        />
                    )}

                    {testHint && (
                        <p className="text-center text-[11px]" style={{ color: "var(--text-subtle)" }}>
                            {testHint}
                        </p>
                    )}

                    <div className="space-y-2">
                        <button
                            type="button"
                            disabled={!canPay}
                            onClick={handlePay}
                            className="h-[44px] w-full rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: "var(--brand)" }}
                            onMouseEnter={(e) => {
                                if (canPay) e.currentTarget.style.background = "var(--brand-hover)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "var(--brand)";
                            }}
                        >
                            Pay {formatAmount(amount)}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-[40px] w-full rounded-xl border text-[13px] font-medium transition-all"
                            style={{
                                borderColor: "var(--border)",
                                color: "var(--text-muted)",
                                background: "white",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--surface-muted)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Processing ── */}
            {status === "processing" && (
                <ProcessingState method={method} provider={provider} amount={amount} />
            )}

            {/* ── Success ── */}
            {status === "success" && (
                <SuccessState amount={amount} txnId={txnId} message={successMessage} />
            )}

            {/* ── Failed ── */}
            {status === "failed" && (
                <FailedState errorMsg={errorMsg} onRetry={handleRetry} onClose={onClose} />
            )}
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Sub-components (unchanged from your original)
   ───────────────────────────────────────────────────────────────── */

function AmountBanner({
    amount,
    keyType,
    banner,
}: {
    amount: number;
    keyType?: KeyType;
    banner?: PaymentModalContext["amountBanner"];
}) {
    const label = banner?.label ?? "Amount due";
    const badgeText = banner?.badgeText ?? (keyType ? `${keyType} key` : undefined);
    const badgeBg =
        banner?.badgeBg ??
        (keyType === "TRIAL" ? "rgba(245,158,11,0.12)" : "rgba(59,130,246,0.12)");
    const badgeColor =
        banner?.badgeColor ?? (keyType === "TRIAL" ? "#d97706" : "var(--brand)");

    return (
        <div className="space-y-3">
            <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{
                    background: "var(--brand-light)",
                    border: "1px solid rgba(59,130,246,0.2)",
                }}
            >
                <div>
                    <p
                        className="text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: "var(--brand)" }}
                    >
                        {label}
                    </p>
                    <p className="text-[24px] font-bold" style={{ color: "var(--foreground)" }}>
                        {formatAmount(amount)}
                    </p>
                </div>
                {badgeText && (
                    <span
                        className="rounded-lg px-3 py-1 text-[11px] font-semibold capitalize"
                        style={{ background: badgeBg, color: badgeColor }}
                    >
                        {badgeText}
                    </span>
                )}
            </div>

            {banner?.detailBox && (
                <div
                    className="space-y-1 rounded-xl border px-4 py-3 text-[12px] leading-relaxed"
                    style={{
                        borderColor: banner.detailBox.borderColor ?? "var(--border)",
                        background: banner.detailBox.bg ?? "var(--surface-muted)",
                        color: banner.detailBox.color ?? "var(--foreground)",
                    }}
                >
                    {banner.detailBox.lines.map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

function MethodTab({
    active,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-all"
            style={
                active
                    ? {
                        background: "var(--surface)",
                        color: "var(--foreground)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }
                    : { background: "transparent", color: "var(--text-muted)" }
            }
        >
            {icon}
            {label}
        </button>
    );
}

const MOMO_PROVIDERS: {
    id: MoMoProvider;
    label: string;
    color: string;
    bg: string;
    prefix: string;
}[] = [
        { id: "mtn", label: "MTN MoMo", color: "#854d0e", bg: "#fef9c3", prefix: "+237 67 / 68" },
        { id: "orange", label: "Orange Money", color: "#9a3412", bg: "#fff7ed", prefix: "+237 69" },
    ];

function MoMoForm({
    provider,
    phone,
    amount,
    onProviderChange,
    onPhoneChange,
}: {
    provider: MoMoProvider;
    phone: string;
    amount: number;
    onProviderChange: (p: MoMoProvider) => void;
    onPhoneChange: (v: string) => void;
}) {
    const active = MOMO_PROVIDERS.find((p) => p.id === provider)!;

    return (
        <div className="space-y-4">
            <Field label="Mobile money provider">
                <div className="grid grid-cols-2 gap-2">
                    {MOMO_PROVIDERS.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => onProviderChange(p.id)}
                            className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all"
                            style={
                                provider === p.id
                                    ? { borderColor: "var(--brand)", background: "var(--brand-light)" }
                                    : { borderColor: "var(--border)", background: "white" }
                            }
                        >
                            <ProviderLogo provider={p.id} />
                            <div>
                                <p
                                    className="text-[13px] font-semibold"
                                    style={{
                                        color: provider === p.id ? "var(--brand)" : "var(--foreground)",
                                    }}
                                >
                                    {p.label}
                                </p>
                                <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                                    {p.prefix}
                                </p>
                            </div>
                            {provider === p.id && (
                                <span
                                    className="ml-auto h-4 w-4 shrink-0 rounded-full"
                                    style={{ background: "var(--brand)" }}
                                >
                                    <svg viewBox="0 0 16 16" fill="white" className="h-4 w-4">
                                        <path d="M6.5 11.5 3 8l1.06-1.06L6.5 9.38l5.44-5.44L13 5l-6.5 6.5z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Field>

            <Field
                label={`${active.label} number`}
                hint="Enter the number registered with your mobile money account."
            >
                <div className="flex gap-2">
                    <div
                        className="flex h-[42px] shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[12px] font-medium"
                        style={{
                            borderColor: "var(--border)",
                            background: "var(--surface-muted)",
                            color: "var(--text-muted)",
                        }}
                    >
                        🇨🇲 +237
                    </div>
                    <input
                        type="tel"
                        value={phone}
                        inputMode="numeric"
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                            onPhoneChange(
                                digits.replace(/(\d{2})(\d{3})(\d{0,4})/, (_, a, b, c) =>
                                    c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a
                                )
                            );
                        }}
                        placeholder="6X XXX XXXX"
                        className="h-[42px] flex-1 rounded-lg border px-3 font-mono text-[14px] tracking-wide focus:outline-none"
                        style={{
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                            background: "white",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                </div>
            </Field>

            <div
                className="rounded-xl px-4 py-3 text-[12px] leading-relaxed"
                style={{ background: active.bg, color: active.color }}
            >
                A payment request of <strong>{formatAmount(amount)}</strong> will be sent to
                your <strong>{active.label}</strong> number. Approve it on your phone to
                complete the payment.
            </div>
        </div>
    );
}

function CardForm({
    cardName,
    cardNumber,
    expiry,
    cvv,
    onCardNameChange,
    onCardNumberChange,
    onExpiryChange,
    onCvvChange,
}: {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    onCardNameChange: (v: string) => void;
    onCardNumberChange: (v: string) => void;
    onExpiryChange: (v: string) => void;
    onCvvChange: (v: string) => void;
}) {
    return (
        <div className="space-y-4">
            <Field label="Name on card">
                <input
                    type="text"
                    value={cardName}
                    onChange={(e) => onCardNameChange(e.target.value)}
                    placeholder="e.g. AMARA NKOSI"
                    className="h-[42px] w-full rounded-lg border px-3 text-[13px] uppercase tracking-wide focus:outline-none"
                    style={{
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                        background: "white",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
            </Field>

            <Field label="Card number">
                <div className="relative">
                    <input
                        type="text"
                        value={cardNumber}
                        inputMode="numeric"
                        maxLength={19}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                            onCardNumberChange(digits.replace(/(.{4})/g, "$1 ").trim());
                        }}
                        placeholder="0000 0000 0000 0000"
                        className="h-[42px] w-full rounded-lg border px-3 pr-10 font-mono text-[14px] tracking-widest focus:outline-none"
                        style={{
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                            background: "white",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                    <span
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-subtle)" }}
                    >
                        <CardIcon />
                    </span>
                </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry date">
                    <input
                        type="text"
                        value={expiry}
                        inputMode="numeric"
                        maxLength={5}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                            onExpiryChange(
                                digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
                            );
                        }}
                        placeholder="MM/YY"
                        className="h-[42px] w-full rounded-lg border px-3 font-mono text-[14px] focus:outline-none"
                        style={{
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                            background: "white",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                </Field>
                <Field label="CVV">
                    <input
                        type="password"
                        value={cvv}
                        inputMode="numeric"
                        maxLength={4}
                        onChange={(e) => onCvvChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        className="h-[42px] w-full rounded-lg border px-3 font-mono text-[14px] focus:outline-none"
                        style={{
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                            background: "white",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                </Field>
            </div>
        </div>
    );
}

function ProcessingState({
    method,
    provider,
    amount,
}: {
    method: PaymentMethod;
    provider: MoMoProvider;
    amount: number;
}) {
    const label =
        method === "mobile_money"
            ? provider === "mtn"
                ? "MTN MoMo"
                : "Orange Money"
            : "card payment";

    return (
        <div className="flex flex-col items-center gap-6 py-8">
            <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--brand-light)" }}
            >
                {method === "mobile_money" ? (
                    <ProviderLogo provider={provider} size={36} />
                ) : (
                    <Spinner size={28} />
                )}
            </div>
            <div className="text-center">
                <p className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
                    {method === "mobile_money"
                        ? "Waiting for your approval…"
                        : "Processing your card…"}
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {method === "mobile_money"
                        ? `Check your phone and approve the ${formatAmount(amount)} request from ${label}.`
                        : "Do not close this window. This usually takes a few seconds."}
                </p>
            </div>
            <div
                className="h-1 w-full overflow-hidden rounded-full"
                style={{ background: "var(--surface-muted)" }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        background: "var(--brand)",
                        animation: "payment-progress 2.5s ease-in-out forwards",
                    }}
                />
            </div>
            <style>{`
        @keyframes payment-progress {
          0%   { width: 0% }
          30%  { width: 45% }
          65%  { width: 72% }
          100% { width: 93% }
        }
      `}</style>
        </div>
    );
}

function SuccessState({
    amount,
    txnId,
    message,
}: {
    amount: number;
    txnId: string;
    message: string;
}) {
    return (
        <div className="flex flex-col items-center gap-5 py-8">
            <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "rgba(34,197,94,0.12)" }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 6 9 17l-5-5" />
                </svg>
            </div>
            <div className="text-center">
                <p className="text-[16px] font-semibold" style={{ color: "#16a34a" }}>
                    {formatAmount(amount)} paid
                </p>
                <p className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Transaction ID:{" "}
                    <span className="font-mono" style={{ color: "var(--foreground)" }}>
                        {txnId}
                    </span>
                </p>
                <p className="mt-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {message}
                </p>
            </div>
        </div>
    );
}

function FailedState({
    errorMsg,
    onRetry,
    onClose,
}: {
    errorMsg: string;
    onRetry: () => void;
    onClose: () => void;
}) {
    return (
        <div className="flex flex-col items-center gap-5 py-6">
            <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "rgba(239,68,68,0.10)" }}
            >
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6M9 9l6 6" />
                </svg>
            </div>
            <div className="text-center">
                <p className="text-[15px] font-semibold" style={{ color: "#dc2626" }}>
                    Payment declined
                </p>
                <p
                    className="mt-2 text-[13px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                >
                    {errorMsg}
                </p>
            </div>
            <div className="w-full space-y-2">
                <button
                    type="button"
                    onClick={onRetry}
                    className="h-[44px] w-full rounded-xl text-[14px] font-semibold text-white transition-all"
                    style={{ background: "var(--brand)" }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--brand-hover)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                >
                    Try again
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="h-[40px] w-full rounded-xl border text-[13px] font-medium transition-all"
                    style={{
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                        background: "white",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface-muted)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function ProviderLogo({
    provider,
    size = 28,
}: {
    provider: MoMoProvider;
    size?: number;
}) {
    if (provider === "mtn") {
        return (
            <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#FFCB00" />
                <text
                    x="50%"
                    y="55%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="900"
                    fontFamily="Arial, sans-serif"
                    fill="#1a1a1a"
                >
                    MTN
                </text>
            </svg>
        );
    }
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#FF6600" />
            <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
                fill="white"
            >
                ORANGE
            </text>
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M12 18h.01" />
        </svg>
    );
}

function CardIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
        </svg>
    );
}