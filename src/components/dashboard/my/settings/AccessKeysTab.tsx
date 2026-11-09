// src/components/dashboard/my/settings/AccessKeysTab.tsx

"use client";

import { useState } from "react";
import SettingsCard from "./SettingsCard";
import { useToast } from "@/components/ui";
import { MIN_PRICE, formatXAF } from "./accesskeys/commission";
import { PricingInput } from "./accesskeys/PricingInput";
import { TierLadder } from "./accesskeys/TierLadder";
import { CommissionBreakdown } from "./accesskeys/CommissionBreakdown";

interface AccessKeysTabProps {
    /** The price currently saved for this partner. */
    initialPrice?: number;
    /** Persist the price (e.g. a server action). When omitted, saving is simulated. */
    onSavePrice?: (price: number) => Promise<{ success: boolean; message?: string }>;
}

export default function AccessKeysTab({ initialPrice = MIN_PRICE, onSavePrice }: AccessKeysTabProps) {
    const toast = useToast();

    const [savedPrice, setSavedPrice] = useState(initialPrice);
    const [raw, setRaw] = useState(String(initialPrice));
    const [touched, setTouched] = useState(false);
    const [saving, setSaving] = useState(false);

    const parsed = Number(raw) || 0;
    const isValid = parsed >= MIN_PRICE;
    /* The breakdown always shows a valid price, so it never flashes zeros while typing */
    const price = isValid ? parsed : MIN_PRICE;
    const isDirty = isValid ? parsed !== savedPrice : raw !== String(savedPrice);
    const error = touched && !isValid ? `The minimum price is ${formatXAF(MIN_PRICE)}.` : undefined;

    function handleSelectTier(threshold: number) {
        setRaw(String(threshold));
        setTouched(false);
    }

    function handleReset() {
        setRaw(String(savedPrice));
        setTouched(false);
    }

    async function handleSave() {
        setTouched(true);
        if (!isValid || !isDirty) return;

        setSaving(true);
        try {
            // TODO: replace the simulated call with a server action and pass it as onSavePrice.
            const result = onSavePrice
                ? await onSavePrice(parsed)
                : await new Promise<{ success: boolean; message?: string }>((r) => setTimeout(() => r({ success: true }), 600));

            if (result.success) {
                setSavedPrice(parsed);
                toast.success(`Your default key price is now ${formatXAF(parsed)}.`, { title: "Pricing saved" });
            } else {
                toast.error(result.message ?? "We couldn't save your pricing.", { title: "Pricing not saved" });
            }
        } catch (err) {
            console.error("Save pricing client issue:", err);
            toast.error("An unexpected error occurred while saving your pricing.", { title: "Something went wrong" });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <SettingsCard
                title="Standalone access key pricing"
                description="Set the default selling price for standalone keys. Your share of each sale grows with the price, up to 70%."
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Inputs */}
                    <div className="space-y-6 lg:col-span-3">
                        <PricingInput
                            value={raw}
                            onChange={(digits) => setRaw(digits)}
                            onBlur={() => setTouched(true)}
                            error={error}
                        />
                        <TierLadder price={price} onSelect={handleSelectTier} />
                    </div>

                    {/* Live result */}
                    <div className="lg:col-span-2">
                        <CommissionBreakdown price={price} />
                    </div>
                </div>

                {/* Action bar */}
                <div
                    className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"
                    style={{ borderColor: "var(--border)" }}
                >
                    <p className="flex items-center gap-2 text-[12px]" style={{ color: "var(--text-subtle)" }} aria-live="polite">
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: isDirty ? "#d97706" : "#16a34a" }}
                        />
                        {isDirty ? "You have unsaved changes." : `Saved at ${formatXAF(savedPrice)}.`}
                    </p>

                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={saving}
                                className="h-9 rounded-lg border px-3 text-[13px] font-medium transition-all disabled:opacity-50"
                                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
                            >
                                Discard
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !isDirty || !isValid}
                            className="h-9 rounded-lg px-4 text-[13px] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ background: "var(--brand)" }}
                            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--brand-hover)"; }}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                        >
                            {saving ? "Saving…" : "Save pricing"}
                        </button>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
}