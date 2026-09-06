export interface TaxCalculationRequest {
  countryCode: string;
  stateOrProvince?: string;
  taxableAmountCents: number;
}

export interface TaxCalculationSnapshot {
  taxCents: number;
  ratePercent: number;
  jurisdiction: string;
}

export async function calculateStripeTaxSnapshot(
  request: TaxCalculationRequest
): Promise<TaxCalculationSnapshot> {
  const { countryCode, stateOrProvince, taxableAmountCents } = request;

  // Domestic US tax rate calculation (e.g. 8% for NY/CA)
  let ratePercent = 0;
  let jurisdiction = countryCode.toUpperCase();

  if (countryCode.toUpperCase() === 'US') {
    if (stateOrProvince === 'NY') {
      ratePercent = 8.875;
      jurisdiction = 'US-NY';
    } else if (stateOrProvince === 'CA') {
      ratePercent = 7.25;
      jurisdiction = 'US-CA';
    } else {
      ratePercent = 6.0;
      jurisdiction = 'US-DEFAULT';
    }
  } else if (['FR', 'DE', 'IT', 'ES'].includes(countryCode.toUpperCase())) {
    ratePercent = 20.0; // EU VAT
    jurisdiction = `EU-${countryCode.toUpperCase()}`;
  } else {
    ratePercent = 5.0;
  }

  const taxCents = Math.round((taxableAmountCents * ratePercent) / 100);

  return {
    taxCents,
    ratePercent,
    jurisdiction,
  };
}
