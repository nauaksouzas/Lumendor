import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function PrivacyPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Legal Framework</p>
          <h1 className="page-title">Privacy Policy</h1>
        </header>

        <article className="legal-content">
          <h2>01. Data Collection</h2>
          <p>
            Lumen d'Or respects client confidentiality. We collect personal information strictly required to authenticate user identity, process server checkout, and fulfill physical orders.
          </p>

          <h2>02. Security & Compliance</h2>
          <p>
            Payment information is handled exclusively via Stripe infrastructure. No raw credit card credentials are ever stored on our servers.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
