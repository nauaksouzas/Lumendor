import {
  ShippingProvider,
  ShippingQuoteRequest,
  ShippingQuoteResult,
} from './types';
import { isCountrySupportedForShipping } from './countries';

export class TestShippingAdapter implements ShippingProvider {
  public name = 'TestShippingAdapter';

  public async calculateRates(request: ShippingQuoteRequest): Promise<ShippingQuoteResult> {
    const destCountry = request.destination.countryCode.toUpperCase();

    // 1. Verify country eligibility
    if (!isCountrySupportedForShipping(destCountry)) {
      return {
        success: false,
        rates: [],
        blockingReason: `Shipping is not available to country code '${destCountry}'. Checkout is blocked.`,
      };
    }

    // 2. Verify perfume transport restrictions
    for (const item of request.items) {
      if (item.shippingRestrictions?.includes('perfume_hazmat_embargo_xx') && destCountry === 'XX') {
        return {
          success: false,
          rates: [],
          blockingReason: `SKU '${item.sku}' cannot be shipped to '${destCountry}' due to hazardous material transport restrictions.`,
        };
      }
    }

    // 3. Return deterministic insured carrier options
    const totalWeight = request.items.reduce((acc, i) => acc + i.weightGrams * i.quantity, 0);

    // Base cost $25.00 + $0.01 per gram
    const expressCostCents = 2500 + Math.round(totalWeight * 1.5);
    const priorityCostCents = 4500 + Math.round(totalWeight * 2.0);

    return {
      success: true,
      rates: [
        {
          serviceName: 'Lumen D\'Or Insured Express Courier',
          serviceCode: 'EXPRESS_INSURED',
          costCents: expressCostCents,
          currency: 'USD',
          estimatedDays: 3,
        },
        {
          serviceName: 'Lumen D\'Or Priority White-Glove Direct',
          serviceCode: 'PRIORITY_WHITE_GLOVE',
          costCents: priorityCostCents,
          currency: 'USD',
          estimatedDays: 1,
        },
      ],
    };
  }
}

export const defaultShippingProvider: ShippingProvider = new TestShippingAdapter();
