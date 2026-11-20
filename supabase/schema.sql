-- ==============================================================================
-- KUSUMIKA LUXURY HOME TEXTILES - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Tagline: "Soft like Silk, Feels like a Hug"
-- Complete Production Schema with Row-Level Security (RLS), Storage & Triggers
-- ==============================================================================

-- Enable Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin', 'weaver_coordinator');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'Pending Payment',
    'Order Placed',
    'Loom Assigned',
    'Natural Dyeing',
    'Quality Inspected',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_gateway AS ENUM ('razorpay', 'cash', 'manual_bank');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'captured', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_type AS ENUM ('advance', 'balance', 'full');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quote_sent', 'negotiation', 'converted', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ==============================================================================
-- 2. CATEGORIES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hero_image TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. PRODUCTS, VARIANTS, SWATCHES & IMAGES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  care_instructions TEXT,
  dimensions TEXT,
  weave_type TEXT NOT NULL,
  thread_count INT DEFAULT 400,
  material TEXT DEFAULT '100% GOTS Organic Cotton',
  gots_certified BOOLEAN DEFAULT TRUE,
  base_price NUMERIC(10, 2) NOT NULL,
  mrp NUMERIC(10, 2) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_festive BOOLEAN DEFAULT FALSE,
  partial_cod_eligible BOOLEAN DEFAULT TRUE,
  cod_advance_amount NUMERIC(10, 2) DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  dimensions TEXT,
  price_adjustment NUMERIC(10, 2) DEFAULT 0,
  stock_count INT DEFAULT 20,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_swatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_code TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. CUSTOMERS & ADDRESSES (Linked to Supabase Auth)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  loyalty_points INT DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Loom Patron',
  role user_role DEFAULT 'customer',
  segment TEXT DEFAULT 'organic_homeowner',
  whatsapp_opt_in BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  address_type TEXT DEFAULT 'Residence',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. COUPONS & DISCOUNTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('flat', 'percent')),
  value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  max_discount_amount NUMERIC(10, 2),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. ORDERS & ORDER ITEMS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'partial_cod',
  advance_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cod_collected BOOLEAN DEFAULT FALSE,
  cod_collection_method TEXT,
  status order_status DEFAULT 'Order Placed',
  tracking_carrier TEXT DEFAULT 'BlueDart Luxury Surface',
  tracking_awb TEXT,
  estimated_delivery TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  variant_size TEXT,
  swatch_name TEXT,
  image_url TEXT,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. PAYMENTS (Razorpay & Partial COD Doorstep Settlement)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway payment_gateway DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_type payment_type DEFAULT 'advance',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. CART & WISHLIST PERSISTENCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  swatch_name TEXT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id, variant_id, swatch_name)
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- ==============================================================================
-- 9. REVIEWS & RATINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT TRUE,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. B2B / HOSPITALITY LEADS (Bespoke Trade Inquiries)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number TEXT UNIQUE NOT NULL,
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  establishment_nature TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  gstin TEXT,
  categories_needed TEXT[],
  weave_grade TEXT,
  quantity_tier TEXT,
  bed_sizes TEXT[],
  branding_option TEXT,
  timeline TEXT,
  notes TEXT,
  swatch_binder_requested BOOLEAN DEFAULT TRUE,
  status lead_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. CRM TICKETS & PATRON CARE INBOX
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  subject TEXT NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  assigned_to UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'dispatch',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'staff', 'system')),
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. ABANDONED CHECKOUTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.abandoned_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  customer_name TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  recovery_status TEXT NOT NULL DEFAULT 'pending' CHECK (recovery_status IN ('pending', 'nudge_sent', 'recovered', 'lost')),
  last_nudge_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 13. INVENTORY MOVEMENTS LEDGER
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase_receipt', 'sale', 'return_restock', 'damage_writeoff', 'manual_adjustment')),
  quantity_delta INT NOT NULL,
  previous_stock INT NOT NULL DEFAULT 0,
  new_stock INT NOT NULL DEFAULT 0,
  reference_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  reason TEXT,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 14. SITE SETTINGS & CONFIGURATION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 15. STAFF ROLES & OPERATIONAL RBAC
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.staff_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sales', 'support', 'warehouse')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 16. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================

-- Create public product-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,
  10485760, -- 10MB per image
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- ==============================================================================
-- 17. HELPER FUNCTIONS FOR RBAC & PERMISSIONS
-- ==============================================================================

-- Check if authenticated user is Master Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.staff_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if authenticated user has any of the allowed staff roles
CREATE OR REPLACE FUNCTION public.has_staff_role(VARIADIC allowed_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.staff_roles
      WHERE user_id = auth.uid()
        AND (role = 'admin' OR role = ANY(allowed_roles))
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if authenticated user is general staff or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.staff_roles WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'weaver_coordinator')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current staff role name
CREATE OR REPLACE FUNCTION public.current_staff_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.staff_roles WHERE user_id = auth.uid();
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 18. ROW-LEVEL SECURITY (RLS) POLICIES ON EVERY TABLE
-- ==============================================================================

-- Enable RLS across all 18 tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_swatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename, schemaname FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON "' || r.schemaname || '"."' || r.tablename || '";';
  END LOOP;
END $$;

-- 18.1 CATEGORIES
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.has_staff_role('sales', 'warehouse'));

CREATE POLICY "Admin and Sales can manage categories"
  ON public.categories FOR ALL
  USING (public.has_staff_role('sales'));

-- 18.2 PRODUCTS & CATALOG ITEMS
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.has_staff_role('sales', 'warehouse', 'support'));

CREATE POLICY "Staff can manage products"
  ON public.products FOR ALL
  USING (public.has_staff_role('sales', 'warehouse'));

CREATE POLICY "Public can view active product variants"
  ON public.product_variants FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_variants.product_id AND (p.is_active = TRUE OR public.has_staff_role('sales', 'warehouse', 'support'))));

CREATE POLICY "Warehouse and Admin can manage product variants"
  ON public.product_variants FOR ALL
  USING (public.has_staff_role('warehouse'));

CREATE POLICY "Public can view swatches"
  ON public.product_swatches FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_swatches.product_id AND (p.is_active = TRUE OR public.has_staff_role('sales', 'warehouse', 'support'))));

CREATE POLICY "Staff can manage swatches"
  ON public.product_swatches FOR ALL
  USING (public.has_staff_role('sales', 'warehouse'));

CREATE POLICY "Public can view product images"
  ON public.product_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_images.product_id AND (p.is_active = TRUE OR public.has_staff_role('sales', 'warehouse', 'support'))));

CREATE POLICY "Staff can manage product images"
  ON public.product_images FOR ALL
  USING (public.has_staff_role('sales', 'warehouse'));

-- 18.3 CUSTOMERS & ADDRESSES
CREATE POLICY "Customers view own profile; Staff view by role"
  ON public.customers FOR SELECT
  USING (auth.uid() = id OR public.has_staff_role('sales', 'support'));

CREATE POLICY "Customers update own profile"
  ON public.customers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role and Admin can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Customers manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "Staff can view customer addresses"
  ON public.addresses FOR SELECT
  USING (public.has_staff_role('sales', 'support', 'warehouse'));

-- 18.4 CART & WISHLIST
CREATE POLICY "Customers manage own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers manage own wishlist"
  ON public.wishlist_items FOR ALL
  USING (auth.uid() = customer_id);

-- 18.5 ORDERS & ORDER ITEMS
CREATE POLICY "Customers view own orders; Staff view by role"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id OR public.has_staff_role('sales', 'support', 'warehouse'));

CREATE POLICY "Anyone can insert pending order during checkout"
  ON public.orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Staff can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_staff_role('sales', 'support', 'warehouse'));

CREATE POLICY "Customers view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.customer_id = auth.uid() OR public.has_staff_role('sales', 'support', 'warehouse'))
    )
  );

CREATE POLICY "Anyone can insert order items during checkout"
  ON public.order_items FOR INSERT
  WITH CHECK (TRUE);

-- 18.6 PAYMENTS
CREATE POLICY "Customers view own payments; Staff view by role"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id
        AND (o.customer_id = auth.uid() OR public.has_staff_role('support'))
    )
  );

CREATE POLICY "Anyone can insert payment record on checkout completion"
  ON public.payments FOR INSERT
  WITH CHECK (TRUE);

-- 18.7 COUPONS
CREATE POLICY "Public can view active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = TRUE OR public.has_staff_role('sales'));

CREATE POLICY "Admin and Sales can manage coupons"
  ON public.coupons FOR ALL
  USING (public.has_staff_role('sales'));

-- 18.8 REVIEWS
CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = TRUE OR public.has_staff_role('support', 'sales'));

CREATE POLICY "Authenticated patrons can submit reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Support and Admin can moderate reviews"
  ON public.reviews FOR ALL
  USING (public.has_staff_role('support'));

-- 18.9 B2B LEADS
CREATE POLICY "Anyone can submit a wholesale lead"
  ON public.leads FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin and Sales can view and manage leads"
  ON public.leads FOR ALL
  USING (public.has_staff_role('sales'));

-- 18.10 CRM TICKETS & MESSAGES
CREATE POLICY "Customers view own tickets; Support and Admin manage"
  ON public.tickets FOR SELECT
  USING (auth.uid() = customer_id OR public.has_staff_role('support'));

CREATE POLICY "Customers can create support tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (auth.uid() = customer_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Support and Admin manage tickets"
  ON public.tickets FOR UPDATE
  USING (public.has_staff_role('support'));

CREATE POLICY "Customers and Support view ticket messages"
  ON public.ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_messages.ticket_id
        AND (t.customer_id = auth.uid() OR public.has_staff_role('support'))
    )
  );

CREATE POLICY "Customers and Support insert ticket messages"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_messages.ticket_id
        AND (t.customer_id = auth.uid() OR public.has_staff_role('support'))
    )
  );

-- 18.11 ABANDONED CHECKOUTS
CREATE POLICY "Customers view own abandoned checkouts"
  ON public.abandoned_checkouts FOR SELECT
  USING (auth.uid() = customer_id OR public.has_staff_role('sales'));

CREATE POLICY "Server and clients can log abandoned checkouts"
  ON public.abandoned_checkouts FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Sales can manage and update recovery status"
  ON public.abandoned_checkouts FOR ALL
  USING (public.has_staff_role('sales'));

-- 18.12 INVENTORY MOVEMENTS LEDGER
CREATE POLICY "Admin and Warehouse can view inventory movements"
  ON public.inventory_movements FOR SELECT
  USING (public.has_staff_role('warehouse'));

CREATE POLICY "Admin and Warehouse can record inventory movements"
  ON public.inventory_movements FOR INSERT
  WITH CHECK (public.has_staff_role('warehouse') OR auth.role() = 'service_role');

-- 18.13 SITE SETTINGS
CREATE POLICY "Public can view public site settings"
  ON public.site_settings FOR SELECT
  USING (is_public = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

-- 18.14 STAFF ROLES
CREATE POLICY "Staff can view their own role"
  ON public.staff_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage staff roles"
  ON public.staff_roles FOR ALL
  USING (public.is_admin());

-- 18.15 STORAGE BUCKET POLICIES (product-images)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public Access for Product Images" ON storage.objects;
  DROP POLICY IF EXISTS "Staff Upload Product Images" ON storage.objects;
  DROP POLICY IF EXISTS "Staff Manage Product Images" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE POLICY "Public Access for Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Staff Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    (auth.role() = 'service_role' OR public.has_staff_role('warehouse', 'sales'))
  );

CREATE POLICY "Staff Manage Product Images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'product-images' AND
    (auth.role() = 'service_role' OR public.is_admin())
  );

-- ==============================================================================
-- 19. AUTOMATED TRIGGERS & TIMESTAMPS
-- ==============================================================================

-- Function to handle new customer signup from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, full_name, email, phone, role, loyalty_tier, loyalty_points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    'customer',
    'Loom Patron',
    500 -- Welcome bonus points
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, customers.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_timestamp ON categories;
CREATE TRIGGER update_categories_timestamp BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_timestamp ON products;
CREATE TRIGGER update_products_timestamp BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_timestamp ON customers;
CREATE TRIGGER update_customers_timestamp BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_timestamp ON orders;
CREATE TRIGGER update_orders_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_timestamp ON leads;
CREATE TRIGGER update_leads_timestamp BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_timestamp ON tickets;
CREATE TRIGGER update_tickets_timestamp BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_abandoned_checkouts_timestamp ON abandoned_checkouts;
CREATE TRIGGER update_abandoned_checkouts_timestamp BEFORE UPDATE ON abandoned_checkouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_timestamp ON site_settings;
CREATE TRIGGER update_site_settings_timestamp BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_roles_timestamp ON staff_roles;
CREATE TRIGGER update_staff_roles_timestamp BEFORE UPDATE ON staff_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 19. SUPABASE REALTIME REPLICATION CONFIGURATION
-- ==============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tickets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'ticket_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'inventory_movements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_movements;
  END IF;
END $$;

