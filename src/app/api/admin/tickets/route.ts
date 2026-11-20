import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { SupportTicket } from "@/types/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data: dbTickets, error } = await (supabase as any)
        .from("tickets")
        .select(`
          *,
          ticket_messages (*)
        `)
        .order("created_at", { ascending: false });

      if (!error && dbTickets) {
        const formattedTickets: SupportTicket[] = dbTickets.map((t: any) => {
          const messages = (t.ticket_messages || [])
            .sort(
              (a: any, b: any) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
            .map((m: any) => ({
              id: m.id,
              sender: m.sender_type === "staff" ? "Devika Sharma (Atelier Concierge)" : t.customer_name,
              sender_type: m.sender_type,
              message: m.message,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }));

          return {
            id: t.id,
            ticket_number: t.ticket_number,
            customer_name: t.customer_name,
            customer_email: t.customer_email || "care@kusumika.com",
            customer_phone: t.customer_phone || "+91 98765 43210",
            order_number: t.order_id || null,
            subject: t.subject,
            category: t.category || "Doorstep Inspection",
            priority: t.priority || "medium",
            status: t.status || "open",
            assigned_to: "Devika Sharma (Concierge Lead)",
            created_at: t.created_at,
            updated_at: t.updated_at,
            messages,
          };
        });

        return NextResponse.json({ success: true, tickets: formattedTickets });
      }
    }

    return NextResponse.json({
      success: true,
      tickets: [],
      message: "Supabase tickets empty or unconfigured.",
    });
  } catch (error: any) {
    console.error("[Admin Tickets GET Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve support tickets." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, subject, category, priority, initialMessage, orderNumber } = body;

    if (!customerName || !subject) {
      return NextResponse.json(
        { error: "Customer name and subject are required." },
        { status: 400 }
      );
    }

    const ticketNumber = `TCK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data: newTicket, error } = await (supabase as any)
        .from("tickets")
        .insert({
          ticket_number: ticketNumber,
          customer_name: customerName,
          customer_email: customerEmail || null,
          customer_phone: customerPhone || null,
          subject,
          category: category || "Fabric Inquiry",
          priority: priority || "medium",
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      if (initialMessage && newTicket) {
        await (supabase as any).from("ticket_messages").insert({
          ticket_id: newTicket.id,
          sender_type: "customer",
          message: initialMessage,
        });
      }

      return NextResponse.json({ success: true, ticket: newTicket });
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: `tck_${Date.now()}`,
        ticket_number: ticketNumber,
        customer_name: customerName,
        subject,
        status: "open",
      },
    });
  } catch (error: any) {
    console.error("[Admin Ticket Create Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create support ticket." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, status, priority } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const updateData: any = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("tickets")
        .update(updateData)
        .or(`id.eq.${ticketId},ticket_number.eq.${ticketId}`)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, ticket: data });
    }

    return NextResponse.json({
      success: true,
      message: "Ticket status updated in local simulation.",
      ticket: { id: ticketId, ...updateData },
    });
  } catch (error: any) {
    console.error("[Admin Ticket PATCH Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update support ticket." },
      { status: 500 }
    );
  }
}
