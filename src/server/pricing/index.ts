import { ProductVariant } from '../types';

export interface CartItem {
  variant: ProductVariant;
  quantity: number;
}

export interface PricingBreakdown {
  subtotalCents: number;
  memberDiscountCents: number;
  promoDiscountCents: number;
  effectiveDiscountCents: number;
  discountPercentageUsed: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  shippingProvider: string;
  currency: 'usd';
}

export interface ShippingRate {
  id: string;
  provider: string;
  serviceName: string;
  costCents: number;
  estimatedDays: number;
}

export class ShippingProvider {
  static getAvailableRates(destinationCountry: string, subtotalCents: number): ShippingRate[] {
    const supportedCountries = ['US', 'CA', 'GB', 'FR', 'DE', 'CH', 'AE', 'JP', 'AU'];
    if (!supportedCountries.includes(destinationCountry.toUpperCase())) {
      throw new Error(`Shipping not available to destination country: ${destinationCountry}`);
    }

    if (destinationCountry.toUpperCase() === 'US') {
      return [
        {
          id: 'ship-us-std',
          provider: 'LumenExpress',
          serviceName: 'Complimentary Ground',
          costCents: subtotalCents >= 20000 ? 0 : 1500, // Free over $200
          estimatedDays: 3,
        },
        {
          id: 'ship-us-exp',
          provider: 'LumenExpress',
          serviceName: 'Courier Express',
          costCents: 3500,
          estimatedDays: 1,
        },
      ];
    }

    return [
      {
        id: 'ship-intl-std',
        provider: 'DHL Luxury Express',
        serviceName: 'International Priority',
        costCents: 4500,
        estimatedDays: 4,
      },
    ];
  }
}

export class LandedCostProvider {
  static calculateLandedCost(country: string, subtotalCents: number): { dutyCents: number; importTaxCents: number } {
    if (country.toUpperCase() === 'US') {
      return { dutyCents: 0, importTaxCents: 0 };
    }
    // Estimated duty and import tax for international luxury goods
    const dutyCents = Math.round(subtotalCents * 0.05); // 5% duty
    const importTaxCents = Math.round(subtotalCents * 0.10); // 10% import tax
    return { dutyCents, importTaxCents };
  }
}

export function calculateCartTotals(
  items: CartItem[],
  isMember: boolean,
  promoPercentage: number = 0,
  destinationCountry: string = 'US',
  shippingRateId?: string
): PricingBreakdown {
  if (items.length === 0) {
    throw new Error('Cart is empty.');
  }

  // 1. Integer Subtotal Calculation
  const subtotalCents = items.reduce((sum, item) => {
    if (item.quantity <= 0) throw new Error('Item quantity must be greater than zero.');
    return sum + item.variant.priceCents * item.quantity;
  }, 0);

  // 2. Discount Calculation (NO STACKING: Member 10% vs Promo %, select MAX)
  const memberPercentage = isMember ? 10 : 0;
  const effectivePercentage = Math.max(memberPercentage, promoPercentage);

  const memberDiscountCents = isMember ? Math.round((subtotalCents * 10) / 100) : 0;
  const promoDiscountCents = promoPercentage > 0 ? Math.round((subtotalCents * promoPercentage) / 100) : 0;
  const effectiveDiscountCents = Math.round((subtotalCents * effectivePercentage) / 100);

  const discountedSubtotalCents = subtotalCents - effectiveDiscountCents;

  // 3. Shipping Calculation
  const rates = ShippingProvider.getAvailableRates(destinationCountry, discountedSubtotalCents);
  const selectedRate = shippingRateId ? rates.find((r) => r.id === shippingRateId) || rates[0] : rates[0];
  const shippingCents = selectedRate.costCents;

  // 4. Stripe Tax & Landed Cost Simulation
  const landedCost = LandedCostProvider.calculateLandedCost(destinationCountry, discountedSubtotalCents);
  const baseTaxRate = destinationCountry.toUpperCase() === 'US' ? 0.07 : 0.0;
  const domesticTaxCents = Math.round(discountedSubtotalCents * baseTaxRate);
  const taxCents = domesticTaxCents + landedCost.dutyCents + landedCost.importTaxCents;

  // 5. Total
  const totalCents = discountedSubtotalCents + shippingCents + taxCents;

  return {
    subtotalCents,
    memberDiscountCents,
    promoDiscountCents,
    effectiveDiscountCents,
    discountPercentageUsed: effectivePercentage,
    taxCents,
    shippingCents,
    totalCents,
    shippingProvider: selectedRate.provider,
    currency: 'usd',
  };
}
