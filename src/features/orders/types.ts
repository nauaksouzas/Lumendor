export type OrderStatus =
  | 'pending_checkout'
  | 'payment_processing'
  | 'paid'
  | 'fulfillment_pending'
  | 'shipped'
  | 'delivered'
  | 'cancellation_requested'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'partially_refunded'
  | 'refunded'
  | 'checkout_expired';

export interface OrderItemSnapshot {
  id: string;
  orderId: string;
  variantId: string;
  productNameSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot: string;
  unitPriceCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  dutiesCents: number;
  totalCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  status: OrderStatus;
  subtotalCents: number;
  discountCents: number;
  appliedDiscountCode?: string;
  shippingCents: number;
  taxCents: number;
  dutiesCents: number;
  totalCents: number;
  currency: 'USD';
  shippingAddress: Record<string, unknown>;
  items: OrderItemSnapshot[];
  reservationExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
