import { AnalyticsItem } from "@/types/analytics";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "104829104820194";

export const trackMetaEvent = (
  eventName: string,
  options: Record<string, any> = {}
) => {
  if (typeof window !== "undefined") {
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", eventName, options);
    } else {
      console.log(`[Meta Pixel Simulator]: ${eventName}`, options);
    }
  }
};

export const trackMetaCustomEvent = (
  eventName: string,
  options: Record<string, any> = {}
) => {
  if (typeof window !== "undefined") {
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", eventName, options);
    } else {
      console.log(`[Meta Pixel Custom Simulator]: ${eventName}`, options);
    }
  }
};

// Standard Meta E-commerce Helpers
export const metaViewContent = (item: AnalyticsItem) => {
  trackMetaEvent("ViewContent", {
    content_name: item.item_name,
    content_ids: [item.item_id],
    content_type: "product",
    value: item.price,
    currency: "INR",
  });
};

export const metaAddToCart = (item: AnalyticsItem) => {
  trackMetaEvent("AddToCart", {
    content_name: item.item_name,
    content_ids: [item.item_id],
    content_type: "product",
    value: item.price,
    currency: "INR",
  });
};

export const metaInitiateCheckout = (value: number, numItems: number) => {
  trackMetaEvent("InitiateCheckout", {
    value,
    currency: "INR",
    num_items: numItems,
  });
};

export const metaPurchase = (
  transactionId: string,
  value: number,
  currency: string = "INR"
) => {
  trackMetaEvent("Purchase", {
    value,
    currency,
    content_type: "product",
    order_id: transactionId,
  });
};

export const metaPartialCodSelected = (advance: number, balance: number) => {
  trackMetaCustomEvent("PartialCodSelected", {
    advance_amount: advance,
    balance_due: balance,
    currency: "INR",
  });
};
