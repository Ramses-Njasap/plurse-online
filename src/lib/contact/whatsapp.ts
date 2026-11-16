// src/lib/contact/whatsapp.ts

import { CONTACT_CONFIG, MESSAGE_TYPES } from "./config";
import type { ContactFormValues } from "./types";

/** Builds the text that will be pre-filled in WhatsApp (WhatsApp supports *bold*). */
export function buildWhatsAppMessage(values: ContactFormValues): string {
    const typeLabel =
        MESSAGE_TYPES.find((t) => t.value === values.messageType)?.label ?? "General question";

    return [
        "*New message from the Plurse website*",
        "",
        `*Type:* ${typeLabel}`,
        `*Name:* ${values.name.trim()}`,
        `*Email:* ${values.email.trim()}`,
        "",
        "*Message:*",
        values.message.trim(),
    ].join("\n");
}

/** wa.me click-to-chat link that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppUrl(values: ContactFormValues): string {
    const text = encodeURIComponent(buildWhatsAppMessage(values));
    return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${text}`;
}