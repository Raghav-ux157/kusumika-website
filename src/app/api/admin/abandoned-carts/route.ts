import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AbandonedCart } from "@/types/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data: dbCarts, error } = await (supabase as any)
        .from("abandoned_checkouts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && dbCarts) {
        const formattedCarts: AbandonedCart[] = dbCarts.map((c: any) => {
          const rawItems = typeof c.cart_items === "string" ? JSON.parse(c.cart_items) : c.cart_items || [];
          const items = Array.isArray(rawItems)
            ? rawItems.map((i: any) => ({
                title: i.productTitle || i.title || "Artisanal Organic Linen",
                size: i.variantSize || i.size || "Queen",
                color: i.swatchName || i.color || "Terracotta",
                price: Number(i.price || 2850),
              }))
            : [];

          const total = Number(c.total || 0);
          const advancePayable = total <= 2500 ? Math.min(500, total) : Math.min(2000, Math.round((total * 0.2) / 50) * 50);

          return {
            id: c.id,
            customer_name: c.customer_name || "Prospective Patron",
            customer_email: c.email,
            customer_phone: c.phone || "+91 98765 43210",
            items_count: items.length,
            total_value: total,
            advance_payable: advancePayable,
            items,
            abandoned_step: "Payment Declined",
            abandoned_at: new Date(c.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
            recovery_status: c.recovery_status || "pending",
            last_nudge_at: c.last_nudge_at ? new Date(c.last_nudge_at).toLocaleTimeString() : undefined,
          };
        });

        return NextResponse.json({ success: true, abandonedCarts: formattedCarts });
      }
    }

    return NextResponse.json({
      success: true,
      abandonedCarts: [],
      message: "Supabase abandoned checkouts empty or unconfigured.",
    });
  } catch (error: any) {
    console.error("[Abandoned Carts GET Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve abandoned checkouts." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId, recoveryStatus } = body;

    if (!cartId || !recoveryStatus) {
      return NextResponse.json(
        { error: "Cart ID and recovery status are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const updatePayload: any = {
      recovery_status: recoveryStatus,
      updated_at: new Date().toISOString(),
    };
    if (recoveryStatus === "nudge_sent") {
      updatePayload.last_nudge_at = new Date().toISOString();
    }

    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("abandoned_checkouts")
        .update(updatePayload)
        .eq("id", cartId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, cart: data });
    }

    return NextResponse.json({
      success: true,
      message: "Cart recovery status updated in simulation.",
      cart: { id: cartId, ...updatePayload },
    });
  } catch (error: any) {
    console.error("[Abandoned Carts PATCH Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update abandoned checkout status." },
      { status: 500 }
    );
  }
}
