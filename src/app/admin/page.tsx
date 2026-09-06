export default function AdminDashboardPage() {
  return (
    <div>
      <p className="eyebrow">Operations Console</p>
      <h1 className="page-title">Executive Overview</h1>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '32px' }}>
        <div className="product-card" style={{ minHeight: 'auto' }}>
          <p className="eyebrow">Gross Sales</p>
          <h2 className="product-card-title">$14,280.00</h2>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>USD Integer Cents Server-Authoritative</p>
        </div>

        <div className="product-card" style={{ minHeight: 'auto' }}>
          <p className="eyebrow">Orders Fulfilled</p>
          <h2 className="product-card-title">51</h2>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>Insured White-Glove Deliveries</p>
        </div>

        <div className="product-card" style={{ minHeight: 'auto' }}>
          <p className="eyebrow">Inventory Health</p>
          <h2 className="product-card-title">100 SKUs</h2>
          <p style={{ fontSize: '12px', color: 'var(--gold)', margin: 0 }}>Zero Negative Stock Faults</p>
        </div>
      </div>
    </div>
  );
}
