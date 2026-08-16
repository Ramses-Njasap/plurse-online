// src/app/actions/resend-otp.ts
"use server";

import { resend, DEFAULT_FROM_EMAIL } from "@/lib/resend";

interface SendResendOtpEmailPayload {
    to: string;
    otp: string;
}

// Exponential backoff delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendResendOtpEmail(
    payload: SendResendOtpEmailPayload,
    maxRetries = 3
) {
    const { to, otp } = payload;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            attempt++;
            const data = await resend.emails.send({
                from: DEFAULT_FROM_EMAIL,
                to: [to],
                subject: `${otp} is your new Plurse verification code`,
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937;">
                        <div style="margin-bottom: 24px;">
                            <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px 0;">New Verification Code</h2>
                            <p style="font-size: 14px; color: #4b5563; margin: 0;">Here is your newly requested verification code for Plurse.</p>
                        </div>

                        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                            <span style="font-size: 32px; font-weight: 800; color: #111827; letter-spacing: 6px;">${otp}</span>
                            <p style="font-size: 12px; color: #6b7280; margin: 12px 0 0 0;">This code expires in 1 hour.</p>
                        </div>

                        <p style="font-size: 13px; color: #6b7280; margin: 0 0 16px 0;">
                            If you didn't request a new code, you can safely ignore this email.
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

                        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                            &copy; ${new Date().getFullYear()} Plurse. All rights reserved.
                        </p>
                    </div>
                `,
            });

            if (!data.error) {
                return { success: true, data: data.data };
            }

            console.warn(`[EMAIL] Resend OTP attempt ${attempt}/${maxRetries} failed: ${data.error.message}`);
        } catch (error: any) {
            console.warn(`[EMAIL] Resend OTP attempt ${attempt}/${maxRetries} threw exception: ${error?.message}`);
        }

        if (attempt < maxRetries) {
            await delay(1000 * Math.pow(2, attempt - 1));
        }
    }

    console.error(`[EMAIL] All ${maxRetries} resend OTP delivery attempts failed for ${to}`);
    return { success: false, message: "Failed to dispatch email after multiple retries." };
}