export type NotificationType =
  | "order_confirmed"
  | "shipment_dispatched"
  | "out_for_delivery"
  | "delivered"
  | "abandoned_cart_nudge"
  | "lead_followup"
  | "payment_failed";

export interface WhatsAppMessagePayload {
  toPhone: string;
  templateName?: string;
  templateParams?: Record<string, string | number>;
  customBody?: string;
  headerMediaUrl?: string;
}

export interface WhatsAppDispatchResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export interface NotificationDispatchParams {
  type: NotificationType;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderNumber?: string;
  total?: number;
  advancePaid?: number;
  balanceDue?: number;
  trackingNumber?: string;
  courierName?: string;
  trackingUrl?: string;
  cartItems?: Array<{ title: string; price: number; quantity: number }>;
  discountCode?: string;
  notes?: string;
}
