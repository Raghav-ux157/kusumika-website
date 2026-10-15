import {
  WhatsAppDispatchResult,
  WhatsAppMessagePayload,
} from "@/types/notifications";

export function isWhatsAppConfigured(): boolean {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return Boolean(
    token &&
      phoneId &&
      !token.includes("your_access_token") &&
      !token.includes("mock")
  );
}

/**
 * Dispatch a message via Meta WhatsApp Cloud API or simulated sandbox
 */
export async function sendWhatsAppMessage(
  payload: WhatsAppMessagePayload
): Promise<WhatsAppDispatchResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const cleanPhone = payload.toPhone.replace(/\D/g, "");
  // Ensure country code (default to 91 for India if 10 digits)
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  if (isWhatsAppConfigured() && token && phoneId) {
    try {
      let requestBody: any;

      if (payload.templateName) {
        // WhatsApp Business Template Message
        const bodyComponents: any[] = [];
        if (payload.templateParams) {
          const parameters = Object.values(payload.templateParams).map((val) => ({
            type: "text",
            text: String(val),
          }));
          bodyComponents.push({ type: "body", parameters });
        }

        requestBody = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "template",
          template: {
            name: payload.templateName,
            language: { code: "en" },
            components: bodyComponents,
          },
        };
      } else {
        // Direct session / customer care text message
        requestBody = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "text",
          text: {
            preview_url: true,
            body: payload.customBody || "Namaste from Kusumika Luxury Textiles.",
          },
        };
      }

      const res = await fetch(
        `https://graph.facebook.com/v19.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("[WhatsApp Cloud API Error]:", errorText);
        return { success: true, simulated: true, error: errorText };
      }

      const data = await res.json();
      return {
        success: true,
        messageId: data.messages?.[0]?.id || `wamid_${Date.now()}`,
      };
    } catch (err: any) {
      console.warn("[WhatsApp Cloud API Request Failed]:", err.message);
      return { success: true, simulated: true, error: err.message };
    }
  }

  // Development / Sandbox Simulation Logging
  const messagePreview = payload.customBody || `[Template: ${payload.templateName}] ${JSON.stringify(payload.templateParams || {})}`;
  console.log(`[WhatsApp Cloud API Simulator]
-------------------------------------------------------------
To: +${formattedPhone}
Message:
${messagePreview}
Delivery Status: Sent (Simulated WAMID: wamid.HBg${Date.now()}==)
-------------------------------------------------------------`);

  return {
    success: true,
    simulated: true,
    messageId: `wamid_simulated_${Date.now()}`,
  };
}

/**
 * Pre-formatted WhatsApp Luxury Notification Dispatchers
 */

export async function sendOrderConfirmedWhatsApp(data: {
  phone: string;
  customerName: string;
  orderNumber: string;
  advancePaid: number;
  balanceDue: number;
  total: number;
}) {
  const isPartialCod = data.balanceDue > 0;
  const body = `🌸 *Namaste ${data.customerName}!*

Your slow-crafted heirloom textile reservation is confirmed.

*Order:* #${data.orderNumber}
*Total Value:* ₹${data.total.toLocaleString("en-IN")}
*Advance Settled Online:* ₹${data.advancePaid.toLocaleString("en-IN")}
${isPartialCod ? `*Doorstep Balance Due:* ₹${data.balanceDue.toLocaleString("en-IN")} (Pay courier via Cash/UPI)\n` : ""}
Our master artisans in Bagru and Sanganer have begun hand-preparing your pure 400TC organic linens.

Track your consignment journey:
https://kusumika.com/account/orders/${data.orderNumber}

_With warm regards,_
*Kusumika Atelier, Jaipur*
"Soft like Silk, Feels like a Hug"`;

  return sendWhatsAppMessage({
    toPhone: data.phone,
    templateName: "order_confirmation_partial_cod",
    templateParams: {
      name: data.customerName,
      orderNumber: data.orderNumber,
      advance: `₹${data.advancePaid.toLocaleString("en-IN")}`,
      balance: `₹${data.balanceDue.toLocaleString("en-IN")}`,
    },
    customBody: body,
  });
}

export async function sendShipmentDispatchedWhatsApp(data: {
  phone: string;
  customerName: string;
  orderNumber: string;
  courierName: string;
  awbCode: string;
  balanceDue: number;
}) {
  const isCod = data.balanceDue > 0;
  const body = `📦 *Your Consignment is on the Loom Radar!*

Namaste ${data.customerName},

Your bespoke linens for Order *#${data.orderNumber}* have passed our 400TC thread inspection and left our Jaipur depot via *${data.courierName}*.

*AWB Tracking Number:* ${data.awbCode}
${isCod ? `*Doorstep COD Balance Due:* ₹${data.balanceDue.toLocaleString("en-IN")}\n` : ""}
*Artisan Wax Seal Guarantee:*
Before handing over the balance, please inspect the intact lac wax seal and verify the fabric feel.

Track live checkpoints:
https://kusumika.com/track-order?awb=${data.awbCode}

_Kusumika Atelier Dispatch Team_`;

  return sendWhatsAppMessage({
    toPhone: data.phone,
    templateName: "shipment_dispatched",
    templateParams: {
      name: data.customerName,
      orderNumber: data.orderNumber,
      courier: data.courierName,
      awb: data.awbCode,
    },
    customBody: body,
  });
}

export async function sendAbandonedCartWhatsApp(data: {
  phone: string;
  customerName: string;
  itemCount: number;
  perkCode: string;
  restoreUrl: string;
}) {
  const body = `🪷 *Namaste ${data.customerName},*

We noticed you paused your textile curation. Our weavers have reserved your items on the active loom run:

• ${data.itemCount} slow-crafted piece${data.itemCount > 1 ? "s" : ""} awaiting your sanctuary
• Complimentary Artisan Swatch Binder included
• Use code *${data.perkCode}* for an exclusive 5% heirloom courtesy perk

Resume your reservation:
${data.restoreUrl}

If you have any bespoke bed sizing or fabric styling questions, reply directly to this chat to speak with an atelier curator.

_Warmly, Kusumika Atelier Concierge_`;

  return sendWhatsAppMessage({
    toPhone: data.phone,
    templateName: "abandoned_cart_concierge",
    templateParams: {
      name: data.customerName,
      items: String(data.itemCount),
      code: data.perkCode,
    },
    customBody: body,
  });
}

export async function sendLeadReminderWhatsApp(data: {
  phone: string;
  contactName: string;
  businessName: string;
  inquiryNumber: string;
}) {
  const body = `🏛️ *Kusumika Hospitality & Trade Atelier*

Namaste ${data.contactName},

Thank you for your trade inquiry *#${data.inquiryNumber}* for *${data.businessName}*.

Our bespoke trade portfolio with 25%–45% loom-direct hospitality pricing and certified 400TC thread test certificates is ready for your review.

Would you prefer our senior fabric consultant to schedule a 10-minute briefing or courier an artisan swatch binder to your property?

_Kind regards,_
*Vikram Rathore*
Head of Hospitality Trade, Kusumika Jaipur`;

  return sendWhatsAppMessage({
    toPhone: data.phone,
    customBody: body,
  });
}
