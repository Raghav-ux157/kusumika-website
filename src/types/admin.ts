export type StaffRole = "admin" | "sales" | "support" | "warehouse";

export type LeadStage = "new" | "contacted" | "quote_sent" | "converted" | "lost";

export interface B2BLead {
  id: string;
  inquiry_number: string;
  contact_name: string;
  business_name: string;
  establishment_nature: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  gstin?: string | null;
  categories_needed: string[];
  weave_grade?: string | null;
  quantity_tier?: string | null;
  bed_sizes?: string[] | null;
  branding_option?: string | null;
  timeline?: string | null;
  notes?: string | null;
  swatch_binder_requested: boolean;
  status: LeadStage;
  proposed_value: number;
  advance_collected?: number;
  cluster: string;
  assignee: {
    name: string;
    initials: string;
    avatarColor?: string;
  };
  urgency?: string;
  tags: string[];
  lost_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  items: Array<{
    product_title: string;
    variant_size?: string | null;
    swatch_name?: string | null;
    quantity: number;
    price: number;
    total: number;
    cluster?: string;
  }>;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_mode: "partial_cod" | "upi" | "cards" | "netbanking";
  advance_paid: number;
  balance_due: number;
  cod_collected?: boolean;
  cod_collection_method?: "cash" | "upi" | null;
  status:
    | "Order Placed"
    | "Loom Assigned"
    | "Natural Dyeing"
    | "Quality Inspected"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered";
  tracking_carrier: string;
  tracking_awb: string;
  estimated_delivery: string;
  cluster: string;
  created_at: string;
  notes?: string | null;
}

export interface PatronTimelineEvent {
  id: string;
  type: "whatsapp" | "call" | "ticket" | "order" | "internal_note" | "otp_verified";
  title: string;
  description: string;
  author: string;
  timestamp: string;
  status?: string;
}

export interface PatronProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  loyalty_tier: "Loom Patron" | "Atelier Connoisseur" | "Royal Heirloom Benefactor";
  loyalty_points: number;
  total_spent: number;
  orders_count: number;
  city: string;
  state: string;
  joined_date: string;
  segment: "royal" | "festive_gifting" | "organic_homeowner" | "inactive";
  notes?: string;
  timeline: PatronTimelineEvent[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  product_title: string;
  variant_size: string;
  godown: "Jaipur Central Atelier" | "Sanganer Cluster Hub" | "Bagru Mud-Resist Depot";
  in_stock: number;
  reserved: number;
  available: number;
  reorder_level: number;
  cluster: string;
  weave_batch: string;
  last_replenished: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_number?: string | null;
  subject: string;
  category: "Fabric Inquiry" | "Delivery Reschedule" | "Doorstep Inspection" | "Custom Monogramming" | "Returns & QC";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
  assigned_to: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    id: string;
    sender: string;
    sender_type: "customer" | "staff" | "system";
    message: string;
    timestamp: string;
  }>;
}

export interface AbandonedCart {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items_count: number;
  total_value: number;
  advance_payable: number;
  items: Array<{
    title: string;
    size?: string;
    color?: string;
    image?: string;
    price: number;
  }>;
  abandoned_step: "Modal Closed" | "Payment Declined" | "Pincode Checked";
  abandoned_at: string;
  recovery_status: "pending" | "nudge_sent" | "recovered" | "lost";
  last_nudge_at?: string;
}
