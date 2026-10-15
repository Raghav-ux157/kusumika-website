-- ==============================================================================
-- KUSUMIKA LUXURY HOME TEXTILES - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Tagline: "Soft like Silk, Feels like a Hug"
-- Complete Schema with Row-Level Security (RLS) & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin', 'weaver_coordinator');
CREATE TYPE order_status AS ENUM (
  'Order Placed',
  'Loom Assigned',
  'Natural Dyeing',
  'Quality Inspected',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
);
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'cash', 'manual_bank');
CREATE TYPE payment_status AS ENUM ('pending', 'captured', 'failed', 'refunded');
CREATE TYPE payment_type AS ENUM ('advance', 'balance', 'full');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quote_sent', 'negotiation', 'converted', 'lost');

-- ==============================================================================
-- 2. CATEGORIES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS categories (
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
-- 3. PRODUCTS & VARIANTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS products (
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
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_festive BOOLEAN DEFAULT FALSE,
  partial_cod_eligible BOOLEAN DEFAULT TRUE,
  cod_advance_amount NUMERIC(10, 2) DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  dimensions TEXT,
  price_adjustment NUMERIC(10, 2) DEFAULT 0,
  stock_count INT DEFAULT 20,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_swatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_code TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. CUSTOMERS & STAFF PROFILES (Linked to Supabase Auth)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  loyalty_points INT DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Loom Patron',
  role user_role DEFAULT 'customer',
  whatsapp_opt_in BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS coupons (
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

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
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
  status order_status DEFAULT 'Order Placed',
  tracking_carrier TEXT DEFAULT 'Shiprocket Express',
  tracking_awb TEXT,
  estimated_delivery TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  swatch_name TEXT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id, variant_id, swatch_name)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- ==============================================================================
-- 9. REVIEWS & RATINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS leads (
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

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  subject TEXT NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  assigned_to UUID REFERENCES customers(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'dispatch',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'staff', 'system')),
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_swatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user has staff or admin role
CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM customers
    WHERE id = auth.uid()
      AND role IN ('staff', 'admin', 'weaver_coordinator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public / Anonymous Catalog Access
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public can view variants of active products"
  ON product_variants FOR SELECT
  USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.is_active = TRUE));

CREATE POLICY "Public can view swatches of active products"
  ON product_swatches FOR SELECT
  USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_swatches.product_id AND products.is_active = TRUE));

CREATE POLICY "Public can view images of active products"
  ON product_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = TRUE));

CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Public can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = TRUE);

-- Customer Profile Policies
CREATE POLICY "Customers can view their own profile"
  ON customers FOR SELECT
  USING (auth.uid() = id OR is_staff_or_admin());

CREATE POLICY "Customers can update their own profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Customer Addresses
CREATE POLICY "Customers can manage their own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = customer_id);

-- Cart & Wishlist Policies
CREATE POLICY "Customers can manage their own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can manage their own wishlist"
  ON wishlist_items FOR ALL
  USING (auth.uid() = customer_id);

-- Orders & Items Policies
CREATE POLICY "Customers can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id OR is_staff_or_admin());

CREATE POLICY "Authenticated users or guests can insert orders"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Customers can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (orders.customer_id = auth.uid() OR is_staff_or_admin())
    )
  );

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (TRUE);

-- Payments
CREATE POLICY "Customers can view their order payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
        AND (orders.customer_id = auth.uid() OR is_staff_or_admin())
    )
  );

CREATE POLICY "Anyone can insert payments during checkout"
  ON payments FOR INSERT
  WITH CHECK (TRUE);

-- Customer Reviews
CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Leads (B2B)
CREATE POLICY "Anyone can create a trade lead"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Staff can view and manage leads"
  ON leads FOR ALL
  USING (is_staff_or_admin());

-- Tickets & Messages
CREATE POLICY "Customers can view their own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = customer_id OR is_staff_or_admin());

CREATE POLICY "Customers can create support tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers and staff can read ticket messages"
  ON ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_messages.ticket_id
        AND (tickets.customer_id = auth.uid() OR is_staff_or_admin())
    )
  );

CREATE POLICY "Customers and staff can insert ticket messages"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_messages.ticket_id
        AND (tickets.customer_id = auth.uid() OR is_staff_or_admin())
    )
  );

-- Staff Full Management Policies
CREATE POLICY "Staff can manage all catalog products"
  ON products FOR ALL
  USING (is_staff_or_admin());

CREATE POLICY "Staff can manage all product variants"
  ON product_variants FOR ALL
  USING (is_staff_or_admin());

CREATE POLICY "Staff can manage all categories"
  ON categories FOR ALL
  USING (is_staff_or_admin());

CREATE POLICY "Staff can manage all orders"
  ON orders FOR ALL
  USING (is_staff_or_admin());

CREATE POLICY "Staff can manage tickets"
  ON tickets FOR ALL
  USING (is_staff_or_admin());

-- ==============================================================================
-- 13. AUTOMATED TRIGGERS
-- ==============================================================================

-- Function to handle new user signup from Supabase Auth
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
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_timestamp BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_timestamp BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_timestamp BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_timestamp BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_timestamp BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
