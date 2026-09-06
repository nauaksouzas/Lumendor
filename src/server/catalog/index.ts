import { Product, ProductVariant } from '../types';
import { db } from '../db';

export function getAllProducts(isMember: boolean = false): Product[] {
  const all = Array.from(db.products.values()).filter((p) => p.isActive);
  if (isMember) return all;
  return all.filter((p) => !p.isMemberExclusive);
}

export function getProductBySlug(slug: string): Product | undefined {
  return Array.from(db.products.values()).find((p) => p.slug === slug);
}

export function getVariantById(id: string): ProductVariant | undefined {
  return db.variants.get(id);
}

export function createProduct(productData: Partial<Product> & { name: string; edition: string }): Product {
  const id = `prod-${Date.now()}`;
  const slug = productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-');
  const product: Product = {
    id,
    slug,
    name: productData.name,
    description: productData.description || '',
    edition: productData.edition,
    isMemberExclusive: Boolean(productData.isMemberExclusive),
    isActive: productData.isActive !== false,
    variants: [],
  };
  db.products.set(id, product);
  return product;
}

export function addVariant(
  productId: string,
  variantData: { sku: string; title: string; sizeMl: number; priceCents: number; initialStock?: number }
): ProductVariant {
  const product = db.products.get(productId);
  if (!product) throw new Error(`Product ${productId} not found`);

  const id = `var-${Date.now()}`;
  const variant: ProductVariant = {
    id,
    productId,
    sku: variantData.sku,
    title: variantData.title,
    sizeMl: variantData.sizeMl,
    priceCents: variantData.priceCents,
    isActive: true,
  };

  db.variants.set(id, variant);
  product.variants.push(variant);

  const stock = variantData.initialStock ?? 50;
  db.inventory.set(id, { variantId: id, quantity: stock, reservedQuantity: 0 });

  return variant;
}
