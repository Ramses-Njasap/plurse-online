// src/components/contact/ContactForm.tsx
"use client";

import { useState, type FormEvent } from "react";

import { MESSAGE_MAX_LENGTH, MESSAGE_TYPES } from "@/lib/contact/config";
import type {
    ContactFormErrors,
    ContactFormField,
    ContactFormValues,
} from "@/lib/contact/types";
import { FIELD_ORDER, validateContactForm, validateField } from "@/lib/contact/validation";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";

import { FormField, fieldClass } from "./FormField";
import { MessageTypeSelect } from "./MessageTypeSelect";
import { ContactSuccess } from "./ContactSuccess";
import { SendIcon } from "./ContactIcons";

const EMPTY_VALUES: ContactFormValues = {
    name: "",
    email: "",
    messageType: "",
    message: "",
};

const FIELD_IDS: Record<ContactFormField, string> = {
    name: "contact-name",
    email: "contact-email",
    messageType: "contact-type",
    message: "contact-message",
};

export function ContactForm() {
    const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});
    const [sentUrl, setSentUrl] = useState<string | null>(null);

    const selectedType = MESSAGE_TYPES.find((t) => t.value === values.messageType);

    function setField<K extends ContactFormField>(field: K, value: ContactFormValues[K]) {
        const next = { ...values, [field]: value };
        setValues(next);
        // Once a field has been visited, keep its error up to date while typing.
        if (touched[field]) {
            setErrors((prev) => ({ ...prev, [field]: validateField(field, next) }));
        }
    }

    function blurField(field: ContactFormField) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const nextErrors = validateContactForm(values);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setTouched({ name: true, email: true, messageType: true, message: true });

            const firstInvalid = FIELD_ORDER.find((f) => nextErrors[f]);
            if (firstInvalid) document.getElementById(FIELD_IDS[firstInvalid])?.focus();
            return;
        }

        const url = buildWhatsAppUrl(values);
        // Opened directly inside the click handler so popup blockers allow it.
        window.open(url, "_blank", "noopener,noreferrer");
        setSentUrl(url);
    }

    function handleReset() {
        setValues(EMPTY_VALUES);
        setErrors({});
        setTouched({});
        setSentUrl(null);
    }

    return (
        <div
            className="rounded-2xl border bg-white p-6 sm:p-8"
            style={{ borderColor: "var(--border)" }}
        >
            {sentUrl ? (
                <ContactSuccess whatsappUrl={sentUrl} onReset={handleReset} />
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                        <h2 className="text-[18px] font-semibold" style={{ color: "var(--foreground)" }}>
                            Send us a message
                        </h2>
                        <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
                            It opens in WhatsApp with everything filled in, ready for you to send.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField id={FIELD_IDS.name} label="Your name" required error={errors.name}>
                            <input
                                id={FIELD_IDS.name}
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={values.name}
                                onChange={(e) => setField("name", e.target.value)}
                                onBlur={() => blurField("name")}
                                placeholder="e.g. Amara Nkosi"
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? `${FIELD_IDS.name}-error` : undefined}
                                className={fieldClass(!!errors.name, "h-[44px]")}
                            />
                        </FormField>

                        <FormField id={FIELD_IDS.email} label="Email address" required error={errors.email}>
                            <input
                                id={FIELD_IDS.email}
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={values.email}
                                onChange={(e) => setField("email", e.target.value)}
                                onBlur={() => blurField("email")}
                                placeholder="you@business.com"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? `${FIELD_IDS.email}-error` : undefined}
                                className={fieldClass(!!errors.email, "h-[44px]")}
                            />
                        </FormField>
                    </div>

                    <FormField
                        id={FIELD_IDS.messageType}
                        label="What is this about?"
                        required
                        error={errors.messageType}
                    >
                        <MessageTypeSelect
                            id={FIELD_IDS.messageType}
                            value={values.messageType}
                            onChange={(v) => setField("messageType", v)}
                            onBlur={() => blurField("messageType")}
                            hasError={!!errors.messageType}
                            describedBy={errors.messageType ? `${FIELD_IDS.messageType}-error` : undefined}
                        />
                    </FormField>

                    <FormField
                        id={FIELD_IDS.message}
                        label="Your message"
                        required
                        error={errors.message}
                        hint={selectedType?.hint}
                        counter={`${values.message.length}/${MESSAGE_MAX_LENGTH}`}
                    >
                        <textarea
                            id={FIELD_IDS.message}
                            name="message"
                            rows={6}
                            maxLength={MESSAGE_MAX_LENGTH}
                            value={values.message}
                            onChange={(e) => setField("message", e.target.value)}
                            onBlur={() => blurField("message")}
                            placeholder={selectedType?.placeholder ?? "Write your message here…"}
                            aria-invalid={!!errors.message}
                            aria-describedby={
                                errors.message
                                    ? `${FIELD_IDS.message}-error`
                                    : selectedType
                                        ? `${FIELD_IDS.message}-hint`
                                        : undefined
                            }
                            className={fieldClass(!!errors.message, "min-h-[140px] resize-y py-3 leading-relaxed")}
                        />
                    </FormField>

                    <button
                        type="submit"
                        className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
                        style={{ background: "var(--brand)" }}
                    >
                        <SendIcon size={16} />
                        Send on WhatsApp
                    </button>
                </form>
            )}
        </div>
    );
}