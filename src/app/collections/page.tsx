import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function CollectionsPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Curated Assemblies</p>
          <h1 className="page-title">Collections</h1>
          <p className="page-description">
            Discover curated duos and member-exclusive pairings crafted for private collectors.
          </p>
        </header>

        <div className="product-card">
          <p className="eyebrow">Duo Edition</p>
          <h2 className="product-card-title">The Master Collection</h2>
          <p className="product-card-price">$520.00</p>
          <p className="page-description" style={{ fontSize: '15px' }}>
            Both Le Cavalier and La Signature presented in custom handcrafted wooden casing.
          </p>
          <div style={{ marginTop: '24px' }}>
            <Link className="button button-primary" href="/shop">
              Explore Catalog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
