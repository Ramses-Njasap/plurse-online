"use client";

import { useState } from "react";
import type { KeyType } from "@/types/users.types";
import { Field, TextInput, Toggle, InfoRow } from "../../keys/new-key-modal/ModalPrimitives";

const TRIAL_AMOUNT = 500;
const LIFETIME_AMOUNT = 15000;

function generateKeyCode(): string {
    const seg = () => Math.random().toString(36).slice(2, 10).toUpperCase();
    return `PLURSE-${seg()}-${seg()}`;
}

export interface KeyFormValues {
    key_code: string;
    key_type: KeyType;
    amount: number;
    deduct_trial_fee: boolean;
}

interface KeyFormProps {
    onRequestCreate: (values: KeyFormValues) => void;
    onRequestCreateAndLink: (values: KeyFormValues) => void;
    /**
     * When true (used on the businesses page), hides the "Create & link"
     * button and relabels "Create only" → "Continue to payment".
     * The parent handles the linking step itself.
     */
    createOnlyMode?: boolean;
}

export function KeyForm({ onRequestCreate, onRequestCreateAndLink, createOnlyMode = false }: KeyFormProps) {
    const [keyCode] = useState(() => generateKeyCode());
    const [keyType, setKeyType] = useState<KeyType>("TRIAL");
    const [amount, setAmount] = useState(TRIAL_AMOUNT);
    const [deductFee, setDeductFee] = useState(false);

    function handleKeyTypeChange(t: KeyType) {
        setKeyType(t);
        setAmount(t === "TRIAL" ? TRIAL_AMOUNT : LIFETIME_AMOUNT);
        if (t === "TRIAL") setDeductFee(false);
    }

    const values: KeyFormValues = {
        key_code: keyCode, key_type: keyType, amount, deduct_trial_fee: deductFee,
    };
    const amountEditable = keyType === "LIFETIME";

    return (
        <div className="space-y-5">
            <Field label="Key code" hint="Auto-generated. Cannot be changed.">
                <TextInput value={keyCode} readOnly />
            </Field>

            <Field label="Key type">
                <div className="grid grid-cols-2 gap-2">
                    {(["TRIAL", "LIFETIME"] as KeyType[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => handleKeyTypeChange(t)}
                            className="rounded-xl border py-3 text-[13px] font-medium capitalize transition-all"
                            style={
                                keyType === t
                                    ? { borderColor: "var(--brand)", background: "var(--brand-light)", color: "var(--brand)" }
                                    : { borderColor: "var(--border)", background: "white", color: "var(--text-muted)" }
                            }
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </Field>

            <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
                <div>
                    <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>Active</p>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                        Keys are inactive at creation and activated upon first use.
                    </p>
                </div>
                <Toggle checked={false} disabled />
            </div>

            <Field
                label="Amount (XAF)"
                hint={amountEditable
                    ? "Default 15,000 XAF for lifetime keys. You can adjust this."
                    : "Fixed at 500 XAF for trial keys."}
            >
                <TextInput
                    type="number"
                    value={String(amount)}
                    onChange={(v) => setAmount(Number(v))}
                    readOnly={!amountEditable}
                    disabled={!amountEditable}
                />
            </Field>

            {keyType === "TRIAL" && (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>Deduct trial fee</p>
                        <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                            Deduct the trial amount from the first billing cycle.
                        </p>
                    </div>
                    <Toggle checked={deductFee} onChange={setDeductFee} />
                </div>
            )}

            <div
                className="space-y-2 rounded-xl p-4"
                style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
            >
                <InfoRow label="Key code" value={<span className="font-mono text-[12px]">{keyCode.slice(0, 15)}…</span>} />
                <InfoRow label="Type" value={keyType === "TRIAL" ? "Trial" : "Lifetime"} />
                <InfoRow label="Amount" value={`${amount.toLocaleString()} XAF`} />
                {keyType === "TRIAL" && <InfoRow label="Deduct fee" value={deductFee ? "Yes" : "No"} />}
                <InfoRow label="Is active" value="No (set on first use)" />
            </div>

            <div
                className="space-y-2 rounded-xl p-3"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
                <p className="text-center text-[11px] font-medium" style={{ color: "#d97706" }}>
                    Payment of {amount.toLocaleString()} XAF is required to proceed.
                </p>
            </div>

            <div className="space-y-2 pt-1">
                {/* In standard mode show both buttons; in createOnlyMode show one */}
                {!createOnlyMode && (
                    <button
                        type="button"
                        onClick={() => onRequestCreateAndLink(values)}
                        className="h-[42px] w-full rounded-xl text-[13px] font-medium text-white transition-all"
                        style={{ background: "var(--brand)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                    >
                        Create &amp; link to a business
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onRequestCreate(values)}
                    className="h-[42px] w-full rounded-xl text-[13px] font-medium transition-all"
                    style={
                        createOnlyMode
                            ? { background: "var(--brand)", color: "white" }
                            : { borderColor: "var(--border)", color: "var(--text-muted)", background: "white", border: "1px solid var(--border)" }
                    }
                    onMouseEnter={(e) => {
                        if (createOnlyMode) e.currentTarget.style.background = "var(--brand-hover)";
                        else e.currentTarget.style.background = "var(--surface-muted)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = createOnlyMode ? "var(--brand)" : "white";
                    }}
                >
                    {createOnlyMode ? "Continue to payment" : "Create only"}
                </button>
            </div>
        </div>
    );
}