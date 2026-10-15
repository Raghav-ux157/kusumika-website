import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
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
