import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function HomePage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Private Fragrance House · 2026</p>
            <h1>
              Leave a trace.
              <span>Not an explanation.</span>
            </h1>
            <p className="hero-lede">
              Lumen d'Or introduces two signatures created around presence, memory, and the ritual of being remembered.
            </p>

            <div className="hero-actions">
              <Link className="button button-primary" href="/shop">
                Discover the Editions
                <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.5} />
              </Link>
              <Link className="button button-outline" href="/membership">
                Private Membership
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-art-frame">
              <div className="hero-art-topline">
                <span>Maison privée</span>
                <span>50 ml</span>
              </div>
              <div className="hero-monogram-wrap">
                <img src="/mark.png" alt="" className="hero-monogram" />
              </div>
              <div className="hero-art-wordmark">
                <span>Lumen</span>
                <span>d'Or</span>
              </div>
              <div className="hero-art-footer">Le Cavalier · La Signature</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
