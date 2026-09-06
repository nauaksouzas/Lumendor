import Link from 'next/link';
import { ArrowUpRight, ShoppingBag, User } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="Lumen d'Or home">
        <img src="/mark.png" alt="Lumen d'Or" className="brand-mark" />
        <span>Lumen d'Or</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/shop">Shop</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/story">The House</Link>
        <Link href="/membership">Membership</Link>
        <Link href="/contact">Concierge</Link>
      </nav>

      <div className="header-actions">
        <Link href="/cart" className="header-icon-link" aria-label="View Cart">
          <ShoppingBag size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/login" className="header-icon-link" aria-label="Account Login">
          <User size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/shop" className="header-order-link">
          Explore
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}
