import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

const productDetails: Record<string, { name: string; edition: string; price: string; description: string; notes: string }> = {
  'le-cavalier': {
    name: 'Le Cavalier',
    edition: 'Edition I',
    price: '$280.00',
    description: 'A composed signature for the moments that call for presence without excess.',
    notes: 'Italian Bergamot, Smoked Vetiver, Golden Amber, Cashmere Wood.',
  },
  'la-signature': {
    name: 'La Signature',
    edition: 'Edition II',
    price: '$280.00',
    description: 'An elegant signature designed to feel personal, memorable and unmistakably yours.',
    notes: 'Orris Butter, Bulgarian Rose, White Suede, Saffron.',
  },
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productDetails[slug];

  if (!product) {
    notFound();
  }

  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">{product.edition}</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="product-card-price" style={{ fontSize: '24px' }}>{product.price}</p>
          <p className="page-description">{product.description}</p>
        </header>

        <section className="legal-content">
          <h2>Olfactory Profile</h2>
          <p>{product.notes}</p>

          <h2>Specifications</h2>
          <p>
            Volume: 50 ml / 1.7 fl. oz.<br />
            Concentration: Extrait de Parfum (28% concentration)<br />
            Transport: Compliant with air transport safety standards.
          </p>

          <div style={{ marginTop: '40px' }}>
            <Link className="button button-primary" href="/cart">
              Add to Cart — {product.price}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
