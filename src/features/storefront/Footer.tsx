import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/mark.png" alt="Lumen d'Or" />
        <span>Lumen d'Or</span>
      </div>

      <div className="footer-links">
        <Link href="/story">Our Story</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/membership">Membership</Link>
        <Link href="/legal/terms">Terms</Link>
        <Link href="/legal/privacy">Privacy</Link>
        <Link href="/legal/shipping">Shipping & Delivery</Link>
        <Link href="/legal/returns">Returns & Guarantee</Link>
        <Link href="/legal/membership-terms">Membership Terms</Link>
      </div>

      <p>© 2026 Lumen d'Or. All rights reserved.</p>
    </footer>
  );
}
