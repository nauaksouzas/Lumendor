export type UserRole = 'customer' | 'staff' | 'director' | 'owner';

export type MembershipStatus =
  | 'pending'
  | 'active'
  | 'past_due'
  | 'suspended'
  | 'cancel_at_term_end'
  | 'expired'
  | 'cancelled';

export type BillingMode = 'annual_upfront' | 'monthly_annual_commitment';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export type TrackingStatus =
  | 'label_created'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'
  | 'failed';

export type ReturnStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'refunded'
  | 'restocked'
  | 'closed';

export type OutboxStatus = 'pending' | 'processing' | 'sent' | 'failed';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: UserRole[];
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  edition: string;
  isMemberExclusive: boolean;
  isActive: boolean;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  sizeMl: number;
  priceCents: number;
  stripePriceId?: string;
  isActive: boolean;
}

export interface InventoryLevel {
  variantId: string;
  quantity: number;
  reservedQuantity: number;
}

export interface InventoryReservation {
  id: string;
  sessionId: string;
  variantId: string;
  quantity: number;
  expiresAt: string;
  released: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  status: OrderStatus;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  currency: 'usd';
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  appliedDiscountCode?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  sku: string;
  unitPriceCents: number;
  quantity: number;
  totalPriceCents: number;
}

export interface Shipment {
  id: string;
  orderId: string;
  shippingProvider: string;
  serviceSelected: string;
  labelReference?: string;
  trackingNumber?: string;
  trackingStatus: TrackingStatus;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  customerId: string;
  stripeSubscriptionId?: string;
  billingMode: BillingMode;
  status: MembershipStatus;
  termStart: string;
  termEnd: string;
  nextChargeAt?: string;
  autoRenew: boolean;
  discountPercentage: number;
  gracePeriodExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  status: ReturnStatus;
  reason: string;
  staffNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  restockConfirmedBy?: string;
  restockConfirmedAt?: string;
  items: Array<{ orderItemId: string; quantity: number }>;
  createdAt: string;
}

export interface OutboxNotification {
  id: string;
  eventType: string;
  recipientEmail: string;
  payload: Record<string, any>;
  status: OutboxStatus;
  retryCount: number;
  lastError?: string;
  createdAt: string;
  processedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  createdAt: string;
}
