export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          hero_image: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          hero_image?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          hero_image?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          slug: string;
          description: string;
          story: string | null;
          care_instructions: string | null;
          dimensions: string | null;
          weave_type: string;
          thread_count: number;
          material: string;
          gots_certified: boolean;
          base_price: number;
          mrp: number;
          category_id: string | null;
          is_active: boolean;
          is_featured: boolean;
          is_festive: boolean;
          partial_cod_eligible: boolean;
          cod_advance_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          slug: string;
          description: string;
          story?: string | null;
          care_instructions?: string | null;
          dimensions?: string | null;
          weave_type: string;
          thread_count?: number;
          material?: string;
          gots_certified?: boolean;
          base_price: number;
          mrp: number;
          category_id?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_festive?: boolean;
          partial_cod_eligible?: boolean;
          cod_advance_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          slug?: string;
          description?: string;
          story?: string | null;
          care_instructions?: string | null;
          dimensions?: string | null;
          weave_type?: string;
          thread_count?: number;
          material?: string;
          gots_certified?: boolean;
          base_price?: number;
          mrp?: number;
          category_id?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_festive?: boolean;
          partial_cod_eligible?: boolean;
          cod_advance_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string;
          dimensions: string | null;
          price_adjustment: number;
          stock_count: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size: string;
          dimensions?: string | null;
          price_adjustment?: number;
          stock_count?: number;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          size?: string;
          dimensions?: string | null;
          price_adjustment?: number;
          stock_count?: number;
          is_default?: boolean;
          created_at?: string;
        };
      };
      product_swatches: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          color_code: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          color_code: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          color_code?: string;
          image_url?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string;
          avatar_url: string | null;
          loyalty_points: number;
          loyalty_tier: string;
          role: "customer" | "staff" | "admin" | "weaver_coordinator";
          whatsapp_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          email: string;
          avatar_url?: string | null;
          loyalty_points?: number;
          loyalty_tier?: string;
          role?: "customer" | "staff" | "admin" | "weaver_coordinator";
          whatsapp_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string;
          avatar_url?: string | null;
          loyalty_points?: number;
          loyalty_tier?: string;
          role?: "customer" | "staff" | "admin" | "weaver_coordinator";
          whatsapp_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          label: string;
          name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          address_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          label?: string;
          name: string;
          phone: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
          address_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          label?: string;
          name?: string;
          phone?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
          address_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          shipping_address: Json;
          subtotal: number;
          discount: number;
          shipping_fee: number;
          total: number;
          payment_mode: string;
          advance_paid: number;
          balance_due: number;
          status: string;
          tracking_carrier: string;
          tracking_awb: string | null;
          estimated_delivery: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          shipping_address: Json;
          subtotal: number;
          discount?: number;
          shipping_fee?: number;
          total: number;
          payment_mode?: string;
          advance_paid?: number;
          balance_due?: number;
          status?: string;
          tracking_carrier?: string;
          tracking_awb?: string | null;
          estimated_delivery?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string;
          shipping_address?: Json;
          subtotal?: number;
          discount?: number;
          shipping_fee?: number;
          total?: number;
          payment_mode?: string;
          advance_paid?: number;
          balance_due?: number;
          status?: string;
          tracking_carrier?: string;
          tracking_awb?: string | null;
          estimated_delivery?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_title: string;
          variant_size: string | null;
          swatch_name: string | null;
          image_url: string | null;
          price: number;
          quantity: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_title: string;
          variant_size?: string | null;
          swatch_name?: string | null;
          image_url?: string | null;
          price: number;
          quantity?: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_title?: string;
          variant_size?: string | null;
          swatch_name?: string | null;
          image_url?: string | null;
          price?: number;
          quantity?: number;
          total?: number;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          variant_id: string | null;
          swatch_name: string | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          product_id: string;
          variant_id?: string | null;
          swatch_name?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          product_id?: string;
          variant_id?: string | null;
          swatch_name?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: "flat" | "percent";
          value: number;
          min_order_amount: number;
          max_discount_amount: number | null;
          description: string | null;
          is_active: boolean;
          valid_from: string;
          valid_to: string | null;
          usage_limit: number | null;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: "flat" | "percent";
          value: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          description?: string | null;
          is_active?: boolean;
          valid_from?: string;
          valid_to?: string | null;
          usage_limit?: number | null;
          usage_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: "flat" | "percent";
          value?: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          description?: string | null;
          is_active?: boolean;
          valid_from?: string;
          valid_to?: string | null;
          usage_limit?: number | null;
          usage_count?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          customer_id: string | null;
          customer_name: string;
          rating: number;
          title: string | null;
          comment: string;
          verified_purchase: boolean;
          is_approved: boolean;
          images: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          customer_id?: string | null;
          customer_name: string;
          rating: number;
          title?: string | null;
          comment: string;
          verified_purchase?: boolean;
          is_approved?: boolean;
          images?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          customer_id?: string | null;
          customer_name?: string;
          rating?: number;
          title?: string | null;
          comment?: string;
          verified_purchase?: boolean;
          is_approved?: boolean;
          images?: string[] | null;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          inquiry_number: string;
          contact_name: string;
          business_name: string;
          establishment_nature: string;
          email: string;
          phone: string;
          city: string;
          pincode: string;
          gstin: string | null;
          categories_needed: string[] | null;
          weave_grade: string | null;
          quantity_tier: string | null;
          bed_sizes: string[] | null;
          branding_option: string | null;
          timeline: string | null;
          notes: string | null;
          swatch_binder_requested: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          inquiry_number: string;
          contact_name: string;
          business_name: string;
          establishment_nature: string;
          email: string;
          phone: string;
          city: string;
          pincode: string;
          gstin?: string | null;
          categories_needed?: string[] | null;
          weave_grade?: string | null;
          quantity_tier?: string | null;
          bed_sizes?: string[] | null;
          branding_option?: string | null;
          timeline?: string | null;
          notes?: string | null;
          swatch_binder_requested?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          inquiry_number?: string;
          contact_name?: string;
          business_name?: string;
          establishment_nature?: string;
          email?: string;
          phone?: string;
          city?: string;
          pincode?: string;
          gstin?: string | null;
          categories_needed?: string[] | null;
          weave_grade?: string | null;
          quantity_tier?: string | null;
          bed_sizes?: string[] | null;
          branding_option?: string | null;
          timeline?: string | null;
          notes?: string | null;
          swatch_binder_requested?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          ticket_number: string;
          customer_id: string | null;
          order_id: string | null;
          customer_name: string;
          customer_phone: string | null;
          customer_email: string | null;
          subject: string;
          priority: "low" | "medium" | "high" | "urgent";
          status: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
          assigned_to: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticket_number: string;
          customer_id?: string | null;
          order_id?: string | null;
          customer_name: string;
          customer_phone?: string | null;
          customer_email?: string | null;
          subject: string;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
          assigned_to?: string | null;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ticket_number?: string;
          customer_id?: string | null;
          order_id?: string | null;
          customer_name?: string;
          customer_phone?: string | null;
          customer_email?: string | null;
          subject?: string;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
          assigned_to?: string | null;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string | null;
          sender_type: "customer" | "staff" | "system";
          message: string;
          attachments: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_id?: string | null;
          sender_type: "customer" | "staff" | "system";
          message: string;
          attachments?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          sender_id?: string | null;
          sender_type?: "customer" | "staff" | "system";
          message?: string;
          attachments?: string[] | null;
          created_at?: string;
        };
      };
    };
  };
}
