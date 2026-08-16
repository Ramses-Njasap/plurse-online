"use client";

import { useState, useEffect } from "react";
import { checkChannelPartnerStatus, purchaseChannelPartnerAction } from "@/app/actions/channel_partners";
import { useRouter } from "next/navigation";
import { PaymentModal, type PaymentModalContext } from "@/components/dashboard/my/payment/PaymentModal";

/* Single source of copy so the header bar and sidebar card always say the same thing. */
const PARTNER_COPY = {
    title: "You aren't a channel partner yet",
    subtitle: "Unlock business routing and key generation panels for just 4,000 XAF for 3 months.",
    cta: "Become a Redistributor Today!",
};

const GOLD = {
    border: "#FDE68A",
    bg: "#FFFBEB",
    bgHover: "#FEF3C7",
    text: "#92400E",
    textMuted: "#B45309",
    accent: "#D97706",
    accentHover: "#B45309",
};

const CHANNEL_PARTNER_AMOUNT = 4000;

/* Everything that makes this modal "look like" a channel-partner purchase
   instead of a key purchase lives here — the payment logic itself never changes. */
const CHANNEL_PARTNER_MODAL_CONTEXT: PaymentModalContext = {
    titles: {
        idle: "Activate channel partner",
    },
    subtitles: {
        idle: "Unlock business routing and key generation panels.",
        success: "Your channel partner access is confirmed.",
    },
    amountBanner: {
        label: "Amount due",
        badgeText: "Channel Partner",
        detailBox: {
            lines: [
                "Period: 90 days of instant core access",
                "Billing: 4,000 XAF, one-time, non-recurring",
            ],
        },
    },
    successMessage: "Unlocking your dashboard…",
};

interface ChannelPartnerPromoBannerProps {
    /** "horizontal" for a full-width bar (header), "vertical" for a stacked card (sidebar). */
    orientation?: "horizontal" | "vertical";
}

export function ChannelPartnerPromoBanner({ orientation = "horizontal" }: ChannelPartnerPromoBannerProps) {
    const router = useRouter();
    const [isPartner, setIsPartner] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [preflightError, setPreflightError] = useState("");

    // Read the lightweight privilege claim immediately on layout mounting pass
    useEffect(() => {
        async function runCheck() {
            const status = await checkChannelPartnerStatus();
            setIsPartner(status);
        }
        runCheck();
    }, []);

    // Gracefully stay invisible while authentication context resolves
    if (isPartner === null || isPartner === true) return null;

    async function handleBeforePay() {
        // Nothing to pre-flight for this purchase — the account record is
        // created after the mock payment succeeds, in handleSuccess below.
        setPreflightError("");
        return true;
    }

    async function handleSuccess(transactionId: string) {
        const result = await purchaseChannelPartnerAction(transactionId);
        if (result.success) {
            setIsPartner(true);
            setShowModal(false);
            router.refresh(); // Tells Next.js to flush layout caches and unlock features instantly
        } else {
            // The modal has already shown its success screen at this point since the
            // mock payment itself went through — surface this on the next open instead.
            setPreflightError(result.message);
        }
    }

    return (
        <>
            {orientation === "horizontal" ? (
                <HorizontalPromo onOpen={() => setShowModal(true)} />
            ) : (
                <VerticalPromo onOpen={() => setShowModal(true)} />
            )}

            {showModal && (
                <PaymentModal
                    amount={CHANNEL_PARTNER_AMOUNT}
                    onBeforePay={handleBeforePay}
                    onSuccess={handleSuccess}
                    preflightError={preflightError}
                    onClose={() => setShowModal(false)}
                    context={CHANNEL_PARTNER_MODAL_CONTEXT}
                />
            )}
        </>
    );
}

/* ── Horizontal: full-width bar for the header ── */
function HorizontalPromo({ onOpen }: { onOpen: () => void }) {
    return (
        <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
            style={{ borderColor: GOLD.border, background: GOLD.bg }}
        >
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: GOLD.accent }}
                >
                    <SparkleIcon size={15} color="white" />
                </span>
                <p className="min-w-0 text-[13px] leading-snug" style={{ color: GOLD.text }}>
                    <span className="font-semibold">{PARTNER_COPY.title}.</span>{" "}
                    <span style={{ color: GOLD.textMuted }}>{PARTNER_COPY.subtitle}</span>
                </p>
            </div>

            <button
                type="button"
                onClick={onOpen}
                className="h-9 shrink-0 rounded-md px-4 text-[13px] font-semibold text-white shadow-sm transition-colors"
                style={{ background: GOLD.accent }}
                onMouseEnter={(e) => (e.currentTarget.style.background = GOLD.accentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD.accent)}
            >
                {PARTNER_COPY.cta}
            </button>
        </div>
    );
}

/* ── Vertical: stacked card for the sidebar ── */
function VerticalPromo({ onOpen }: { onOpen: () => void }) {
    return (
        <div
            className="rounded-lg border p-3"
            style={{ borderColor: GOLD.border, background: GOLD.bg }}
        >
            <div className="mb-1.5 flex items-center gap-2">
                <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: GOLD.accent }}
                >
                    <SparkleIcon size={12} color="white" />
                </span>
                <p className="text-[12px] font-semibold leading-snug" style={{ color: GOLD.text }}>
                    {PARTNER_COPY.title}
                </p>
            </div>
            <p className="mb-2.5 text-[11px] leading-snug" style={{ color: GOLD.textMuted }}>
                {PARTNER_COPY.subtitle}
            </p>
            <button
                type="button"
                onClick={onOpen}
                className="py-1 w-full rounded-md text-[12px] font-semibold text-white transition-colors"
                style={{ background: GOLD.accent }}
                onMouseEnter={(e) => (e.currentTarget.style.background = GOLD.accentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD.accent)}
            >
                {PARTNER_COPY.cta}
            </button>
        </div>
    );
}

function SparkleIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2c.4 2.8 1.1 4.7 2.1 5.7S16.9 9.4 19.7 9.8c-2.8.4-4.7 1.1-5.7 2.1S12.4 14.9 12 17.7c-.4-2.8-1.1-4.7-2.1-5.7S7.1 10.2 4.3 9.8c2.8-.4 4.7-1.1 5.7-2.1S11.6 4.8 12 2z" />
        </svg>
    );
}