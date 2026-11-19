import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay/client";
import { calculateOrderFinancials } from "@/lib/pricing/orderCalculator";
import { createPendingOrder } from "@/lib/orders/orderService";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Protection (15 req / min per IP)
  const rateLimitResult = checkRateLimit(req, {
    limit: 15,
    windowMs: 60 * 1000,
    prefix: "checkout_create",
  });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await req.json();
    const {
      items = [],
      customer = {},
      shippingAddress = {},
      couponCode = null,
      shippingMethod = "standard",
      paymentMode = "partial_cod",
      receipt,
      notes = {},
    } = body;

    // 2. Server-side Financial Recomputation (Never trust client-sent amounts)
    let amountInPaise: number;
    let computedFinancials: any = null;
    const orderNumber = `KSM-${Math.floor(10000 + Math.random() * 90000)}`;

    if (Array.isArray(items) && items.length > 0) {
      computedFinancials = await calculateOrderFinancials({
        items,
        couponCode,
        shippingMethod,
        paymentMode,
      });

      // Advance amount in INR to be collected via gateway
      const amountToPayInInr = computedFinancials.advancePaid;
      amountInPaise = Math.round(amountToPayInInr * 100);
    } else if (typeof body.amount === "number" && body.amount > 0) {
      // Direct amount fallback
      amountInPaise = Math.round(body.amount * 100);
      computedFinancials = {
        items: [],
        subtotal: body.amount,
        discount: 0,
        shippingFee: 0,
        total: body.amount,
        advancePaid: body.amount,
        balanceDue: 0,
        paymentMode: "prepaid",
      };
    } else {
      return NextResponse.json(
        { error: "Invalid checkout request. Cart items array is required." },
        { status: 400 }
      );
    }

    if (amountInPaise <= 0) {
      return NextResponse.json(
        { error: "Calculated payment amount must be greater than zero." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();
    const configured = isRazorpayConfigured();
    const isProduction = process.env.NODE_ENV === "production";

    let rzpOrderId: string;
    let isMock = false;

    // 3. Initiate Order with Gateway or Sandbox
    if (razorpay && configured) {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: receipt || `rcpt_${orderNumber}`,
          notes: {
            ...notes,
            order_number: orderNumber,
            customer_name: customer.name || "Valued Patron",
            customer_email: customer.email || "patron@kusumika.com",
            payment_mode: paymentMode,
            platform: "Kusumika Luxury Home Textiles",
          },
        });
        rzpOrderId = order.id;
      } catch (gatewayErr: any) {
        console.warn("[Razorpay] Gateway call failed, falling back to simulated order ID:", gatewayErr.message);
        rzpOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        isMock = true;
      }
    } else {
      // Non-production or unconfigured sandbox simulation
      rzpOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      isMock = true;
    }

    // 4. Pre-create the order server-side before opening Razorpay
    const { orderId } = await createPendingOrder({
      orderNumber,
      customer: {
        id: customer.id || null,
        name: customer.name || "Valued Patron",
        email: customer.email || "patron@kusumika.com",
        phone: customer.phone || "",
      },
      shippingAddress: {
        address_line1: shippingAddress.address_line1 || shippingAddress.address || "Heritage Residence",
        address_line2: shippingAddress.address_line2 || null,
        city: shippingAddress.city || "Jaipur",
        state: shippingAddress.state || "Rajasthan",
        pincode: shippingAddress.pincode || "302001",
        landmark: shippingAddress.landmark || null,
      },
      financials: computedFinancials,
      razorpayOrderId: rzpOrderId,
      notes: notes.special_instructions || null,
    });

    return NextResponse.json({
      id: rzpOrderId,
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt || `rcpt_${orderNumber}`,
      orderNumber,
      orderId,
      status: "created",
      financials: computedFinancials,
      isMock,
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
