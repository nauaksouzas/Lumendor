import { describe, it, expect, beforeEach } from 'vitest';
import { POST as checkoutHandler } from '../src/app/api/checkout/session/route';
import { inventoryLedger } from '../src/features/inventory/service';

describe('Stripe Checkout Session API', () => {
  const SKU = 'LC-50ML';

  beforeEach(() => {
    // Restock initial stock
    inventoryLedger.recordMovement(SKU, 'var-lc-50ml', 100, 'restock', 'Setup stock');
  });

  it('rejects checkout when unauthenticated (No Guest Checkout Rule)', async () => {
    const req = new Request('http://localhost:3000/api/checkout/session', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ sku: SKU, quantity: 1 }],
      }),
    });

    const res = await checkoutHandler(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('Authentication is mandatory');
  });

  it('rejects checkout when requested quantity exceeds available stock', async () => {
    const req = new Request('http://localhost:3000/api/checkout/session', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        userEmail: 'client@example.com',
        items: [{ sku: SKU, quantity: 99999 }],
      }),
    });

    const res = await checkoutHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Insufficient stock');
  });

  it('creates Stripe Checkout session, reserves stock, and computes server-authoritative breakdown', async () => {
    const availBefore = inventoryLedger.getLevel(SKU)!.availableStock;

    const req = new Request('http://localhost:3000/api/checkout/session', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-456',
        userEmail: 'authenticated@lumendor.com',
        items: [{ sku: SKU, quantity: 2 }],
        isMember: true,
        promoCode: 'VIP20',
        shippingAddress: { countryCode: 'US', stateOrProvince: 'NY', city: 'New York', postalCode: '10001', line1: '5th Ave' },
      }),
    });

    const res = await checkoutHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.checkoutSessionId).toBeDefined();

    // Verify stock reservation
    const availAfter = inventoryLedger.getLevel(SKU)!.availableStock;
    expect(availAfter).toBe(availBefore - 2);

    // Verify pricing breakdown
    expect(data.pricingBreakdown.discountCents).toBe(11200); // 20% of 56000
    expect(data.pricingBreakdown.totalCents).toBeGreaterThan(0);
  });
});
