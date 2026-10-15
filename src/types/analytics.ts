export interface CookieConsentPreferences {
  necessary: boolean; // Always true
  analytics: boolean; // GA4
  marketing: boolean; // Meta Pixel
  timestamp: string;
}

export type EcommerceEventName =
  | "page_view"
  | "view_item"
  | "view_item_list"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "purchase"
  | "partial_cod_selected"
  | "lead_form_submitted"
  | "swatch_sample_requested";

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
}
