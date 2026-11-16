// src/lib/contact/types.ts

export type MessageTypeValue =
    | "general"
    | "payment"
    | "complaint"
    | "technical"
    | "access_key"
    | "partner"
    | "feature"
    | "other";

export interface MessageTypeOption {
    value: MessageTypeValue;
    label: string;
    /** Short guidance shown under the message box once this type is picked. */
    hint: string;
    /** Placeholder for the message box once this type is picked. */
    placeholder: string;
}

export interface ContactFormValues {
    name: string;
    email: string;
    messageType: MessageTypeValue | "";
    message: string;
}

export type ContactFormField = keyof ContactFormValues;
export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export type SocialPlatform = "tiktok" | "facebook" | "youtube" | "instagram" | "linkedin";

export interface SocialLink {
    platform: SocialPlatform;
    /** Text shown on the tile and used for screen readers. */
    label: string;
    /** Full profile URL. Leave as "" to hide this platform. */
    url: string;
}