import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function ContactPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Concierge</p>
          <h1 className="page-title">Private Inquiries</h1>
          <p className="page-description">
            Our house concierges are at your disposal for advice, bespoke sizing, or order inquiries.
          </p>
        </header>

        <section className="legal-content">
          <h2>Direct Concierge Line</h2>
          <p>Email: concierge@lumendor.com</p>
          <p>WhatsApp: +1 (774) 270-7460</p>
          <p>Operating Hours: Monday – Saturday, 09:00 – 18:00 EST</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
