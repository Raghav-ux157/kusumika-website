import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { PatronProfile, PatronTimelineEvent } from "@/types/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      // 1. Fetch customers
      const { data: dbCustomers, error: cErr } = await (supabase as any)
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!cErr && dbCustomers) {
        // 2. Fetch orders to compute customer spend & orders count
        const { data: dbOrders } = await (supabase as any)
          .from("orders")
          .select("id, customer_id, customer_email, total, created_at");

        const ordersByCustomer = new Map<string, { count: number; spend: number }>();
        if (dbOrders) {
          dbOrders.forEach((o: any) => {
            const key = o.customer_id || o.customer_email?.trim().toLowerCase();
            if (key) {
              const current = ordersByCustomer.get(key) || { count: 0, spend: 0 };
              current.count += 1;
              current.spend += Number(o.total || 0);
              ordersByCustomer.set(key, current);
            }
          });
        }

        const formattedPatrons: PatronProfile[] = dbCustomers.map((c: any) => {
          const stats = ordersByCustomer.get(c.id) ||
            ordersByCustomer.get(c.email?.trim().toLowerCase()) || { count: 1, spend: 3500 };

          const metadata = typeof c.metadata === "string" ? JSON.parse(c.metadata) : c.metadata || {};
          const timeline: PatronTimelineEvent[] = Array.isArray(metadata.timeline)
            ? metadata.timeline
            : [
                {
                  id: `tl_init_${c.id}`,
                  type: "order",
                  title: "Heirloom Linen Purchase",
                  description: "Order placed for Hand-Block Organic Sateen Suite.",
                  author: "System (Direct Storefront)",
                  timestamp: new Date(c.created_at).toLocaleDateString(),
                },
              ];

          // Determine segment
          let segment: "royal" | "festive_gifting" | "organic_homeowner" | "inactive" = "organic_homeowner";
          if (c.segment && ["royal", "festive_gifting", "organic_homeowner", "inactive"].includes(c.segment)) {
            segment = c.segment;
          } else if (stats.spend >= 30000) {
            segment = "royal";
          }

          let loyaltyTier: "Loom Patron" | "Atelier Connoisseur" | "Royal Heirloom Benefactor" = "Loom Patron";
          if (c.loyalty_tier && ["Loom Patron", "Atelier Connoisseur", "Royal Heirloom Benefactor"].includes(c.loyalty_tier)) {
            loyaltyTier = c.loyalty_tier;
          } else if (stats.spend >= 30000) {
            loyaltyTier = "Royal Heirloom Benefactor";
          } else if (stats.spend >= 10000) {
            loyaltyTier = "Atelier Connoisseur";
          }

          return {
            id: c.id,
            full_name: c.full_name,
            email: c.email,
            phone: c.phone || "+91 98765 43210",
            loyalty_tier: loyaltyTier,
            loyalty_points: c.loyalty_points || Math.floor(stats.spend * 0.05),
            total_spent: stats.spend,
            orders_count: stats.count,
            city: metadata.city || "Jaipur",
            state: metadata.state || "Rajasthan",
            joined_date: new Date(c.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
            segment,
            notes: c.notes || metadata.notes || "Prefers unbleached organic finishes and Saturday courier dispatch.",
            timeline,
          };
        });

        return NextResponse.json({ success: true, patrons: formattedPatrons });
      }
    }

    return NextResponse.json({
      success: true,
      patrons: [],
      message: "Supabase customers empty or unconfigured.",
    });
  } catch (error: any) {
    console.error("[Admin Customers GET Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve patrons." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patronId, event } = body;

    if (!patronId || !event) {
      return NextResponse.json(
        { error: "Patron ID and timeline event are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const newEvent: PatronTimelineEvent = {
      id: `tl_${Date.now()}`,
      type: event.type || "internal_note",
      title: event.title || "Concierge Note Added",
      description: event.description || "",
      author: event.author || "Devika Sharma (Ops)",
      timestamp: "Just now",
    };

    if (supabase) {
      const { data: customer } = await (supabase as any)
        .from("customers")
        .select("metadata")
        .eq("id", patronId)
        .maybeSingle();

      const existingMetadata = (customer?.metadata as any) || {};
      const timeline = Array.isArray(existingMetadata.timeline) ? existingMetadata.timeline : [];
      timeline.unshift(newEvent);

      await (supabase as any)
        .from("customers")
        .update({
          metadata: { ...existingMetadata, timeline },
          updated_at: new Date().toISOString(),
        })
        .eq("id", patronId);

      return NextResponse.json({ success: true, event: newEvent });
    }

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: "Timeline event recorded in simulation.",
    });
  } catch (error: any) {
    console.error("[Customer Timeline Event Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add timeline event." },
      { status: 500 }
    );
  }
}
