import { Address, ShippingItem } from '../shipping/types';

export interface LandedCostQuoteRequest {
  origin: Address;
  destination: Address;
  items: ShippingItem[];
  itemValuesCents: Record<string, number>; // SKU -> unit price in cents
}

export interface LandedCostQuoteResult {
  success: boolean;
  dutiesCents: number;
  importTaxesCents: number;
  carrierFeesCents: number;
  totalLandedCostCents: number;
  currency: 'USD';
  error?: string;
}

export interface LandedCostProvider {
  name: string;
  calculateLandedCost(request: LandedCostQuoteRequest): Promise<LandedCostQuoteResult>;
}
