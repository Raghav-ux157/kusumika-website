import { NotificationDispatchParams } from "@/types/notifications";
import {
  sendOrderConfirmedWhatsApp,
  sendShipmentDispatchedWhatsApp,
  sendAbandonedCartWhatsApp,
  sendLeadReminderWhatsApp,
} from "./whatsappService";
import {
  sendShipmentDispatchedEmail,
  sendAbandonedCartEmail,
} from "./emailService";

/**
 * Unified notification orchestrator that triggers WhatsApp and Email channels simultaneously
 */
export async function dispatchNotification(params: NotificationDispatchParams) {
  const results: { whatsapp?: any; email?: any } = {};

  try {
    switch (params.type) {
      case "order_confirmed": {
        if (params.customerPhone && params.orderNumber) {
          results.whatsapp = await sendOrderConfirmedWhatsApp({
            phone: params.customerPhone,
            customerName: params.customerName,
            orderNumber: params.orderNumber,
            advancePaid: params.advancePaid || 0,
            balanceDue: params.balanceDue || 0,
            total: params.total || 0,
          });
        }
        break;
      }

      case "shipment_dispatched": {
        if (params.customerPhone && params.orderNumber && params.courierName) {
          results.whatsapp = await sendShipmentDispatchedWhatsApp({
            phone: params.customerPhone,
            customerName: params.customerName,
            orderNumber: params.orderNumber,
            courierName: params.courierName,
            awbCode: params.trackingNumber || "SR-BD-889127394",
            balanceDue: params.balanceDue || 0,
          });
        }

        if (params.customerEmail && params.orderNumber) {
          results.email = await sendShipmentDispatchedEmail({
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            orderNumber: params.orderNumber,
            courierName: params.courierName || "BlueDart Express",
            awbCode: params.trackingNumber || "SR-BD-889127394",
            balanceDue: params.balanceDue || 0,
            trackingUrl: params.trackingUrl || `https://kusumika.com/track-order?awb=${params.trackingNumber}`,
          });
        }
        break;
      }

      case "abandoned_cart_nudge": {
        const perkCode = params.discountCode || "HEIRLOOM5";
        const restoreUrl = `https://kusumika.com/cart?restore=true&coupon=${perkCode}`;

        if (params.customerPhone) {
          results.whatsapp = await sendAbandonedCartWhatsApp({
            phone: params.customerPhone,
            customerName: params.customerName,
            itemCount: params.cartItems?.length || 1,
            perkCode,
            restoreUrl,
          });
        }

        if (params.customerEmail) {
          results.email = await sendAbandonedCartEmail({
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            cartTotal: params.total || 2450,
            itemCount: params.cartItems?.length || 1,
            perkCode,
            restoreUrl,
          });
        }
        break;
      }

      case "lead_followup": {
        if (params.customerPhone && params.orderNumber) {
          results.whatsapp = await sendLeadReminderWhatsApp({
            phone: params.customerPhone,
            contactName: params.customerName,
            businessName: params.notes || "Boutique Hospitality",
            inquiryNumber: params.orderNumber,
          });
        }
        break;
      }
    }
  } catch (err: any) {
    console.warn("[NotificationOrchestrator] Error during dispatch:", err.message);
  }

  return results;
}
