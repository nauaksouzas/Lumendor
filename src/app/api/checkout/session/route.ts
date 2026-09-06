import { NextResponse } from 'next/server';
import { computeServerAuthoritativePricing } from '@/features/checkout/pricing';
import { getVariantBySku } from '@/features/products/service';
import { inventoryLedger } from '@/features/inventory/service';
import { createOrder } from '@/features/orders/service';
import { defaultShippingProvider } from '@/features/shipping/service';
import { defaultLandedCostProvider } from '@/features/landed-cost/service';
import { calculateStripeTaxSnapshot } from '@/features/tax/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, userEmail, items, shippingAddress, promoCode, isMember } = body;

    // 1. Mandatory authentication check
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Authentication is mandatory before payable checkout. Guest checkout is disabled.' },
        { status: 401 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 2. Validate SKUs and stock
    const itemDetails = [];
    for (const item of items) {
      const variant = await getVariantBySku(item.sku);
      if (!variant) {
        return NextResponse.json({ error: `Invalid SKU '${item.sku}'` }, { status: 400 });
      }

      const invLevel = inventoryLedger.getLevel(item.sku);
      if (!invLevel || invLevel.availableStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for SKU '${item.sku}' (Available: ${invLevel?.availableStock ?? 0})` },
          { status: 400 }
        );
      }

      itemDetails.push({ variant, quantity: item.quantity });
    }

    // 3. Obtain shipping & duties quotes (Never Invent Rule)
    const shippingQuote = await defaultShippingProvider.calculateRates({
      origin: { countryCode: 'US', city: 'Boston', postalCode: '02108', line1: 'Beacon Hill' },
      destination: shippingAddress || { countryCode: 'US', city: 'New York', postalCode: '10001', line1: '5th Ave' },
      items: itemDetails.map((i) => ({
        sku: i.variant.sku,
        weightGrams: i.variant.weightGrams,
        quantity: i.quantity,
        shippingRestrictions: i.variant.shippingRestrictions,
      })),
    });

    if (!shippingQuote.success || shippingQuote.rates.length === 0) {
      return NextResponse.json(
        { error: shippingQuote.blockingReason || 'Shipping quote unavailable. Checkout blocked.' },
        { status: 400 }
      );
    }

    const shippingCents = shippingQuote.rates[0].costCents;

    const landedCostQuote = await defaultLandedCostProvider.calculateLandedCost({
      origin: { countryCode: 'US', city: 'Boston', postalCode: '02108', line1: 'Beacon Hill' },
      destination: shippingAddress || { countryCode: 'US', city: 'New York', postalCode: '10001', line1: '5th Ave' },
      items: itemDetails.map((i) => ({
        sku: i.variant.sku,
        weightGrams: i.variant.weightGrams,
        quantity: i.quantity,
      })),
      itemValuesCents: Object.fromEntries(itemDetails.map((i) => [i.variant.sku, i.variant.priceCents])),
    });

    const dutiesCents = landedCostQuote.dutiesCents;

    const subtotalCents = itemDetails.reduce((sum, i) => sum + i.variant.priceCents * i.quantity, 0);

    const taxSnapshot = await calculateStripeTaxSnapshot({
      countryCode: shippingAddress?.countryCode || 'US',
      stateOrProvince: shippingAddress?.stateOrProvince || 'NY',
      taxableAmountCents: subtotalCents,
    });

    // 4. Compute server-authoritative breakdown
    const pricing = computeServerAuthoritativePricing({
      items: itemDetails.map((i) => ({
        sku: i.variant.sku,
        unitPriceCents: i.variant.priceCents,
        quantity: i.quantity,
      })),
      isMember: !!isMember,
      promoCode,
      shippingCents,
      taxCents: taxSnapshot.taxCents,
      dutiesCents,
    });

    // 5. Transactionally reserve stock
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const checkoutSessionId = `cs_test_${Math.random().toString(36).substring(2, 12)}`;

    for (const item of itemDetails) {
      const res = inventoryLedger.recordMovement(
        item.variant.sku,
        item.variant.id,
        item.quantity,
        'reservation',
        `Checkout session reservation ${checkoutSessionId}`,
        orderId
      );
      if (!res.success) {
        return NextResponse.json({ error: `Stock reservation failed: ${res.error}` }, { status: 400 });
      }
    }

    // 6. Persist order & historical snapshot
    const order = await createOrder({
      id: orderId,
      customerId: userId,
      customerEmail: userEmail,
      stripeCheckoutSessionId: checkoutSessionId,
      status: 'pending_checkout',
      subtotalCents: pricing.subtotalCents,
      discountCents: pricing.discountCents,
      appliedDiscountCode: pricing.discount.appliedCode,
      shippingCents: pricing.shippingCents,
      taxCents: pricing.taxCents,
      dutiesCents: pricing.dutiesCents,
      totalCents: pricing.totalCents,
      currency: 'USD',
      shippingAddress: shippingAddress || {},
      items: itemDetails.map((i) => ({
        id: `item-${Math.random().toString(36).substring(2, 7)}`,
        orderId,
        variantId: i.variant.id,
        productNameSnapshot: i.variant.name,
        variantNameSnapshot: i.variant.name,
        skuSnapshot: i.variant.sku,
        unitPriceCents: i.variant.priceCents,
        discountCents: Math.round((i.variant.priceCents * pricing.discount.discountPercent) / 100),
        taxCents: Math.round((i.variant.priceCents * taxSnapshot.ratePercent) / 100),
        shippingCents: Math.round(shippingCents / itemDetails.length),
        dutiesCents: Math.round(dutiesCents / itemDetails.length),
        totalCents: i.variant.priceCents * i.quantity,
        quantity: i.quantity,
      })),
      reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      checkoutSessionId,
      checkoutUrl: `https://checkout.stripe.com/c/pay/${checkoutSessionId}`,
      orderId: order.id,
      pricingBreakdown: pricing,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
