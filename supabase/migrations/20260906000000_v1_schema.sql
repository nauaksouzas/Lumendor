-- Lumen D'Or V1 Operational Database Schema (Supabase PostgreSQL)

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('customer', 'staff', 'director', 'owner');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'past_due', 'suspended', 'cancel_at_term_end', 'expired', 'cancelled');
CREATE TYPE billing_mode AS ENUM ('annual_upfront', 'monthly_annual_commitment');
CREATE TYPE order_status AS ENUM ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded');
CREATE TYPE tracking_status AS ENUM ('label_created', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'failed');
CREATE TYPE return_status AS ENUM ('submitted', 'under_review', 'approved', 'rejected', 'refunded', 'restocked', 'closed');
CREATE TYPE outbox_status AS ENUM ('pending', 'processing', 'sent', 'failed');

-- 2. USERS, PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS admin_mfa (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret TEXT,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS, SKUs & INVENTORY
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  edition TEXT NOT NULL,
  is_member_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  size_ml INT NOT NULL DEFAULT 50,
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  stripe_price_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_levels (
  variant_id UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  expires_at TIMESTAMPTZ NOT NULL,
  released BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id),
  change_amount INT NOT NULL,
  reason TEXT NOT NULL, -- e.g. 'restock_confirmed', 'manual_adjustment', 'sale', 'damaged'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DISCOUNTS & PROMOTIONS
CREATE TABLE IF NOT EXISTS discount_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE,
  percentage INT CHECK (percentage >= 0 AND percentage <= 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ORDERS & SHIPMENTS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  status order_status NOT NULL DEFAULT 'pending_payment',
  subtotal_cents INT NOT NULL CHECK (subtotal_cents >= 0),
  discount_cents INT NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  tax_cents INT NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  shipping_cents INT NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  total_cents INT NOT NULL CHECK (total_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  shipping_address JSONB NOT NULL,
  applied_discount_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price_cents INT NOT NULL CHECK (total_price_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  shipping_provider TEXT NOT NULL,
  service_selected TEXT NOT NULL,
  label_reference TEXT,
  tracking_number TEXT,
  tracking_status tracking_status NOT NULL DEFAULT 'label_created',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status tracking_status NOT NULL,
  message TEXT NOT NULL,
  location TEXT,
  event_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. MEMBERSHIP SYSTEM
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  billing_mode billing_mode NOT NULL,
  status membership_status NOT NULL DEFAULT 'pending',
  term_start TIMESTAMPTZ NOT NULL,
  term_end TIMESTAMPTZ NOT NULL,
  next_charge_at TIMESTAMPTZ,
  auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
  discount_percentage INT NOT NULL DEFAULT 10,
  grace_period_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS membership_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
  previous_status membership_status,
  new_status membership_status NOT NULL,
  reason TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. RETURNS & REFUNDS
CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  status return_status NOT NULL DEFAULT 'submitted',
  reason TEXT NOT NULL,
  staff_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  restock_confirmed_by UUID REFERENCES profiles(id),
  restock_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  reason TEXT
);

CREATE TABLE IF NOT EXISTS refund_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_request_id UUID REFERENCES return_requests(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  stripe_refund_id TEXT UNIQUE NOT NULL,
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. OUTBOX NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS outbox_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  payload JSONB NOT NULL,
  status outbox_status NOT NULL DEFAULT 'pending',
  retry_count INT NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_session ON inventory_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox_notifications(status);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
