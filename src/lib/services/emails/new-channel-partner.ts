// src/lib/services/emails/new-channel-partner.ts
"use server";

import { resend, SUPPORT_EMAIL } from "@/lib/resend";
import {
    SUPPORT_WHATSAPP_NUMBER,
    SUPPORT_WHATSAPP_LINK,
    WHATSAPP_CHANNEL_URL,
    WHATSAPP_CHANNEL_PARTNER_GROUP_URL,
} from "@/app/utils/constants";

interface SendChannelPartnerWelcomeEmailPayload {
    to: string;
    userName?: string;
    validTo: string;
}

// Exponential backoff delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendChannelPartnerWelcomeEmail(
    payload: SendChannelPartnerWelcomeEmailPayload,
    maxRetries = 3
) {
    const { to, userName, validTo } = payload;
    const formattedExpiry = new Date(validTo).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            attempt++;
            const data = await resend.emails.send({
                from: SUPPORT_EMAIL,
                to: [to],
                subject: "Plurse Channel Partner Confirmation & Onboarding",
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0f172a; line-height: 1.5; background-color: #ffffff;">
                        
                        <!-- Header / Greeting -->
                        <div style="margin-bottom: 28px;">
                            <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.02em;">
                                Welcome, ${userName || "Partner"}
                            </h2>
                            <p style="font-size: 14px; color: #334155; margin: 0; line-height: 1.6;">
                                Your application as an official <strong>Plurse Channel Partner & Redistributor</strong> has been confirmed. Your partner account privileges are now active through <strong>${formattedExpiry}</strong>.
                            </p>
                        </div>

                        <!-- Role & Representation Clause -->
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                            <h3 style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                Representative Responsibilities
                            </h3>
                            <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">
                                As a Channel Partner, you serve as the direct link and official representative of Plurse to the client businesses you onboard. You are responsible for maintaining brand integrity, issuing valid access keys, and providing primary orientation to your client network.
                            </p>
                        </div>

                        <!-- Core Capabilities -->
                        <div style="border-left: 3px solid #0f172a; padding-left: 16px; margin-bottom: 28px;">
                            <h3 style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 10px 0;">
                                Operational Capabilities
                            </h3>
                            <ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 13px; line-height: 1.7;">
                                <li>Provision and issue stand-alone business access keys to target clients.</li>
                                <li>Monitor revenue distributions and earned commissions inside your partner dashboard.</li>
                                <li>Access dedicated operational and technical priority support channels.</li>
                            </ul>
                        </div>

                        <!-- Partner Network Links -->
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 28px; text-align: left;">
                            <h3 style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 6px 0;">
                                Communication Channels
                            </h3>
                            <p style="font-size: 13px; color: #475569; margin: 0 0 16px 0;">
                                Connect with our core operations team and receive official allocation updates:
                            </p>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <a href="${WHATSAPP_CHANNEL_URL}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 500; font-size: 13px; text-decoration: none; padding: 9px 16px; border-radius: 4px;">
                                    Broadcast Channel
                                </a>
                                <a href="${WHATSAPP_CHANNEL_PARTNER_GROUP_URL}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-weight: 500; font-size: 13px; text-decoration: none; padding: 9px 16px; border-radius: 4px;">
                                    Partner Group
                                </a>
                            </div>
                        </div>

                        <!-- Direct Support Reference -->
                        <div style="margin-bottom: 32px;">
                            <h4 style="font-size: 13px; font-weight: 600; color: #0f172a; margin: 0 0 6px 0;">
                                Account & Key Management Support
                            </h4>
                            <p style="font-size: 13px; color: #475569; margin: 0 0 8px 0;">
                                For queries regarding key allocation or client support escalation, reach us via:
                            </p>
                            <p style="font-size: 13px; color: #334155; margin: 0 0 4px 0;">
                                <strong>Email:</strong> <a href="mailto:${SUPPORT_EMAIL}" style="color: #2563eb; text-decoration: none;">${SUPPORT_EMAIL}</a>
                            </p>
                            <p style="font-size: 13px; color: #334155; margin: 0;">
                                <strong>Direct WhatsApp:</strong> <a href="${SUPPORT_WHATSAPP_LINK}" target="_blank" style="color: #2563eb; text-decoration: none;">${SUPPORT_WHATSAPP_NUMBER}</a>
                            </p>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

                        <p style="font-size: 12px; color: #64748b; margin: 0;">
                            &copy; ${new Date().getFullYear()} Plurse. All rights reserved.
                        </p>
                    </div>
                `,
            });

            if (!data.error) {
                return { success: true, data: data.data };
            }

            console.warn(`[EMAIL] Partner Welcome attempt ${attempt}/${maxRetries} failed: ${data.error.message}`);
        } catch (error: any) {
            console.warn(`[EMAIL] Partner Welcome attempt ${attempt}/${maxRetries} threw exception: ${error?.message}`);
        }

        if (attempt < maxRetries) {
            await delay(1000 * Math.pow(2, attempt - 1));
        }
    }

    console.error(`[EMAIL] All ${maxRetries} Channel Partner Welcome email attempts failed for ${to}`);
    return { success: false, message: "Failed to dispatch email after multiple retries." };
}