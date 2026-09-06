export interface Address {
  countryCode: string; // 2-letter ISO
  stateOrProvince?: string;
  city: string;
  postalCode: string;
  line1: string;
  line2?: string;
}

export interface ShippingItem {
  sku: string;
  weightGrams: number;
  quantity: number;
  shippingRestrictions?: string[];
}

export interface ShippingQuoteRequest {
  origin: Address;
  destination: Address;
  items: ShippingItem[];
}

export interface ShippingRate {
  serviceName: string;
  serviceCode: string;
  costCents: number;
  currency: 'USD';
  estimatedDays: number;
}

export interface ShippingQuoteResult {
  success: boolean;
  rates: ShippingRate[];
  error?: string;
  blockingReason?: string;
}

export interface ShippingProvider {
  name: string;
  calculateRates(request: ShippingQuoteRequest): Promise<ShippingQuoteResult>;
}
