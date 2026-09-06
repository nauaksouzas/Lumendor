import { calculateBestDiscount } from '../discounts/service';
import { DiscountCalculationResult } from '../discounts/types';

export interface PricingBreakdownRequest {
  items: Array<{
    sku: string;
    unitPriceCents: number;
    quantity: number;
  }>;
  isMember: boolean;
  promoCode?: string;
  shippingCents: number;
  taxCents: number;
  dutiesCents: number;
}

export interface PricingBreakdownResult {
  subtotalCents: number;
  discount: DiscountCalculationResult;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  dutiesCents: number;
  totalCents: number;
  currency: 'USD';
}

export function computeServerAuthoritativePricing(
  request: PricingBreakdownRequest
): PricingBreakdownResult {
  const subtotalCents = request.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  );

  const discountResult = calculateBestDiscount({
    subtotalCents,
    isMember: request.isMember,
    promoCode: request.promoCode,
  });

  const discountCents = discountResult.discountCents;
  const taxableSubtotal = Math.max(0, subtotalCents - discountCents);

  const totalCents =
    taxableSubtotal +
    request.shippingCents +
    request.taxCents +
    request.dutiesCents;

  return {
    subtotalCents,
    discount: discountResult,
    discountCents,
    shippingCents: request.shippingCents,
    taxCents: request.taxCents,
    dutiesCents: request.dutiesCents,
    totalCents,
    currency: 'USD',
  };
}
