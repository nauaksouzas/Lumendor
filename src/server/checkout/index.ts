import { reserveInventory } from '../inventory';
import { calculateCartTotals, CartItem } from '../pricing';
import { db } from '../db';
import { getProfileByEmail, createProfile } from '../auth';

export interface CreateCheckoutSessionRequest {
  customerEmail: string;
  items: Array<{ variantId: string; quantity: number }>;
  isMember?: boolean;
  promoCode?: string;
  destinationCountry?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  stripeCheckoutUrl: string;
  expiresAt: string;
  totals: ReturnType<typeof calculateCartTotals>;
}

export function createCheckoutSession(req: CreateCheckoutSessionRequest): CheckoutSessionResult {
  let profile = getProfileByEmail(req.customerEmail);
  if (!profile) {
    profile = createProfile(req.customerEmail, req.customerEmail.split('@')[0]);
  }

  const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const cartItems: CartItem[] = [];

  // 1. Reserve Inventory for each item
  for (const item of req.items) {
    const variant = db.variants.get(item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} not found.`);
    reserveInventory(sessionId, item.variantId, item.quantity, 15);
    cartItems.push({ variant, quantity: item.quantity });
  }

  // 2. Calculate Pricing
  const promoPercentage = req.promoCode === 'SUMMER20' ? 20 : req.promoCode === 'SAVE5' ? 5 : 0;
  const totals = calculateCartTotals(
    cartItems,
    Boolean(req.isMember),
    promoPercentage,
    req.destinationCountry || 'US'
  );

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return {
    sessionId,
    stripeCheckoutUrl: `https://checkout.stripe.com/c/pay/${sessionId}`,
    expiresAt,
    totals,
  };
}
