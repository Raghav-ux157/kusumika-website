import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rateLimit";

const FALLBACK_COUPONS: Record<
  string,
  { code: string; type: "flat" | "percent"; value: number; minOrder?: number; maxDiscount?: number; description: string }
> = {
  FESTIVE500: {
    code: "FESTIVE500",
    type: "flat",
    value: 500,
    minOrder: 2500,
    description: "₹500 flat off on festive orders above ₹2,500",
  },
  KUSUMIKA10: {
    code: "KUSUMIKA10",
    type: "percent",
    value: 10,
    description: "10% privilege discount on all handloom weaves",
  },
  WELCOME15: {
    code: "WELCOME15",
    type: "percent",
    value: 15,
    minOrder: 3000,
    description: "15% off on your first sanctuary acquisition",
  },
};

export async function POST(req: NextRequest) {
  // 1. Rate Limiting (30 req / min per IP)
  const rateLimitResult = checkRateLimit(req, {
    limit: 30,
    windowMs: 60 * 1000,
    prefix: "coupon_validate",
  });
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await req.json();
    const { code, subtotal = 0 } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Coupon code is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const parsedSubtotal = Math.max(0, Number(subtotal) || 0);

    const supabase: any = getSupabaseAdminClient();
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
      if (parsedSubtotal < minOrder) {
        return NextResponse.json({
          valid: false,
          error: `This code requires a minimum order amount of ₹${minOrder.toLocaleString("en-IN")}.`,
        });
      }

      let discountAmount = 0;
      const val = Number(dbCoupon.value);
      if (dbCoupon.type === "flat") {
        discountAmount = Math.min(val, parsedSubtotal);
      } else if (dbCoupon.type === "percent") {
        discountAmount = Math.round((parsedSubtotal * val) / 100);
        if (dbCoupon.max_discount_amount) {
          discountAmount = Math.min(discountAmount, Number(dbCoupon.max_discount_amount));
        }
      }

      return NextResponse.json({
        valid: true,
        coupon: {
          code: cleanCode,
          type: dbCoupon.type,
          value: val,
          discountAmount,
          description: dbCoupon.description || `Special coupon applied (${cleanCode})`,
        },
      });
    }

    const fallback = FALLBACK_COUPONS[cleanCode];
    if (fallback) {
      if (fallback.minOrder && parsedSubtotal < fallback.minOrder) {
        return NextResponse.json({
          valid: false,
          error: `This code requires a minimum order amount of ₹${fallback.minOrder.toLocaleString("en-IN")}.`,
        });
      }

      let discountAmount = 0;
      if (fallback.type === "flat") {
        discountAmount = Math.min(fallback.value, parsedSubtotal);
      } else if (fallback.type === "percent") {
        discountAmount = Math.round((parsedSubtotal * fallback.value) / 100);
        if (fallback.maxDiscount) {
          discountAmount = Math.min(discountAmount, fallback.maxDiscount);
        }
      }

      return NextResponse.json({
        valid: true,
        coupon: {
          code: cleanCode,
          type: fallback.type,
          value: fallback.value,
          discountAmount,
          description: fallback.description,
        },
      });
    }

    return NextResponse.json({
      valid: false,
      error: "Invalid or expired privilege coupon code.",
    });
  } catch (error: any) {
    console.error("[Coupon Validation Error]:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon code." },
      { status: 500 }
    );
  }
}
