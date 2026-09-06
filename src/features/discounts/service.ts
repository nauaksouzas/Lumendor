import {
  DiscountCalculationRequest,
  DiscountCalculationResult,
  Promotion,
} from './types';

const activePromotions: Promotion[] = [
  {
    id: 'promo-1',
    code: 'VIP20',
    discountPercent: 20,
    isActive: true,
  },
  {
    id: 'promo-2',
    code: 'WELCOME5',
    discountPercent: 5,
    isActive: true,
  },
];

export function calculateBestDiscount(
  request: DiscountCalculationRequest
): DiscountCalculationResult {
  const { subtotalCents, isMember, promoCode } = request;

  if (subtotalCents <= 0) {
    return {
      appliedType: 'none',
      discountPercent: 0,
      discountCents: 0,
      explanation: 'No discount applied on empty subtotal.',
    };
  }

  const MEMBER_DISCOUNT_PERCENT = 10;

  let memberDiscountPercent = isMember ? MEMBER_DISCOUNT_PERCENT : 0;
  let promoDiscountPercent = 0;
  let matchedPromo: Promotion | undefined;

  if (promoCode) {
    const formattedCode = promoCode.trim().toUpperCase();
    matchedPromo = activePromotions.find(
      (p) => p.code.toUpperCase() === formattedCode && p.isActive
    );
    if (matchedPromo) {
      promoDiscountPercent = matchedPromo.discountPercent;
    }
  }

  // Non-stacking rule: Choose single best discount percentage
  let bestPercent = 0;
  let appliedType: 'none' | 'membership' | 'promotion' = 'none';
  let appliedCode: string | undefined;
  let explanation = 'No discount applicable.';

  if (promoDiscountPercent > memberDiscountPercent) {
    bestPercent = promoDiscountPercent;
    appliedType = 'promotion';
    appliedCode = matchedPromo?.code;
    explanation = `Applied ${bestPercent}% promotion code '${matchedPromo?.code}' (outperformed ${memberDiscountPercent}% membership rate).`;
  } else if (memberDiscountPercent > 0 && memberDiscountPercent >= promoDiscountPercent) {
    bestPercent = memberDiscountPercent;
    appliedType = 'membership';
    explanation = `Applied ${bestPercent}% private membership rate (non-stacking discount rule).`;
  } else if (promoDiscountPercent > 0) {
    bestPercent = promoDiscountPercent;
    appliedType = 'promotion';
    appliedCode = matchedPromo?.code;
    explanation = `Applied ${bestPercent}% promotion code '${matchedPromo?.code}'.`;
  }

  const discountCents = Math.round((subtotalCents * bestPercent) / 100);

  return {
    appliedType,
    appliedCode,
    discountPercent: bestPercent,
    discountCents,
    explanation,
  };
}
