import { LandedCostProvider, LandedCostQuoteRequest, LandedCostQuoteResult } from './types';

export class TestLandedCostAdapter implements LandedCostProvider {
  public name = 'TestLandedCostAdapter';

  public async calculateLandedCost(
    request: LandedCostQuoteRequest
  ): Promise<LandedCostQuoteResult> {
    const destCountry = request.destination.countryCode.toUpperCase();

    // Domestic US has 0 import duties
    if (destCountry === 'US') {
      return {
        success: true,
        dutiesCents: 0,
        importTaxesCents: 0,
        carrierFeesCents: 0,
        totalLandedCostCents: 0,
        currency: 'USD',
      };
    }

    // Compute total item value
    const totalValueCents = request.items.reduce((sum, item) => {
      const unitValue = request.itemValuesCents[item.sku] || 0;
      return sum + unitValue * item.quantity;
    }, 0);

    // Standard test duty calculation (e.g. 5% duty for international fragrance)
    const dutiesCents = Math.round(totalValueCents * 0.05);

    return {
      success: true,
      dutiesCents,
      importTaxesCents: 0,
      carrierFeesCents: 500, // $5.00 international customs entry fee
      totalLandedCostCents: dutiesCents + 500,
      currency: 'USD',
    };
  }
}

export const defaultLandedCostProvider: LandedCostProvider = new TestLandedCostAdapter();
