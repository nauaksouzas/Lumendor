import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function ShippingPolicyPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Legal Framework</p>
          <h1 className="page-title">Shipping & Transport Policy</h1>
        </header>

        <article className="legal-content">
          <h2>01. International Transport</h2>
          <p>
            All fragrance shipments are processed in accordance with international hazardous material transport regulations.
          </p>

          <h2>02. Duties & Landed Costs</h2>
          <p>
            Applicable duties, import taxes, and courier carrier fees are computed server-side at checkout to guarantee landed-cost delivery without unexpected courier fees upon arrival.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
