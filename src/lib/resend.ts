// src/lib/resend.ts
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Standard sender configuration for Plurse
export const DEFAULT_FROM_EMAIL = "Plurse <noreply@plurse.com>";
export const SUPPORT_EMAIL = "support@plurse.com";