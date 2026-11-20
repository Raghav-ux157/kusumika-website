import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { markMemoryOrderCodCollected } from "@/lib/orders/orderService";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderIdentifier = params.id;
    if (!orderIdentifier) {
      return NextResponse.json(
        { error: "Order identifier is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const method: "cash" | "upi" = body.method === "upi" ? "upi" : "cash";

    const supabase = getSupabaseAdminClient();
    let updatedOrder: any = null;

    if (supabase) {
      // Find the order
      const { data: existingOrder } = await (supabase as any)
        .from("orders")
        .select("*")
        .or(`id.eq.${orderIdentifier},order_number.eq.${orderIdentifier}`)
        .maybeSingle();

      if (existingOrder) {
        const balanceDue = Number(existingOrder.balance_due || 0);

        const { data: updated, error } = await (supabase as any)
          .from("orders")
          .update({
            cod_collected: true,
            cod_collection_method: method,
            balance_due: 0,
            status: "Delivered",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingOrder.id)
          .select()
          .single();

        if (!error) {
          updatedOrder = updated;

          // Record settlement payment in payments table
          if (balanceDue > 0) {
            await (supabase as any).from("payments").insert({
              order_id: existingOrder.id,
              gateway: "doorstep_cod" as any,
              amount: balanceDue,
              status: "captured",
              payment_type: "balance" as any,
              metadata: {
                settlement_method: method,
                settled_at: new Date().toISOString(),
                doorstep_verified: true,
              },
            });
          }
        }
      }
    }

    // Also update server memory store
    markMemoryOrderCodCollected(orderIdentifier, method);

    return NextResponse.json({
      success: true,
      message: `Doorstep COD balance settled via ${method.toUpperCase()}.`,
      order: updatedOrder || {
        order_number: orderIdentifier,
        cod_collected: true,
        cod_collection_method: method,
        balance_due: 0,
        status: "Delivered",
      },
    });
  } catch (error: any) {
    console.error("[Doorstep COD Collection Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to settle COD balance." },
      { status: 500 }
    );
  }
}
