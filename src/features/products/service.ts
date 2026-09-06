import { Product, ProductVariant } from './types';

const defaultCatalog: Product[] = [
  {
    id: 'prod-le-cavalier',
    slug: 'le-cavalier',
    name: 'Le Cavalier',
    description: 'A composed signature for the moments that call for presence without excess.',
    isActive: true,
    images: ['/mark.png'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: 'var-lc-50ml',
        productId: 'prod-le-cavalier',
        sku: 'LC-50ML',
        name: 'Le Cavalier 50 ml Extrait de Parfum',
        priceCents: 28000, // $280.00
        weightGrams: 350,
        dimensions: { lengthCm: 10, widthCm: 10, heightCm: 15 },
        isAvailable: true,
        isMemberOnly: false,
        isEarlyAccess: false,
        stripeProductId: 'prod_stripe_lc_50ml',
        stripePriceId: 'price_stripe_lc_50ml',
        shippingRestrictions: ['perfume_hazmat_air_limit'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'prod-la-signature',
    slug: 'la-signature',
    name: 'La Signature',
    description: 'An elegant signature designed to feel personal, memorable and unmistakably yours.',
    isActive: true,
    images: ['/mark.png'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: 'var-ls-50ml',
        productId: 'prod-la-signature',
        sku: 'LS-50ML',
        name: 'La Signature 50 ml Extrait de Parfum',
        priceCents: 28000, // $280.00
        weightGrams: 350,
        dimensions: { lengthCm: 10, widthCm: 10, heightCm: 15 },
        isAvailable: true,
        isMemberOnly: false,
        isEarlyAccess: false,
        stripeProductId: 'prod_stripe_ls_50ml',
        stripePriceId: 'price_stripe_ls_50ml',
        shippingRestrictions: ['perfume_hazmat_air_limit'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

let catalogStore = [...defaultCatalog];

export async function getProducts(): Promise<Product[]> {
  return catalogStore.filter((p) => p.isActive);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = catalogStore.find((prod) => prod.slug === slug && prod.isActive);
  return p ? { ...p } : null;
}

export async function getVariantBySku(sku: string): Promise<ProductVariant | null> {
  for (const product of catalogStore) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { ...variant };
  }
  return null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  const index = catalogStore.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    catalogStore[index] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    catalogStore.push({ ...product });
  }
  return product;
}
