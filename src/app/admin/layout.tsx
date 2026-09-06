import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand-lockup">
          <img src="/mark.png" alt="" className="brand-mark" />
          <span>Lumen Admin</span>
        </div>

        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products & SKUs</Link>
          <Link href="/admin/inventory">Inventory Ledger</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/customers">Customers</Link>
          <Link href="/admin/promotions">Promotions</Link>
          <Link href="/admin/shipping">Shipping Rates</Link>
          <Link href="/admin/countries">Countries</Link>
          <Link href="/admin/content">Content</Link>
          <Link href="/admin/audit">Audit Logs</Link>
        </nav>

        <div style={{ marginTop: 'auto', fontSize: '11px', opacity: 0.6 }}>
          Role: Director / Owner<br />
          MFA Status: Verified
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
