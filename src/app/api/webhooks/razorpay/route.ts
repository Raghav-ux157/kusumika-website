import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmOrderPayment } from "@/lib/orders/orderService";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Mandatory Cryptographic Webhook Signature Verification
    if (webhookSecret && webhookSecret !== "your_webhook_secret") {
      if (!signature) {
        return NextResponse.json(
          { error: "Missing x-razorpay-signature header" },
          { status: 400 }
        );
      }

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("[Razorpay Webhook] Invalid webhook signature", {
          expected: expectedSignature,
          received: signature,
        });
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Razorpay webhook secret is not configured in production." },
        { status: 500 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    console.log(`[Razorpay Webhook Verified]: Event ${eventType}`);

    switch (eventType) {
      case "payment.captured":
      case "order.paid": {
        const paymentEntity = event.payload?.payment?.entity;
        if (!paymentEntity) {
          return NextResponse.json({ success: true, message: "No payment entity found in payload" });
        }

        const razorpayPaymentId = paymentEntity.id;
        const razorpayOrderId = paymentEntity.order_id;
        const orderNumber = paymentEntity.notes?.order_number;
        const amountInInr = (paymentEntity.amount || 0) / 100;

        // 2. Process payment with idempotency (prevents duplicate orders or notifications on retries)
        const confirmation = await confirmOrderPayment({
          razorpayPaymentId,
          razorpayOrderId,
          orderNumber,
          amountPaidInInr: amountInInr,
          metadata: {
            webhook_event: eventType,
            captured_at: new Date().toISOString(),
          },
        });

        return NextResponse.json({
          success: true,
          idempotent: confirmation.alreadyProcessed,
          orderNumber: confirmation.orderNumber,
          status: confirmation.status,
          message: confirmation.message,
        });
      }

      case "payment.failed": {
        const paymentEntity = event.payload?.payment?.entity;
        console.warn("[Razorpay Webhook] Payment failed:", {
          id: paymentEntity?.id,
          order_id: paymentEntity?.order_id,
          error_code: paymentEntity?.error_code,
          error_description: paymentEntity?.error_description,
        });
        return NextResponse.json({ success: true, status: "payment_failed_recorded" });
      }

      default:
        return NextResponse.json({ success: true, status: "event_ignored" });
    }
  } catch (error: any) {
    console.error("[Razorpay Webhook Processing Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Razorpay webhook" },
      { status: 500 }
    );
  }
}
