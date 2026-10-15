import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isRazorpayConfigured } from "@/lib/razorpay/client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail } from "@/lib/notifications/emailService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isMock = false,
      orderData,
    } = body;

    if (!orderData || !orderData.order_number || !orderData.customer_email) {
      return NextResponse.json(
        { error: "Invalid order data. Missing customer email or order reference." },
        { status: 400 }
      );
    }

    // 1. Cryptographic HMAC-SHA256 Signature Verification
    if (!isMock && isRazorpayConfigured()) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return NextResponse.json(
          { error: "Razorpay secret key is not configured on the server." },
          { status: 500 }
        );
      }

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { error: "Missing Razorpay verification tokens (order_id, payment_id, signature)." },
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
    }

    // Calculate delivery date 5 days in the future
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    const estimatedDateStr = estimatedDate.toISOString().split("T")[0];

    let persistedOrderId = `ord_${Date.now()}`;
    const supabase: any = getSupabaseAdminClient();

    // 2. Persist to Supabase if connected
    if (supabase) {
      try {
        // A. Insert into orders table
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: orderData.order_number,
            customer_id: orderData.customer_id || null,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone || "",
            customer_email: orderData.customer_email,
            shipping_address: orderData.shipping_address || {},
            subtotal: orderData.subtotal,
            discount: orderData.discount || 0,
            shipping_fee: orderData.shipping_fee || 0,
            total: orderData.total,
            payment_mode: orderData.payment_mode || "prepaid",
            advance_paid: orderData.advance_paid,
            balance_due: orderData.balance_due || 0,
            status: "Order Placed",
            tracking_carrier: "BlueDart Luxury Surface",
            tracking_awb: `KUS-BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
            estimated_delivery: estimatedDateStr,
            notes: orderData.notes || null,
          })
          .select("id")
          .single();

        if (orderError) {
          console.error("[Database Error] Failed to create order in Supabase:", orderError);
        } else if (newOrder) {
          persistedOrderId = newOrder.id;

          // B. Insert order_items
          if (Array.isArray(orderData.items) && orderData.items.length > 0) {
            const orderItemsPayload = orderData.items.map((item: any) => ({
              order_id: persistedOrderId,
              product_id: item.product_id || null,
              variant_id: item.variant_id || null,
              product_title: item.product_title || item.title || "Handcrafted Textile",
              variant_size: item.variant_size || item.size || null,
              swatch_name: item.swatch_name || item.color || null,
              image_url: item.image_url || null,
              price: item.price,
              quantity: item.quantity || 1,
              total: (item.price || 0) * (item.quantity || 1),
            }));

            const { error: itemsError } = await supabase
              .from("order_items")
              .insert(orderItemsPayload);

            if (itemsError) {
              console.error("[Database Error] Failed to create order_items:", itemsError);
            }
          }

          // C. Record Payment in payments table
          const { error: paymentError } = await supabase.from("payments").insert({
            order_id: persistedOrderId,
            gateway: "razorpay",
            razorpay_order_id: razorpay_order_id || null,
            razorpay_payment_id: razorpay_payment_id || null,
            razorpay_signature: razorpay_signature || null,
            amount: orderData.advance_paid,
            status: "captured",
            payment_type: orderData.payment_mode === "partial_cod" ? "advance" : "full",
            metadata: {
              is_mock: isMock,
              paid_at: new Date().toISOString(),
              total_order_amount: orderData.total,
              balance_due: orderData.balance_due || 0,
            },
          });

          if (paymentError) {
            console.error("[Database Error] Failed to record payment:", paymentError);
          }

          // D. Increment coupon usage if used
          if (orderData.coupon_code) {
            try {
              const { data: couponData } = await supabase
                .from("coupons")
                .select("id, usage_count")
                .eq("code", orderData.coupon_code.toUpperCase().trim())
                .single();

              if (couponData) {
                await supabase
                  .from("coupons")
                  .update({ usage_count: (couponData.usage_count || 0) + 1 })
                  .eq("id", couponData.id);
              }
            } catch (couponErr) {
              console.warn("[Database] Could not increment coupon usage:", couponErr);
            }
          }

          // E. Clear customer cart if authenticated
          if (orderData.customer_id) {
            try {
              await supabase
                .from("cart_items")
                .delete()
                .eq("customer_id", orderData.customer_id);
            } catch (cartErr) {
              console.warn("[Database] Failed to clear user cart in Supabase:", cartErr);
            }
          }
        }
      } catch (dbErr) {
        console.error("[Database Persistence Exception]:", dbErr);
      }
    }

    // 3. Dispatch Luxury HTML Order Confirmation Email
    try {
      await sendOrderConfirmationEmail({
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address || {},
        items: orderData.items || [],
        subtotal: orderData.subtotal,
        discount: orderData.discount || 0,
        shipping_fee: orderData.shipping_fee || 0,
        total: orderData.total,
        advance_paid: orderData.advance_paid,
        balance_due: orderData.balance_due || 0,
        payment_mode: orderData.payment_mode || "prepaid",
        estimated_delivery: estimatedDateStr,
      });
    } catch (emailErr) {
      console.warn("[Order Confirmation Email Failed To Dispatch]:", emailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: persistedOrderId,
      orderNumber: orderData.order_number,
      advancePaid: orderData.advance_paid,
      balanceDue: orderData.balance_due || 0,
      paymentMode: orderData.payment_mode,
      message: "Payment successfully verified and order confirmed.",
    });
  } catch (error: any) {
    console.error("[Payment Verification Route Error]:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during payment verification." },
      { status: 500 }
    );
  }
}
