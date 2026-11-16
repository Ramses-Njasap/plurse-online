// src/lib/contact/config.ts
//
// The ONLY file you need to edit to change contact details or message types.

import type { MessageTypeOption, SocialLink } from "./types";

export const CONTACT_CONFIG = {
    /**
     * WhatsApp number used by wa.me links.
     * Digits only: country code + number, NO "+", spaces or dashes.
     * Cameroon example: 237 6XX XXX XXX  ->  "2376XXXXXXXX"
     * TODO: replace with your real number.
     */
    whatsappNumber: "237671705816",

    /** Number used by the "Call now" button (tel: link). Include the "+". TODO: replace. */
    phoneHref: "+237671705816",

    /** How the number is displayed on screen. TODO: replace. */
    phoneDisplay: "+237 671 705 816",

    /** Shown on the call card. TODO: adjust to your real availability. */
    hours: "Mon – Sat, 8:00 – 18:00 (WAT)",
} as const;

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 1000;

export const MESSAGE_TYPES: MessageTypeOption[] = [
    {
        value: "general",
        label: "General question",
        hint: "Ask us anything about Plurse.",
        placeholder: "Hi, I'd like to know more about…",
    },
    {
        value: "payment",
        label: "Payment issue",
        hint: "Include the amount, the number you paid with, and the transaction ID if you have it.",
        placeholder: "I paid with MTN MoMo but my key was not activated…",
    },
    {
        value: "complaint",
        label: "Complaint",
        hint: "Tell us what went wrong and what you expected to happen.",
        placeholder: "I'm unhappy because…",
    },
    {
        value: "technical",
        label: "Technical problem",
        hint: "Describe what you were doing, what happened, and your device or operating system.",
        placeholder: "When I open the app and click…, it shows…",
    },
    {
        value: "access_key",
        label: "Access key or upgrade",
        hint: "Mention the business name linked to the key and whether it is a Trial or Lifetime key.",
        placeholder: "My trial key for the business … needs…",
    },
    {
        value: "partner",
        label: "Channel partner (redistributor)",
        hint: "Tell us your region and how you plan to resell Plurse.",
        placeholder: "I'd like to become a redistributor in…",
    },
    {
        value: "feature",
        label: "Feature request",
        hint: "Describe the problem you want solved, not just the feature.",
        placeholder: "It would help my business if Plurse could…",
    },
    {
        value: "other",
        label: "Something else",
        hint: "Write whatever you need to tell us.",
        placeholder: "Write your message here…",
    },
];

/**
 * Social profiles shown on the contact page.
 * TODO: replace each URL with your real profile link.
 * To hide a platform, set its url to "" (empty string) or delete the entry.
 */
export const SOCIAL_LINKS: SocialLink[] = [
    { platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@plurse" },
    { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/plurse" },
    { platform: "youtube", label: "YouTube", url: "https://www.youtube.com/@plurse" },
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/plurse" },
    { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/plurse" },
];