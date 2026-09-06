import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function ReturnsPolicyPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Legal Framework</p>
          <h1 className="page-title">Returns & Guarantee Policy</h1>
        </header>

        <article className="legal-content">
          <h2>01. Unopened Guarantee</h2>
          <p>
            Due to the hygienic nature of Extrait de Parfum formulations, returns are accepted within 14 days of receipt for unopened bottles in original cellophane packaging.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
