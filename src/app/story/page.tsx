import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function StoryPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">The House</p>
          <h1 className="page-title">Fragrance is the part of the entrance that stays.</h1>
          <p className="page-description">
            Lumen d'Or is built around a simple idea: luxury should feel intimate before it feels loud.
          </p>
        </header>

        <section className="legal-content">
          <h2>Our Philosophy</h2>
          <p>
            The house pairs restrained presentation with direct, human service from first question to order.
            We craft our formulas in limited batches using sustainable extraction methods.
          </p>

          <h2>Principles</h2>
          <p>
            <strong>01. Presence:</strong> Designed around the impression that remains after the moment passes.<br />
            <strong>02. Restraint:</strong> No clutter, no false urgency, no unnecessary noise between you and the fragrance.<br />
            <strong>03. Craft:</strong> Meticulously blended by master perfumers using rare notes.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
