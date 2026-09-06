'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/features/storefront/Header';
import { Footer } from '@/features/storefront/Footer';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Registration submitted. Please verify your email.');
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="page-container" style={{ maxWidth: '520px' }}>
        <header className="page-header">
          <p className="eyebrow">House Account</p>
          <h1 className="page-title">Register</h1>
          <p className="page-description" style={{ fontSize: '15px' }}>
            Create an account for expedited international transport and order history.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="product-card" style={{ minHeight: 'auto' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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
              Create Account
            </button>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'rgba(239, 232, 220, 0.6)' }}>
            Already registered? <Link href="/login" style={{ color: 'var(--gold)' }}>Sign In</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
