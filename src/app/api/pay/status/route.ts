// api/pay/status/route.ts

import { NextResponse } from "next/server";

const FAPSHI_BASE_URL = process.env.FAPSHI_BASE_URL || "https://sandbox.fapshi.com";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const transId = searchParams.get("ref"); // we pass fapshi_trans_id as ref

        if (!transId) {
            return NextResponse.json({ error: "Missing ref (transId)" }, { status: 400 });
        }

        const apiUser = process.env.FAPSHI_API_USER || "";
        const apiKey = process.env.FAPSHI_API_KEY || "";

        if (!apiUser || !apiKey) {
            return NextResponse.json({ error: "Gateway not configured" }, { status: 500 });
        }

        const res = await fetch(`${FAPSHI_BASE_URL}/payment-status/${transId}`, {
            method: "GET",
            headers: {
                apiuser: apiUser,
                apikey: apiKey,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch status" },
                { status: res.status }
            );
        }

        // Map Fapshi statuses to something simple for the frontend
        // CREATED | PENDING | SUCCESSFUL | FAILED | EXPIRED
        return NextResponse.json({
            status: data.status,           // raw status
            message: data.reason || null,
            amount: data.amount,
            medium: data.medium,
            externalId: data.externalId,
            raw: process.env.NODE_ENV === "development" ? data : undefined,
        });
    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json(
            { error: "Failed to check payment status" },
            { status: 500 }
        );
    }
}