import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes = {} } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number in INR." },
        { status: 400 }
      );
    }

    // Razorpay requires amounts in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    const razorpay = getRazorpayClient();

    if (razorpay && isRazorpayConfigured()) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: {
          ...notes,
          platform: "Kusumika Luxury Home Textiles",
        },
      });

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        isMock: false,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      });
    }

    // Sandbox / Local Simulation Fallback
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return NextResponse.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: "created",
      isMock: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_kusumika_sandbox",
    });
  } catch (error: any) {
    console.error("[Razorpay Create Order Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment order with Razorpay." },
      { status: 500 }
    );
  }
}
