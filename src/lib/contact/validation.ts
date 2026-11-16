// src/lib/contact/validation.ts

import { MESSAGE_MAX_LENGTH, MESSAGE_MIN_LENGTH, MESSAGE_TYPES } from "./config";
import type { ContactFormErrors, ContactFormField, ContactFormValues } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Order used to focus the first invalid field. */
export const FIELD_ORDER: ContactFormField[] = ["name", "email", "messageType", "message"];

export function validateField(
    field: ContactFormField,
    values: ContactFormValues
): string | undefined {
    switch (field) {
        case "name": {
            const v = values.name.trim();
            if (!v) return "Enter your name.";
            if (v.length < 2) return "Your name must be at least 2 characters.";
            return undefined;
        }
        case "email": {
            const v = values.email.trim();
            if (!v) return "Enter your email address.";
            if (!EMAIL_RE.test(v)) return "Enter a valid email, like name@example.com.";
            return undefined;
        }
        case "messageType": {
            if (!values.messageType) return "Choose what your message is about.";
            if (!MESSAGE_TYPES.some((t) => t.value === values.messageType)) {
                return "Choose one of the listed options.";
            }
            return undefined;
        }
        case "message": {
            const v = values.message.trim();
            if (!v) return "Write your message.";
            if (v.length < MESSAGE_MIN_LENGTH) {
                return `Add a little more detail (at least ${MESSAGE_MIN_LENGTH} characters).`;
            }
            if (v.length > MESSAGE_MAX_LENGTH) {
                return `Keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
            }
            return undefined;
        }
    }
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
    const errors: ContactFormErrors = {};
    for (const field of FIELD_ORDER) {
        const error = validateField(field, values);
        if (error) errors[field] = error;
    }
    return errors;
}