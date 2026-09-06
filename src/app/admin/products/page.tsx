import { getProducts } from '@/features/products/service';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <p className="eyebrow">Catalog Operations</p>
      <h1 className="page-title">Products & SKUs</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.flatMap((prod) =>
            prod.variants.map((variant) => (
              <tr key={variant.sku}>
                <td>{prod.name}</td>
                <td>{variant.sku}</td>
                <td>${(variant.priceCents / 100).toFixed(2)}</td>
                <td>{variant.weightGrams}g</td>
                <td>
                  <span style={{ color: variant.isAvailable ? 'var(--gold)' : 'red' }}>
                    {variant.isAvailable ? 'Available' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
