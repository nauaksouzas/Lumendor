'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Authentication strictly server-authoritative via Clerk SDK.');
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="page-container" style={{ maxWidth: '520px' }}>
        <header className="page-header">
          <p className="eyebrow">Client Portal</p>
          <h1 className="page-title">Sign In</h1>
          <p className="page-description" style={{ fontSize: '15px' }}>
            Access your order archive and private member privileges.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="product-card" style={{ minHeight: 'auto' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && <p className="eyebrow" style={{ marginTop: '12px' }}>{message}</p>}

          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="button button-primary" style={{ width: '100%' }}>
              Sign In
            </button>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'rgba(239, 232, 220, 0.6)' }}>
            Don't have an account? <Link href="/sign-up" style={{ color: 'var(--gold)' }}>Apply for Membership</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
