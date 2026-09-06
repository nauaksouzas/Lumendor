import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function ShopPage() {
  const catalog = [
    {
      slug: 'le-cavalier',
      edition: 'Edition I',
      name: 'Le Cavalier',
      price: '$280.00',
      description: 'A composed signature for the moments that call for presence without excess.',
    },
    {
      slug: 'la-signature',
      edition: 'Edition II',
      name: 'La Signature',
      price: '$280.00',
      description: 'An elegant signature designed to feel personal, memorable and unmistakably yours.',
    },
  ];

  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Storefront</p>
          <h1 className="page-title">The First Chapter</h1>
          <p className="page-description">
            Explore our signature editions. Authenticated orders include direct complimentary insured international transport.
          </p>
        </header>

        <div className="product-grid">
          {catalog.map((item) => (
            <article key={item.slug} className="product-card">
              <div>
                <p className="eyebrow">{item.edition}</p>
                <h2 className="product-card-title">{item.name}</h2>
                <p className="product-card-price">{item.price}</p>
                <p className="page-description" style={{ fontSize: '15px' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ marginTop: '32px' }}>
                <Link className="button button-primary" href={`/products/${item.slug}`}>
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
