export interface Promotion {
  id: string;
  code: string;
  discountPercent: number; // 1 to 100
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
}

export interface DiscountCalculationRequest {
  subtotalCents: number;
  isMember: boolean;
  promoCode?: string;
}

export interface DiscountCalculationResult {
  appliedType: 'none' | 'membership' | 'promotion';
  appliedCode?: string;
  discountPercent: number;
  discountCents: number;
  explanation: string;
}
