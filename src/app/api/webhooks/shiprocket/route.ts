import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function verifySecretHeader(providedSecret: string | null, configuredSecret: string): boolean {
  if (!providedSecret || !configuredSecret) return false;
  try {
    const providedBuf = Buffer.from(providedSecret, "utf8");
    const configuredBuf = Buffer.from(configuredSecret, "utf8");
    if (providedBuf.length !== configuredBuf.length) return false;
    return crypto.timingSafeEqual(providedBuf, configuredBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;

    // 1. Mandatory Secret-Header Authentication
    const receivedSecret =
      req.headers.get("x-shiprocket-secret") ||
      req.headers.get("x-shiprocket-token") ||
      (req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null);

    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "SHIPROCKET_WEBHOOK_SECRET is not configured on the production server." },
          { status: 500 }
        );
      }
    } else {
      if (!receivedSecret || !verifySecretHeader(receivedSecret, webhookSecret)) {
        console.warn("[Shiprocket Webhook] Rejected unauthorized request: Invalid or missing secret header.");
        return NextResponse.json(
          { error: "Unauthorized. Missing or invalid Shiprocket webhook secret header." },
          { status: 401 }
        );
      }
    }

    const payload = await req.json();

    const awb = payload.awb || payload.awb_code;
    const orderId = payload.order_id;
    const currentStatus = payload.current_status || payload.status;
    const location = payload.location || payload.city || "Hub";
    const timestamp = payload.timestamp || new Date().toISOString();

    console.log(`[Shiprocket Webhook Ingested]: Order: ${orderId}, AWB: ${awb}, Status: ${currentStatus}`);

    const supabase = getSupabaseAdminClient();
    if (supabase && orderId) {
      try {
        await (supabase as any)
          .from("orders")
          .update({
            tracking_number: awb,
            status: mapShiprocketStatusToKusumika(currentStatus),
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", orderId);
      } catch (err: any) {
        console.warn("[Shiprocket Webhook DB Update Warning]:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      received: true,
      orderId,
      awb,
      status: currentStatus,
    });
  } catch (error: any) {
    console.error("[Shiprocket Webhook Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Shiprocket webhook" },
      { status: 500 }
    );
  }
}

function mapShiprocketStatusToKusumika(srStatus: string): string {
  const s = (srStatus || "").toUpperCase();
  if (s.includes("DELIVERED")) return "Delivered";
  if (s.includes("OUT FOR DELIVERY")) return "Out for Delivery";
  if (s.includes("IN TRANSIT") || s.includes("SHIPPED") || s.includes("PICKED UP")) return "Shipped";
  if (s.includes("CANCEL")) return "Cancelled";
  return "Shipped";
}
