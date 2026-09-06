import { describe, it, expect } from 'vitest';
import { calculateBestDiscount } from '../src/features/discounts/service';
import { computeServerAuthoritativePricing } from '../src/features/checkout/pricing';

describe('Discount Engine & Non-Stacking Rules', () => {
  const subtotalCents = 28000; // $280.00

  it('selects 20% promotion over 10% membership discount (20% vs 10% => 20%)', () => {
    const result = calculateBestDiscount({
      subtotalCents,
      isMember: true,
      promoCode: 'VIP20',
    });

    expect(result.appliedType).toBe('promotion');
    expect(result.discountPercent).toBe(20);
    expect(result.discountCents).toBe(5600); // $56.00
  });

  it('selects 10% membership discount over 5% promotion (10% vs 5% => 10%)', () => {
    const result = calculateBestDiscount({
      subtotalCents,
      isMember: true,
      promoCode: 'WELCOME5',
    });

    expect(result.appliedType).toBe('membership');
    expect(result.discountPercent).toBe(10);
    expect(result.discountCents).toBe(2800); // $28.00
  });

  it('applies 10% membership discount when no valid promo code is provided', () => {
    const result = calculateBestDiscount({
      subtotalCents,
      isMember: true,
      promoCode: 'INVALID_CODE',
    });

    expect(result.appliedType).toBe('membership');
    expect(result.discountPercent).toBe(10);
    expect(result.discountCents).toBe(2800);
  });

  it('applies no discount for non-members without valid promo code', () => {
    const result = calculateBestDiscount({
      subtotalCents,
      isMember: false,
    });

    expect(result.appliedType).toBe('none');
    expect(result.discountPercent).toBe(0);
    expect(result.discountCents).toBe(0);
  });

  it('computes server-authoritative breakdown accurately in USD integer cents', () => {
    const breakdown = computeServerAuthoritativePricing({
      items: [{ sku: 'LC-50ML', unitPriceCents: 28000, quantity: 1 }],
      isMember: true,
      promoCode: 'VIP20',
      shippingCents: 2500, // $25.00
      taxCents: 1792,     // $17.92
      dutiesCents: 0,
    });

    expect(breakdown.subtotalCents).toBe(28000);
    expect(breakdown.discountCents).toBe(5600); // 20% of 28000
    // Taxable subtotal = 28000 - 5600 = 22400
    // Total = 22400 + 2500 + 1792 + 0 = 26692 ($266.92)
    expect(breakdown.totalCents).toBe(26692);
    expect(breakdown.currency).toBe('USD');
  });
});
