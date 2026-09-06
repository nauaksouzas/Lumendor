import { describe, it, expect } from 'vitest';
import { isCountrySupportedForShipping } from '../src/features/shipping/countries';
import { TestShippingAdapter } from '../src/features/shipping/service';
import { TestLandedCostAdapter } from '../src/features/landed-cost/service';
import { calculateStripeTaxSnapshot } from '../src/features/tax/service';

describe('Shipping, Landed Cost, & Tax Integration', () => {
  const shippingAdapter = new TestShippingAdapter();
  const landedCostAdapter = new TestLandedCostAdapter();

  const validAddress = {
    countryCode: 'US',
    stateOrProvince: 'NY',
    city: 'New York',
    postalCode: '10001',
    line1: 'Fifth Avenue 100',
  };

  const originAddress = {
    countryCode: 'US',
    stateOrProvince: 'MA',
    city: 'Boston',
    postalCode: '02108',
    line1: 'Beacon Hill',
  };

  const items = [
    {
      sku: 'LC-50ML',
      weightGrams: 350,
      quantity: 1,
      shippingRestrictions: ['perfume_hazmat_air_limit'],
    },
  ];

  it('validates supported shipping countries and rejects unsupported ones', () => {
    expect(isCountrySupportedForShipping('US')).toBe(true);
    expect(isCountrySupportedForShipping('CA')).toBe(true);
    expect(isCountrySupportedForShipping('GB')).toBe(true);
    expect(isCountrySupportedForShipping('XX')).toBe(false);
  });

  it('calculates deterministic carrier shipping quotes for supported routes', async () => {
    const result = await shippingAdapter.calculateRates({
      origin: originAddress,
      destination: validAddress,
      items,
    });

    expect(result.success).toBe(true);
    expect(result.rates.length).toBeGreaterThan(0);
    expect(result.rates[0].costCents).toBeGreaterThan(0);
  });

  it('BLOCKS checkout when shipping to an unsupported or restricted country (Never Invent Rule)', async () => {
    const result = await shippingAdapter.calculateRates({
      origin: originAddress,
      destination: { ...validAddress, countryCode: 'XX' },
      items,
    });

    expect(result.success).toBe(false);
    expect(result.rates).toHaveLength(0);
    expect(result.blockingReason).toContain('Shipping is not available to country code');
  });

  it('calculates international duties and landed cost accurately', async () => {
    const result = await landedCostAdapter.calculateLandedCost({
      origin: originAddress,
      destination: { ...validAddress, countryCode: 'CA' },
      items,
      itemValuesCents: { 'LC-50ML': 28000 },
    });

    expect(result.success).toBe(true);
    expect(result.dutiesCents).toBe(1400); // 5% of 28000
    expect(result.totalLandedCostCents).toBe(1900); // 1400 + 500 carrier fee
  });

  it('creates Stripe Tax calculation snapshot', async () => {
    const snapshot = await calculateStripeTaxSnapshot({
      countryCode: 'US',
      stateOrProvince: 'NY',
      taxableAmountCents: 28000,
    });

    expect(snapshot.ratePercent).toBe(8.875);
    expect(snapshot.taxCents).toBe(2485); // 8.875% of 28000
    expect(snapshot.jurisdiction).toBe('US-NY');
  });
});
