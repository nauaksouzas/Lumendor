import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function MembershipPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">The Guild</p>
          <h1 className="page-title">Private Membership</h1>
          <p className="page-description">
            Access early releases, bespoke vintage formulations, and automatic 10% privilege privileges across all house purchases.
          </p>
        </header>

        <section className="product-card">
          <p className="eyebrow">Tier I Privileges</p>
          <h2 className="product-card-title">Lumen Circle</h2>
          <p className="product-card-price">Complimentary upon invitation or qualifying collection purchase</p>
          <ul className="legal-content" style={{ margin: '20px 0 32px' }}>
            <li>Automatic 10% non-stacking member rate on all fragrance editions.</li>
            <li>Priority access to annual vintage allocations.</li>
            <li>Direct private concierge messaging line.</li>
          </ul>
          <div>
            <Link className="button button-primary" href="/sign-up">
              Apply for Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
