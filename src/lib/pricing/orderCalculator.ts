import { MOCK_CATALOG } from "@/lib/mockCatalog";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface RawCartItemInput {
  productId?: string;
  id?: string;
  product_id?: string;
  variantId?: string;
  variant_id?: string;
  variantSize?: string;
  variant_size?: string;
  size?: string;
  swatchName?: string;
  swatch_name?: string;
  color?: string;
  quantity?: number;
  price?: number; // Intentionally ignored - recomputed from DB
}

export interface RecomputedOrderItem {
  productId: string;
  productTitle: string;
  variantSize: string;
  swatchName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface RecomputedFinancials {
  items: RecomputedOrderItem[];
  subtotal: number;
  discount: number;
  couponApplied: {
    code: string;
    type: "flat" | "percent";
    discountAmount: number;
  } | null;
  shippingFee: number;
  shippingMethod: "standard" | "priority";
  total: number;
  paymentMode: string;
  advancePaid: number;
  balanceDue: number;
}

// Built-in verified coupons map
const FALLBACK_COUPONS: Record<
  string,
  { code: string; type: "flat" | "percent"; value: number; minOrder?: number; maxDiscount?: number }
> = {
  FESTIVE500: {
    code: "FESTIVE500",
    type: "flat",
    value: 500,
    minOrder: 2500,
  },
  KUSUMIKA10: {
    code: "KUSUMIKA10",
    type: "percent",
    value: 10,
  },
  WELCOME15: {
    code: "WELCOME15",
    type: "percent",
    value: 15,
    minOrder: 3000,
  },
};

/**
 * Recomputes all cart totals, discounts, shipping, and partial COD advance
 * entirely from official database/catalog prices, NEVER trusting client-sent amounts.
 */
export async function calculateOrderFinancials(params: {
  items: RawCartItemInput[];
  couponCode?: string | null;
  shippingMethod?: string | null;
  paymentMode?: string | null;
}): Promise<RecomputedFinancials> {
  const { items = [], couponCode, shippingMethod = "standard", paymentMode = "partial_cod" } = params;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty or items array is missing.");
  }

  const supabase: any = getSupabaseAdminClient();
  const recomputedItems: RecomputedOrderItem[] = [];

  for (const rawItem of items) {
    const productId = rawItem.productId || rawItem.product_id || rawItem.id || "";
    const quantity = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
    const variantSize = rawItem.variantSize || rawItem.variant_size || rawItem.size || "Standard";
    const swatchName = rawItem.swatchName || rawItem.swatch_name || rawItem.color || "Atelier Classic";

    let unitPrice = 0;
    let title = "Handcrafted Loom Textile";
    let imageUrl: string | null = null;

    // 1. Try DB lookup first
    let foundInDb = false;
    if (supabase && productId) {
      try {
        const { data: dbProduct } = await supabase
          .from("products")
          .select("id, title, base_price, product_images(image_url), product_variants(id, size, price_adjustment)")
          .eq("id", productId)
          .maybeSingle();

        if (dbProduct) {
          foundInDb = true;
          title = dbProduct.title;
          unitPrice = Number(dbProduct.base_price) || 0;
          if (Array.isArray(dbProduct.product_images) && dbProduct.product_images.length > 0) {
            imageUrl = dbProduct.product_images[0].image_url;
          }

          // Check if variant has price adjustment
          if (Array.isArray(dbProduct.product_variants)) {
            const matchedVariant = dbProduct.product_variants.find(
              (v: any) => v.id === rawItem.variantId || v.size === variantSize
            );
            if (matchedVariant?.price_adjustment) {
              unitPrice += Number(matchedVariant.price_adjustment);
            }
          }
        }
      } catch {
        foundInDb = false;
      }
    }

    // 2. Fallback to official catalog if not in DB
    if (!foundInDb) {
      const catalogProduct =
        MOCK_CATALOG.find((p) => p.id === productId || p.slug === productId) || MOCK_CATALOG[0];

      title = catalogProduct.title;
      unitPrice = catalogProduct.price;
      imageUrl = catalogProduct.images?.[0] || null;

      // Check variant price
      if (catalogProduct.variants && catalogProduct.variants.length > 0) {
        const matchedVariant = catalogProduct.variants.find(
          (v) => v.size === variantSize || v.id === rawItem.variantId
        );
        if (matchedVariant) {
          unitPrice = matchedVariant.price;
        }
      }
    }

    const itemTotal = unitPrice * quantity;
    recomputedItems.push({
      productId: productId || "prod-default",
      productTitle: title,
      variantSize,
      swatchName,
      imageUrl,
      price: unitPrice,
      quantity,
      total: itemTotal,
    });
  }

  // 3. Compute Subtotal
  const subtotal = recomputedItems.reduce((acc, it) => acc + it.total, 0);

  // 4. Compute Coupon Discount
  let discount = 0;
  let couponApplied: RecomputedFinancials["couponApplied"] = null;

  if (couponCode && typeof couponCode === "string") {
    const cleanCode = couponCode.trim().toUpperCase();

    // Try DB coupon lookup
    let dbCoupon = null;
    if (supabase) {
      try {
        const { data } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", cleanCode)
          .eq("is_active", true)
          .maybeSingle();
        dbCoupon = data;
      } catch {
        dbCoupon = null;
      }
    }

    if (dbCoupon) {
      const minOrder = Number(dbCoupon.min_order_amount) || 0;
      if (subtotal >= minOrder) {
        const val = Number(dbCoupon.value);
        if (dbCoupon.type === "flat") {
          discount = Math.min(val, subtotal);
        } else if (dbCoupon.type === "percent") {
          discount = Math.round((subtotal * val) / 100);
          if (dbCoupon.max_discount_amount) {
            discount = Math.min(discount, Number(dbCoupon.max_discount_amount));
          }
        }
        couponApplied = {
          code: cleanCode,
          type: dbCoupon.type,
          discountAmount: discount,
        };
      }
    } else if (FALLBACK_COUPONS[cleanCode]) {
      const fallback = FALLBACK_COUPONS[cleanCode];
      if (!fallback.minOrder || subtotal >= fallback.minOrder) {
        if (fallback.type === "flat") {
          discount = Math.min(fallback.value, subtotal);
        } else if (fallback.type === "percent") {
          discount = Math.round((subtotal * fallback.value) / 100);
          if (fallback.maxDiscount) {
            discount = Math.min(discount, fallback.maxDiscount);
          }
        }
        couponApplied = {
          code: cleanCode,
          type: fallback.type,
          discountAmount: discount,
        };
      }
    }
  }

  // 5. Shipping Fee
  const isPriority = shippingMethod === "priority";
  const shippingFee = isPriority ? 250 : 0;

  // 6. Total
  const total = Math.max(0, subtotal - discount + shippingFee);

  // 7. Partial COD vs Prepaid Advance Recomputation
  let advancePaid = total;
  let balanceDue = 0;

  const isPartialCod = paymentMode === "partial_cod";
  if (isPartialCod) {
    if (total > 0) {
      if (total <= 2500) {
        advancePaid = Math.min(500, total);
      } else {
        advancePaid = Math.min(2000, Math.round((total * 0.2) / 50) * 50);
      }
    } else {
      advancePaid = 0;
    }
    balanceDue = Math.max(0, total - advancePaid);
  }

  return {
    items: recomputedItems,
    subtotal,
    discount,
    couponApplied,
    shippingFee,
    shippingMethod: isPriority ? "priority" : "standard",
    total,
    paymentMode: isPartialCod ? "partial_cod" : "prepaid",
    advancePaid,
    balanceDue,
  };
}
