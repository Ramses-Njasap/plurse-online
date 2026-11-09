// api/webhooks/fapshi/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const webhookSecret = process.env.FAPSHI_WEBHOOK_SECRET || "";

        // Fapshi sends the secret in the header x-wh-secret
        const receivedSecret = request.headers.get("x-wh-secret") || "";

        if (webhookSecret && receivedSecret !== webhookSecret) {
            return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
        }

        const event = JSON.parse(rawBody);

        // event looks like the payment-status response:
        // { transId, status, medium, amount, externalId, userId, ... }

        const status = event.status; // SUCCESSFUL | FAILED | EXPIRED | ...
        const externalId = event.externalId;
        const transId = event.transId;

        if (status === "SUCCESSFUL") {
            console.log(`✅ Payment successful – externalId: ${externalId}, transId: ${transId}`);

            // -------------------------------------------------
            // TODO: Mark order / key as paid in your database
            // Example:
            // await db.keys.update({
            //   where: { reference: externalId },
            //   data: { status: "paid", fapshiTransId: transId }
            // });
            // -------------------------------------------------
        } else if (status === "FAILED") {
            console.log(`❌ Payment failed – externalId: ${externalId}`);
        } else if (status === "EXPIRED") {
            console.log(`⌛ Payment link expired – externalId: ${externalId}`);
        }

        // Always return 200 quickly so Fapshi stops retrying
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Fapshi webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
