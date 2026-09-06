import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function MembershipTermsPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Legal Framework</p>
          <h1 className="page-title">Membership Terms</h1>
        </header>

        <article className="legal-content">
          <h2>01. Non-Stacking Privilege Rule</h2>
          <p>
            Member 10% privilege discount is applied automatically at server checkout. In the event of an active promotional campaign with a higher discount value, the system applies the single most advantageous eligible rate. Discounts do not stack.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
