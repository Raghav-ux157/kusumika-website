import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isRazorpayConfigured } from "@/lib/razorpay/client";
import { confirmOrderPayment } from "@/lib/orders/orderService";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Protection (15 req / min per IP)
  const rateLimitResult = checkRateLimit(req, {
    limit: 15,
    windowMs: 60 * 1000,
    prefix: "checkout_verify",
  });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
      orderId,
    } = body;

    // Note: body.isMock is intentionally discarded. Client can never control mock status.

    if (!orderNumber && !razorpay_order_id && !orderId) {
      return NextResponse.json(
        { error: "Invalid payment verification request. Missing order identifier." },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const configured = isRazorpayConfigured();
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Mock mode is strictly forbidden in production OR whenever live Razorpay keys are configured
    const allowMock = !isProduction && !configured;

    // 2. Cryptographic HMAC Signature Verification
    if (!allowMock) {
      if (!secret) {
        return NextResponse.json(
          { error: "Razorpay secret key is not configured on the server." },
          { status: 500 }
        );
      }

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { error: "Missing cryptographic payment verification tokens (order_id, payment_id, signature)." },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        console.error("[Razorpay Verification Failed]: Signature mismatch", {
          expected: generatedSignature,
          received: razorpay_signature,
        });
        return NextResponse.json(
          { error: "Cryptographic payment verification failed. Potential tampering detected." },
          { status: 400 }
        );
      }
    } else {
      console.warn("[Payment Verification] Running local sandbox simulation (non-production, keys unset).");
    }

    // 3. Confirm payment with server-side idempotency
    const confirmation = await confirmOrderPayment({
      razorpayPaymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
      razorpayOrderId: razorpay_order_id || null,
      orderNumber: orderNumber || null,
      razorpaySignature: razorpay_signature || null,
      isMock: allowMock,
      metadata: {
        verified_via: "api_verify_payment",
      },
    });

    return NextResponse.json({
      success: true,
      idempotent: confirmation.alreadyProcessed,
      orderId: confirmation.orderId,
      orderNumber: confirmation.orderNumber,
      status: confirmation.status,
      message: confirmation.message,
    });
  } catch (error: any) {
    console.error("[Payment Verification Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during payment verification." },
      { status: 500 }
    );
  }
}
