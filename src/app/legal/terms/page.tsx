import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function TermsPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Legal Framework</p>
          <h1 className="page-title">Terms & Conditions</h1>
        </header>

        <article className="legal-content">
          <h2>01. General Provisions</h2>
          <p>
            Welcome to Lumen d'Or. By accessing our services or placing an order through our authenticated platform, you agree to comply with these terms.
          </p>

          <h2>02. Commerce & Pricing</h2>
          <p>
            All products are offered subject to real-time stock availability. All transactions execute in USD cents server-side.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
