'use client';

import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function CartPage() {
  const items = [
    {
      sku: 'LC-50ML',
      name: 'Le Cavalier',
      format: '50 ml / 1.7 fl. oz.',
      priceCents: 28000,
      quantity: 1,
    },
  ];

  const subtotalCents = items.reduce((acc, item) => acc + item.priceCents * item.quantity, 0);

  return (
    <div className="site-shell">
      <Header />
      <main className="page-container">
        <header className="page-header">
          <p className="eyebrow">Shopping Selection</p>
          <h1 className="page-title">Your Cart</h1>
        </header>

        {items.length === 0 ? (
          <div className="product-card">
            <p className="page-description">Your cart is currently empty.</p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/shop" className="button button-primary">Discover Editions</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            <div className="product-card" style={{ minHeight: 'auto' }}>
              {items.map((item) => (
                <div key={item.sku} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--line-dark)' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px' }}>{item.name}</h3>
                    <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>{item.format} · SKU: {item.sku}</p>
                    <p style={{ fontSize: '13px', opacity: 0.7, margin: '8px 0 0' }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 500 }}>
                    ${(item.priceCents / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="product-card" style={{ minHeight: 'auto' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 20px' }}>Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Subtotal</span>
                <span>${(subtotalCents / 100).toFixed(2)}</span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.6, margin: '0 0 24px' }}>
                Shipping, duties, taxes and eligible member discounts will be calculated during server checkout.
              </p>

              <p style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '16px' }}>
                Authentication required before payable checkout. Guest checkout is not permitted.
              </p>

              <Link href="/login" className="button button-primary" style={{ width: '100%' }}>
                Sign In to Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
