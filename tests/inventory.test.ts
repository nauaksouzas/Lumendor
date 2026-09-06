import { describe, it, expect, beforeEach } from 'vitest';
import { inventoryLedger } from '../src/features/inventory/service';

describe('Inventory Ledger System', () => {
  const TEST_SKU = 'TEST-PERFUME-50ML';
  const VARIANT_ID = 'var-test-50ml';

  beforeEach(() => {
    // Restock initial level for test
    inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      10,
      'restock',
      'Initial test stock setup'
    );
  });

  it('correctly reports initial stock and records restock', () => {
    const level = inventoryLedger.getLevel(TEST_SKU);
    expect(level).toBeDefined();
    expect(level?.availableStock).toBeGreaterThanOrEqual(10);
  });

  it('reserves stock and moves available to reserved', () => {
    const before = inventoryLedger.getLevel(TEST_SKU)!;
    const res = inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      3,
      'reservation',
      'Checkout session created',
      'order-101'
    );

    expect(res.success).toBe(true);
    expect(res.level?.availableStock).toBe(before.availableStock - 3);
    expect(res.level?.reservedStock).toBe(before.reservedStock + 3);
  });

  it('releases reserved stock when checkout expires or is cancelled', () => {
    inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      2,
      'reservation',
      'Cart reservation',
      'order-102'
    );

    const reservedBefore = inventoryLedger.getLevel(TEST_SKU)!.reservedStock;

    const releaseRes = inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      2,
      'release',
      'Checkout expired',
      'order-102'
    );

    expect(releaseRes.success).toBe(true);
    expect(releaseRes.level?.reservedStock).toBe(reservedBefore - 2);
  });

  it('prevents negative stock on over-reservation or over-sale', () => {
    const level = inventoryLedger.getLevel(TEST_SKU)!;
    const overRequest = level.availableStock + 500;

    const failRes = inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      overRequest,
      'reservation',
      'Excessive order attempt'
    );

    expect(failRes.success).toBe(false);
    expect(failRes.error).toContain('Insufficient available stock');
  });

  it('supports restock, damage write-offs, and returns', () => {
    const restockRes = inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      5,
      'restock',
      'Supplier restock shipment'
    );
    expect(restockRes.success).toBe(true);

    const damageRes = inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      1,
      'damage',
      'Damaged bottle during handling'
    );
    expect(damageRes.success).toBe(true);

    const returnRes = inventoryLedger.recordMovement(
      TEST_SKU,
      VARIANT_ID,
      1,
      'return',
      'Customer return in cellophane'
    );
    expect(returnRes.success).toBe(true);
  });
});
