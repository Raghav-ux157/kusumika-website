import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Check signature if secret is configured
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
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    console.log(`[Razorpay Webhook Received]: ${eventType}`, {
      id: event.payload?.payment?.entity?.id || event.payload?.order?.entity?.id,
    });

    const supabase: any = getSupabaseAdminClient();

    switch (eventType) {
      case "payment.captured": {
        const paymentEntity = event.payload?.payment?.entity;
        if (paymentEntity && supabase) {
          const razorpayPaymentId = paymentEntity.id;
          const razorpayOrderId = paymentEntity.order_id;
          const amountInInr = (paymentEntity.amount || 0) / 100;

          // Check if payment already recorded
          const { data: existingPayment } = await supabase
            .from("payments")
            .select("id, status")
            .eq("razorpay_payment_id", razorpayPaymentId)
            .maybeSingle();

          if (existingPayment) {
            if (existingPayment.status !== "captured") {
              await supabase
                .from("payments")
                .update({ status: "captured" })
                .eq("id", existingPayment.id);
            }
          } else {
            // Find corresponding order if exists
            const { data: order } = await supabase
              .from("orders")
              .select("id, total, advance_paid")
              .eq("order_number", paymentEntity.notes?.order_number || "")
              .maybeSingle();

            if (order) {
              await supabase.from("payments").insert({
                order_id: order.id,
                gateway: "razorpay",
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                amount: amountInInr,
                status: "captured",
                payment_type: amountInInr < order.total ? "advance" : "full",
                metadata: paymentEntity,
              });
            }
          }
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = event.payload?.payment?.entity;
        console.warn("[Razorpay Webhook] Payment failed:", {
          id: paymentEntity?.id,
          order_id: paymentEntity?.order_id,
          error_code: paymentEntity?.error_code,
          error_description: paymentEntity?.error_description,
        });

        if (paymentEntity && supabase) {
          const orderNumber = paymentEntity.notes?.order_number;
          if (orderNumber) {
            // Record failure in payments table or log alert
            const { data: order } = await supabase
              .from("orders")
              .select("id")
              .eq("order_number", orderNumber)
              .maybeSingle();

            if (order) {
              await supabase.from("payments").insert({
                order_id: order.id,
                gateway: "razorpay",
                razorpay_order_id: paymentEntity.order_id,
                razorpay_payment_id: paymentEntity.id,
                amount: (paymentEntity.amount || 0) / 100,
                status: "failed",
                payment_type: "advance",
                metadata: {
                  error_code: paymentEntity.error_code,
                  error_description: paymentEntity.error_description,
                  failed_at: new Date().toISOString(),
                },
              });
            }
          }
        }
        break;
      }

      case "order.paid": {
        const orderEntity = event.payload?.order?.entity;
        console.log("[Razorpay Webhook] Order fully paid:", orderEntity?.id);
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Razorpay Webhook Handler Error]:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
