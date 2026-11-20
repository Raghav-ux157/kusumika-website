import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketIdentifier = params.id;
    if (!ticketIdentifier) {
      return NextResponse.json({ error: "Ticket ID is required." }, { status: 400 });
    }

    const body = await req.json();
    const { message, senderType, senderName } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      // Find the ticket
      const { data: ticket, error: tErr } = await (supabase as any)
        .from("tickets")
        .select("id")
        .or(`id.eq.${ticketIdentifier},ticket_number.eq.${ticketIdentifier}`)
        .maybeSingle();

      if (tErr || !ticket) {
        return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
      }

      // Insert message
      const { data: newMsg, error: mErr } = await (supabase as any)
        .from("ticket_messages")
        .insert({
          ticket_id: ticket.id,
          sender_type: senderType || "staff",
          message: message.trim(),
        })
        .select()
        .single();

      if (mErr) throw mErr;

      // Update ticket updated_at
      await (supabase as any)
        .from("tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", ticket.id);

      return NextResponse.json({
        success: true,
        message: {
          id: newMsg.id,
          sender: senderType === "customer" ? (senderName || "Patron") : "Devika Sharma (Atelier Concierge)",
          sender_type: newMsg.sender_type,
          message: newMsg.message,
          timestamp: "Just now",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        sender: "Devika Sharma (Atelier Concierge)",
        sender_type: "staff",
        message: message.trim(),
        timestamp: "Just now",
      },
    });
  } catch (error: any) {
    console.error("[Ticket Message Insert Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add message to ticket thread." },
      { status: 500 }
    );
  }
}
