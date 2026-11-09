// api/pay/route.ts

import { NextResponse } from "next/server";

const FAPSHI_BASE_URL = process.env.FAPSHI_BASE_URL || "https://sandbox.fapshi.com";

export async function POST(request: Request) {
    try {
        const { amount, phone, provider, email, name } = await request.json();

        // 1. Validation
        if (!amount || !phone || !provider) {
            return NextResponse.json(
                { error: "Missing required fields: amount, phone, provider." },
                { status: 400 }
            );
        }

        const cleanPhone = String(phone).replace(/\D/g, "");
        if (cleanPhone.length < 9) {
            return NextResponse.json(
                { error: "Invalid Cameroonian phone number." },
                { status: 400 }
            );
        }

        // Fapshi expects phone like 67XXXXXXX or 69XXXXXXX (without +237)
        const formattedPhone = cleanPhone.slice(-9);

        const apiUser = process.env.FAPSHI_API_USER || "";
        const apiKey = process.env.FAPSHI_API_KEY || "";

        if (!apiUser || !apiKey) {
            return NextResponse.json(
                { error: "Payment gateway not configured." },
                { status: 500 }
            );
        }

        // externalId = your own unique reference (for reconciliation)
        const externalId = `TXN-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase()}`;

        // medium is optional – omit to let Fapshi auto-detect, or force it
        const medium =
            provider === "mtn" ? "mobile money" : provider === "orange" ? "orange money" : undefined;

        // -------------------------------------------------------------
        // Direct Pay – pushes USSD to the customer's phone
        // -------------------------------------------------------------
        const response = await fetch(`${FAPSHI_BASE_URL}/direct-pay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apiuser: apiUser,
                apikey: apiKey,
            },
            body: JSON.stringify({
                amount: Number(amount),          // minimum 100 XAF
                phone: formattedPhone,
                medium,                          // optional
                name: name || "Valued Customer",
                email: email || "customer@plurse.com",
                externalId,
                message: `Payment via ${provider === "mtn" ? "MTN MoMo" : "Orange Money"}`,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Fapshi direct-pay error:", data);
            return NextResponse.json(
                { error: data.message || "Failed to initiate payment." },
                { status: 400 }
            );
        }

        // Success – USSD push has been sent
        return NextResponse.json({
            success: true,
            transaction_reference: externalId,   // your reference
            fapshi_trans_id: data.transId,       // Fapshi's transId (use this for status checks)
            message: "USSD push sent. Check your phone to approve.",
        });
    } catch (error) {
        console.error("Fapshi Gateway Error:", error);
        return NextResponse.json(
            { error: "Internal server error communicating with payment gateway." },
            { status: 500 }
        );
    }
}