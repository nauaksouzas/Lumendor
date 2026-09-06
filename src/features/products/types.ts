export interface ProductDimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  priceCents: number; // Integer USD Cents
  weightGrams: number;
  dimensions: ProductDimensions;
  isAvailable: boolean;
  isMemberOnly: boolean;
  isEarlyAccess: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  shippingRestrictions: string[]; // e.g., ["no_air_freight", "restricted_countries:XX"]
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
