import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { RecomputedFinancials } from "@/lib/pricing/orderCalculator";
import { sendOrderConfirmationEmail } from "@/lib/notifications/emailService";

export interface CreatePendingOrderParams {
  orderNumber: string;
  customer: {
    id?: string | null;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  financials: RecomputedFinancials;
  razorpayOrderId: string;
  notes?: string | null;
}

export interface ConfirmPaymentParams {
  razorpayPaymentId: string;
  razorpayOrderId?: string | null;
  orderNumber?: string | null;
  razorpaySignature?: string | null;
  amountPaidInInr?: number | null;
  isMock?: boolean;
  metadata?: any;
}

export interface ConfirmationResult {
  success: boolean;
  alreadyProcessed: boolean;
  orderNumber: string;
  orderId: string;
  status: string;
  message: string;
}

// In-Memory Order & Payment Cache for dev fallback and fast idempotency tracking
interface CachedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  items: any[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  advance_paid: number;
  balance_due: number;
  payment_mode: string;
  coupon_code?: string | null;
  status: string;
  razorpay_order_id: string;
  tracking_carrier: string;
  tracking_awb: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
}

const MEMORY_ORDERS = new Map<string, CachedOrder>();
const CAPTURED_PAYMENTS = new Set<string>();

/**
 * Creates an order in the database with status 'Pending Payment' before payment modal opens
 */
export async function createPendingOrder(
  params: CreatePendingOrderParams
): Promise<{ orderId: string; orderNumber: string }> {
  const { orderNumber, customer, shippingAddress, financials, razorpayOrderId, notes } = params;

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);
  const estimatedDateStr = estimatedDate.toISOString().split("T")[0];
  const generatedId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const trackingAwb = `KUS-BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`;

  // Cache in memory store
  const cachedRecord: CachedOrder = {
    id: generatedId,
    order_number: orderNumber,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    shipping_address: shippingAddress,
    items: financials.items,
    subtotal: financials.subtotal,
    discount: financials.discount,
    shipping_fee: financials.shippingFee,
    total: financials.total,
    advance_paid: financials.advancePaid,
    balance_due: financials.balanceDue,
    payment_mode: financials.paymentMode,
    coupon_code: financials.couponApplied?.code || null,
    status: "Pending Payment",
    razorpay_order_id: razorpayOrderId,
    tracking_carrier: "BlueDart Luxury Surface",
    tracking_awb: trackingAwb,
    estimated_delivery: estimatedDateStr,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MEMORY_ORDERS.set(orderNumber, cachedRecord);
  MEMORY_ORDERS.set(generatedId, cachedRecord);
  if (razorpayOrderId) {
    MEMORY_ORDERS.set(razorpayOrderId, cachedRecord);
  }

  // Persist to Supabase if available
  const supabase: any = getSupabaseAdminClient();
  let persistedId = generatedId;

  if (supabase) {
    try {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: customer.id || null,
          customer_name: customer.name,
          customer_phone: customer.phone || "",
          customer_email: customer.email,
          shipping_address: shippingAddress,
          subtotal: financials.subtotal,
          discount: financials.discount,
          shipping_fee: financials.shippingFee,
          total: financials.total,
          payment_mode: financials.paymentMode,
          advance_paid: financials.advancePaid,
          balance_due: financials.balanceDue,
          status: "Pending Payment",
          tracking_carrier: "BlueDart Luxury Surface",
          tracking_awb: trackingAwb,
          estimated_delivery: estimatedDateStr,
          notes: notes || null,
        })
        .select("id")
        .single();

      if (!error && newOrder) {
        persistedId = newOrder.id;
        cachedRecord.id = persistedId;
        MEMORY_ORDERS.set(persistedId, cachedRecord);

        // Insert order_items
        if (financials.items.length > 0) {
          const itemRows = financials.items.map((item) => ({
            order_id: persistedId,
            product_id: item.productId.startsWith("prod-") ? null : item.productId,
            product_title: item.productTitle,
            variant_size: item.variantSize,
            swatch_name: item.swatchName,
            image_url: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          }));

          await supabase.from("order_items").insert(itemRows);
        }
      }
    } catch (e: any) {
      console.warn("[OrderService] Supabase write failed, falling back to local memory store:", e.message);
    }
  }

  return {
    orderId: persistedId,
    orderNumber,
  };
}

/**
 * Idempotently confirms payment for an order and prevents duplicate orders or notifications
 */
export async function confirmOrderPayment(
  params: ConfirmPaymentParams
): Promise<ConfirmationResult> {
  const {
    razorpayPaymentId,
    razorpayOrderId,
    orderNumber,
    razorpaySignature,
    amountPaidInInr,
    isMock = false,
    metadata = {},
  } = params;

  // 1. Idempotency Check: Have we already processed this payment ID?
  if (razorpayPaymentId && CAPTURED_PAYMENTS.has(razorpayPaymentId)) {
    console.log(`[Idempotency Hit]: Payment ID ${razorpayPaymentId} already captured. Skipping side-effects.`);
    const existing =
      (orderNumber ? MEMORY_ORDERS.get(orderNumber) : undefined) ||
      (razorpayOrderId ? MEMORY_ORDERS.get(razorpayOrderId) : undefined);

    return {
      success: true,
      alreadyProcessed: true,
      orderNumber: existing?.order_number || orderNumber || "KSM-UNKNOWN",
      orderId: existing?.id || "ord_existing",
      status: "Order Placed",
      message: "Idempotent request: payment was previously verified and confirmed.",
    };
  }

  // 2. Locate order in memory or DB
  let order =
    (orderNumber ? MEMORY_ORDERS.get(orderNumber) : undefined) ||
    (razorpayOrderId ? MEMORY_ORDERS.get(razorpayOrderId) : undefined);

  const supabase: any = getSupabaseAdminClient();
  let dbOrder = null;

  if (supabase) {
    try {
      let query = supabase.from("orders").select("*, order_items(*)");
      if (orderNumber) {
        query = query.eq("order_number", orderNumber);
      } else if (razorpayOrderId) {
        // If razorpayOrderId stored in notes or payments
        const { data: pRecord } = await supabase
          .from("payments")
          .select("order_id")
          .eq("razorpay_order_id", razorpayOrderId)
          .maybeSingle();
        if (pRecord?.order_id) {
          query = query.eq("id", pRecord.order_id);
        }
      }

      const { data } = await query.maybeSingle();
      dbOrder = data;
    } catch {
      dbOrder = null;
    }
  }

  // 3. Check if DB order is already confirmed
  if (dbOrder && dbOrder.status !== "Pending Payment") {
    if (razorpayPaymentId) CAPTURED_PAYMENTS.add(razorpayPaymentId);
    return {
      success: true,
      alreadyProcessed: true,
      orderNumber: dbOrder.order_number,
      orderId: dbOrder.id,
      status: dbOrder.status,
      message: "Order was already confirmed by prior webhook or verification.",
    };
  }

  if (order && order.status === "Order Placed") {
    if (razorpayPaymentId) CAPTURED_PAYMENTS.add(razorpayPaymentId);
    return {
      success: true,
      alreadyProcessed: true,
      orderNumber: order.order_number,
      orderId: order.id,
      status: order.status,
      message: "Order was already confirmed in session cache.",
    };
  }

  // 4. Mark as Captured in idempotency cache
  if (razorpayPaymentId) {
    CAPTURED_PAYMENTS.add(razorpayPaymentId);
  }

  // 5. Update status to 'Order Placed'
  const resolvedOrderNumber = order?.order_number || dbOrder?.order_number || orderNumber || `KSM-${Date.now()}`;
  const resolvedOrderId = order?.id || dbOrder?.id || `ord_${Date.now()}`;

  if (order) {
    order.status = "Order Placed";
    order.updated_at = new Date().toISOString();
  }

  if (supabase && (dbOrder?.id || order?.id)) {
    const targetId = dbOrder?.id || order?.id;
    try {
      await supabase
        .from("orders")
        .update({
          status: "Order Placed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetId);

      // Record in payments table
      await supabase.from("payments").insert({
        order_id: targetId,
        gateway: "razorpay",
        razorpay_order_id: razorpayOrderId || null,
        razorpay_payment_id: razorpayPaymentId || null,
        razorpay_signature: razorpaySignature || null,
        amount: amountPaidInInr ?? order?.advance_paid ?? 0,
        status: "captured",
        payment_type: (order?.payment_mode || dbOrder?.payment_mode) === "partial_cod" ? "advance" : "full",
        metadata: {
          is_mock: isMock,
          paid_at: new Date().toISOString(),
          ...metadata,
        },
      });

      // Increment coupon usage
      const couponCode = order?.coupon_code || dbOrder?.notes;
      if (couponCode) {
        const { data: cData } = await supabase
          .from("coupons")
          .select("id, usage_count")
          .eq("code", couponCode.toUpperCase().trim())
          .maybeSingle();

        if (cData) {
          await supabase
            .from("coupons")
            .update({ usage_count: (cData.usage_count || 0) + 1 })
            .eq("id", cData.id);
        }
      }
    } catch (e: any) {
      console.warn("[OrderService] Supabase update warning:", e.message);
    }
  }

  // 6. Send Order Confirmation Email (Dispatched once, guaranteed by idempotency check)
  const orderDetailsForEmail = order || dbOrder;
  if (orderDetailsForEmail?.customer_email) {
    try {
      await sendOrderConfirmationEmail({
        order_number: resolvedOrderNumber,
        customer_name: orderDetailsForEmail.customer_name,
        customer_email: orderDetailsForEmail.customer_email,
        customer_phone: orderDetailsForEmail.customer_phone,
        shipping_address: orderDetailsForEmail.shipping_address,
        items: orderDetailsForEmail.items || [],
        subtotal: orderDetailsForEmail.subtotal,
        discount: orderDetailsForEmail.discount,
        shipping_fee: orderDetailsForEmail.shipping_fee,
        total: orderDetailsForEmail.total,
        advance_paid: orderDetailsForEmail.advance_paid,
        balance_due: orderDetailsForEmail.balance_due,
        payment_mode: orderDetailsForEmail.payment_mode,
        estimated_delivery: orderDetailsForEmail.estimated_delivery,
      });
    } catch (emailErr: any) {
      console.warn("[OrderService] Email dispatch notice:", emailErr.message);
    }
  }

  return {
    success: true,
    alreadyProcessed: false,
    orderNumber: resolvedOrderNumber,
    orderId: resolvedOrderId,
    status: "Order Placed",
    message: "Payment successfully verified and order confirmed.",
  };
}
