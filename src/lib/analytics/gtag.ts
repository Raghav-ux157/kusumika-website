import { AnalyticsItem, EcommerceEventName } from "@/types/analytics";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-KUSUMIKA92";

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Dispatch generic event
export const event = (
  eventName: EcommerceEventName | string,
  params: Record<string, any> = {}
) => {
  if (typeof window !== "undefined") {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, params);
    } else {
      console.log(`[GA4 Event Simulator]: ${eventName}`, params);
    }
  }
};

// Standard GA4 E-commerce Dispatchers
export const trackViewItem = (item: AnalyticsItem) => {
  event("view_item", {
    currency: "INR",
    value: (item.price || 0) * (item.quantity || 1),
    items: [item],
  });
};

export const trackAddToCart = (item: AnalyticsItem) => {
  event("add_to_cart", {
    currency: "INR",
    value: (item.price || 0) * (item.quantity || 1),
    items: [item],
  });
};

export const trackBeginCheckout = (items: AnalyticsItem[], value: number) => {
  event("begin_checkout", {
    currency: "INR",
    value,
    items,
  });
};

export const trackPurchase = (
  transactionId: string,
  value: number,
  items: AnalyticsItem[],
  paymentMode: string
) => {
  event("purchase", {
    transaction_id: transactionId,
    value,
    currency: "INR",
    items,
    payment_type: paymentMode,
  });
};

export const trackPartialCodSelected = (advanceAmount: number, balanceDue: number) => {
  event("partial_cod_selected", {
    currency: "INR",
    advance_amount: advanceAmount,
    balance_due: balanceDue,
  });
};
