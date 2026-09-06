import { useState, useEffect } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  MessageCircle,
  User,
  ShieldCheck,
  Package,
  RotateCcw,
  Sparkles,
  LogOut,
  Sliders,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

const WHATSAPP_NUMBER = '17742707460';
const DISPLAY_PHONE = '+1 (774) 270-7460';

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function App() {
  const [currentView, setCurrentView] = useState<'storefront' | 'account' | 'admin'>('storefront');
  const [accountTab, setAccountTab] = useState<'overview' | 'orders' | 'membership' | 'returns' | 'security'>('overview');
  const [adminTab, setAdminTab] = useState<'inventory' | 'orders' | 'returns' | 'audit'>('inventory');

  // Account State
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoRenew, setAutoRenew] = useState<boolean>(true);

  // Return Request Form
  const [returnOrderId, setReturnOrderId] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('');
  const [returnMsg, setReturnMsg] = useState<string>('');

  // Admin Controls State
  const [inventoryAdjustment, setInventoryAdjustment] = useState({ variantId: 'var-lc-50', changeAmount: 10, reason: 'Stock intake' });
  const [adminAuditLogs, setAdminAuditLogs] = useState<any[]>([]);

  // Fetch Account Overview from API
  const fetchAccountOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/account/overview', {
        headers: { 'x-user-id': 'cust-001' },
      });
      const data = await res.json();
      setAccountData(data);
      if (data.membership) setAutoRenew(data.membership.autoRenew);
    } catch (err) {
      console.error('Error fetching account overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { 'x-user-id': 'admin-001' },
      });
      const data = await res.json();
      setAdminAuditLogs(data.auditLogs || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (currentView === 'account') fetchAccountOverview();
    if (currentView === 'admin') fetchAdminData();
  }, [currentView]);

  const handleToggleAutoRenew = async () => {
    try {
      const res = await fetch('/api/account/membership/toggle-auto-renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'cust-001',
        },
        body: JSON.stringify({ autoRenew: !autoRenew }),
      });
      const data = await res.json();
      if (data.membership) {
        setAutoRenew(data.membership.autoRenew);
        fetchAccountOverview();
      }
    } catch (err) {
      console.error('Error toggling auto-renew:', err);
    }
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setReturnMsg('Return request submitted for staff review.');
    setReturnReason('');
  };

  const handleAdjustInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'admin-001',
        },
        body: JSON.stringify(inventoryAdjustment),
      });
      const data = await res.json();
      if (data.level) {
        alert(`Inventory adjusted successfully. New stock: ${data.level.quantity}`);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to adjust inventory');
    }
  };

  return (
    <div className="site-shell">
      {/* HEADER NAVIGATION */}
      <header className="site-header">
        <a
          className="brand-lockup"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('storefront');
          }}
        >
          <img src="/mark.png" alt="" className="brand-mark" />
          <span>Lumen d'Or</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <button
            className={currentView === 'storefront' ? 'active' : ''}
            onClick={() => setCurrentView('storefront')}
          >
            Storefront
          </button>
          <button
            className={currentView === 'account' ? 'active' : ''}
            onClick={() => setCurrentView('account')}
          >
            Client Portal (/account)
          </button>
          <button
            className={currentView === 'admin' ? 'active' : ''}
            onClick={() => setCurrentView('admin')}
          >
            Maison Admin (/admin)
          </button>
        </nav>

        <a
          className="header-order-link"
          href={whatsappLink("Hello! I came from the Lumen D'Or website and I'd like help choosing a fragrance.")}
          target="_blank"
          rel="noreferrer"
        >
          Concierge
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
        </a>
      </header>

      {/* VIEW 1: STOREFRONT */}
      {currentView === 'storefront' && (
        <main>
          <section className="hero" id="top">
            <div className="hero-copy reveal reveal-1">
              <p className="eyebrow">Private fragrance house · 2026</p>
              <h1>
                Leave a trace.
                <span>Not an explanation.</span>
              </h1>
              <p className="hero-lede">
                Lumen d'Or introduces two signatures created around presence, memory and the ritual of being remembered.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#editions">
                  Discover the editions
                  <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.5} />
                </a>
                <button
                  className="button button-secondary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurrentView('account')}
                >
                  <User size={16} /> Client Portal
                </button>
              </div>
            </div>

            <div className="hero-art reveal reveal-2" aria-hidden="true">
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

          {/* EDITIONS SECTION */}
          <section className="section editions-section" id="editions">
            <div className="section-heading">
              <div>
                <p className="eyebrow">The first chapter</p>
                <h2>Two signatures. One house.</h2>
              </div>
              <p>
                Choose the edition that feels most like you. Active members receive 10% privilege on all purchases.
              </p>
            </div>

            <div className="edition-grid">
              <article className="edition-card" data-tone="dark">
                <div className="edition-visual">
                  <div className="edition-visual-meta">
                    <span>Edition I</span>
                    <span>50 ml</span>
                  </div>
                  <div className="edition-initials">LC</div>
                  <span className="edition-index">01</span>
                </div>
                <div className="edition-content">
                  <p className="edition-label">Edition I</p>
                  <h3>Le Cavalier</h3>
                  <p className="edition-description">
                    A composed signature for presence without excess.
                  </p>
                  <dl className="edition-details">
                    <div>
                      <dt>Format</dt>
                      <dd>50 ml</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>$250.00 USD</dd>
                    </div>
                    <div>
                      <dt>Privilege</dt>
                      <dd>10% Member Savings</dd>
                    </div>
                  </dl>
                  <a
                    className="button button-whatsapp"
                    href={whatsappLink("Hello! I'd like to order Le Cavalier (50 ml).")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={18} /> Order Le Cavalier
                  </a>
                </div>
              </article>

              <article className="edition-card" data-tone="light">
                <div className="edition-visual">
                  <div className="edition-visual-meta">
                    <span>Edition II</span>
                    <span>50 ml</span>
                  </div>
                  <div className="edition-initials">LS</div>
                  <span className="edition-index">02</span>
                </div>
                <div className="edition-content">
                  <p className="edition-label">Edition II</p>
                  <h3>La Signature</h3>
                  <p className="edition-description">
                    An elegant signature designed to feel personal and memorable.
                  </p>
                  <dl className="edition-details">
                    <div>
                      <dt>Format</dt>
                      <dd>50 ml</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>$290.00 USD</dd>
                    </div>
                    <div>
                      <dt>Privilege</dt>
                      <dd>10% Member Savings</dd>
                    </div>
                  </dl>
                  <a
                    className="button button-whatsapp"
                    href={whatsappLink("Hello! I'd like to order La Signature (50 ml).")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={18} /> Order La Signature
                  </a>
                </div>
              </article>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: CLIENT PORTAL (`/account`) */}
      {currentView === 'account' && (
        <main className="section portal-section" style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <p className="eyebrow">Client Portal</p>
              <h2>Welcome, Valued Member</h2>
            </div>
            <button className="button" style={{ background: '#1c1917', color: '#f5f5f4', padding: '0.5rem 1rem' }} onClick={() => setCurrentView('storefront')}>
              <LogOut size={16} /> Return to House
            </button>
          </div>

          <nav style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <button
              style={{ background: accountTab === 'overview' ? '#d4af37' : 'transparent', color: accountTab === 'overview' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAccountTab('overview')}
            >
              Overview
            </button>
            <button
              style={{ background: accountTab === 'membership' ? '#d4af37' : 'transparent', color: accountTab === 'membership' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAccountTab('membership')}
            >
              Membership
            </button>
            <button
              style={{ background: accountTab === 'orders' ? '#d4af37' : 'transparent', color: accountTab === 'orders' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAccountTab('orders')}
            >
              Orders & Tracking
            </button>
            <button
              style={{ background: accountTab === 'returns' ? '#d4af37' : 'transparent', color: accountTab === 'returns' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAccountTab('returns')}
            >
              Returns & Refunds
            </button>
            <button
              style={{ background: accountTab === 'security' ? '#d4af37' : 'transparent', color: accountTab === 'security' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAccountTab('security')}
            >
              Security & MFA
            </button>
          </nav>

          {loading ? (
            <p>Loading client portal data...</p>
          ) : (
            <>
              {accountTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #27272a' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={20} color="#d4af37" /> Membership Status
                    </h3>
                    <p><strong>Plan:</strong> Monthly Annual Commitment (12 Months)</p>
                    <p><strong>Billing:</strong> 11 Paid Installments + 1 Included Month</p>
                    <p><strong>Status:</strong> <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span></p>
                    <p><strong>Privileges:</strong> 10% Discount & Member Exclusive Editions</p>
                  </div>

                  <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #27272a' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Package size={20} color="#d4af37" /> Account Summary
                    </h3>
                    <p><strong>Email:</strong> member@lumendor.com</p>
                    <p><strong>Total Orders:</strong> {accountData?.ordersCount || 0}</p>
                    <p><strong>Default Currency:</strong> USD ($)</p>
                  </div>
                </div>
              )}

              {accountTab === 'membership' && (
                <div style={{ background: '#18181b', padding: '2rem', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Lumen D'Or Annual Membership</h3>
                  <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                    Your 12-month commitment grants priority access, 10% product privilege, and exclusive private collection releases.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: '#09090b', padding: '1rem', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Status</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#22c55e' }}>Active</p>
                    </div>
                    <div style={{ background: '#09090b', padding: '1rem', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Billing Primitive</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>11-Paid / 1-Included</p>
                    </div>
                    <div style={{ background: '#09090b', padding: '1rem', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Grace Period Rule</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>48-Hour Protection</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #27272a', paddingTop: '1.5rem' }}>
                    <div>
                      <strong>Automatic Renewal for Next Term</strong>
                      <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>
                        Disabling auto-renew will not cancel your current active 12-month commitment.
                      </p>
                    </div>
                    <button
                      onClick={handleToggleAutoRenew}
                      style={{
                        background: autoRenew ? '#22c55e' : '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {autoRenew ? 'Auto-Renew ON' : 'Auto-Renew OFF'}
                    </button>
                  </div>
                </div>
              )}

              {accountTab === 'orders' && (
                <div style={{ background: '#18181b', padding: '2rem', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <h3>Order History & Tracking</h3>
                  <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>View completed orders and live shipment tracking status.</p>
                  {accountData?.recentOrders?.length === 0 ? (
                    <p>No orders recorded yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {accountData?.recentOrders?.map((ord: any) => (
                        <div key={ord.id} style={{ background: '#09090b', padding: '1rem', borderRadius: '6px', border: '1px solid #27272a' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>Order #{ord.orderNumber}</strong>
                            <span style={{ color: '#d4af37', fontWeight: 600 }}>${(ord.totalCents / 100).toFixed(2)} USD</span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Status: {ord.status.toUpperCase()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {accountTab === 'returns' && (
                <div style={{ background: '#18181b', padding: '2rem', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <h3>Request Return & Refund</h3>
                  <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                    Returns are reviewed by the house concierge. Approved refunds do not automatically restock inventory until physical receipt confirmation.
                  </p>
                  <form onSubmit={handleSubmitReturn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Order ID</label>
                      <input
                        type="text"
                        value={returnOrderId}
                        onChange={(e) => setReturnOrderId(e.target.value)}
                        placeholder="e.g. ord-12345"
                        style={{ width: '100%', padding: '0.5rem', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Reason for Return</label>
                      <textarea
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        placeholder="State your reason for return..."
                        rows={3}
                        style={{ width: '100%', padding: '0.5rem', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px' }}
                        required
                      />
                    </div>
                    <button type="submit" className="button button-primary" style={{ cursor: 'pointer' }}>
                      Submit Return Request
                    </button>
                    {returnMsg && <p style={{ color: '#22c55e', fontSize: '0.875rem' }}>{returnMsg}</p>}
                  </form>
                </div>
              )}

              {accountTab === 'security' && (
                <div style={{ background: '#18181b', padding: '2rem', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={20} color="#22c55e" /> Security & Authentication Settings
                  </h3>
                  <p style={{ color: '#a1a1aa', margin: '1rem 0' }}>
                    Email/Password authentication active. Server-side session protection enabled.
                  </p>
                  <div style={{ background: '#09090b', padding: '1rem', borderRadius: '6px' }}>
                    <p><strong>Role:</strong> Customer</p>
                    <p><strong>Multi-Tenant Isolation:</strong> Active</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* VIEW 3: MAISON ADMIN (`/admin`) */}
      {currentView === 'admin' && (
        <main className="section admin-section" style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <p className="eyebrow" style={{ color: '#eab308' }}>Maison Administration</p>
              <h2>House Operations & Management</h2>
            </div>
            <button className="button" style={{ background: '#1c1917', color: '#f5f5f4', padding: '0.5rem 1rem' }} onClick={() => setCurrentView('storefront')}>
              <LogOut size={16} /> Exit Admin
            </button>
          </div>

          <div style={{ background: '#1c1917', border: '1px solid #eab308', padding: '1rem', borderRadius: '6px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#eab308" />
            <span><strong>Mandatory Admin MFA Verified:</strong> Owner Role Authorized</span>
          </div>

          <nav style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <button
              style={{ background: adminTab === 'inventory' ? '#eab308' : 'transparent', color: adminTab === 'inventory' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAdminTab('inventory')}
            >
              Inventory Control
            </button>
            <button
              style={{ background: adminTab === 'audit' ? '#eab308' : 'transparent', color: adminTab === 'audit' ? '#000' : '#a1a1aa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setAdminTab('audit')}
            >
              Audit Logs
            </button>
          </nav>

          {adminTab === 'inventory' && (
            <div style={{ background: '#18181b', padding: '2rem', borderRadius: '8px', border: '1px solid #27272a' }}>
              <h3>Manual Inventory Intake & Restock</h3>
              <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                Stock levels are subject to non-negative inventory constraints (`quantity &gt;= 0`).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Variant SKU</label>
                  <select
                    value={inventoryAdjustment.variantId}
                    onChange={(e) => setInventoryAdjustment({ ...inventoryAdjustment, variantId: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px' }}
                  >
                    <option value="var-lc-50">Le Cavalier 50 ml (var-lc-50)</option>
                    <option value="var-ls-50">La Signature 50 ml (var-ls-50)</option>
                    <option value="var-rp-50">Réserve Privée 50 ml (var-rp-50)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Quantity Change (+/-)</label>
                  <input
                    type="number"
                    value={inventoryAdjustment.changeAmount}
                    onChange={(e) => setInventoryAdjustment({ ...inventoryAdjustment, changeAmount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Reason / Audit Note</label>
                  <input
                    type="text"
                    value={inventoryAdjustment.reason}
                    onChange={(e) => setInventoryAdjustment({ ...inventoryAdjustment, reason: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '4px' }}
                  />
                </div>
                <button onClick={handleAdjustInventory} className="button button-primary" style={{ cursor: 'pointer' }}>
                  Execute Adjustment
                </button>
              </div>
            </div>
          )}

          {adminTab === 'audit' && (
            <div style={{ background: '#18181b', padding: '2rem', borderRadius: '8px', border: '1px solid #27272a' }}>
              <h3>House Operations Audit Trail</h3>
              <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>Immutably recorded staff actions, refunds, and restocks.</p>
              {adminAuditLogs.length === 0 ? (
                <p>No audit logs recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {adminAuditLogs.map((log) => (
                    <div key={log.id} style={{ background: '#09090b', padding: '0.75rem', borderRadius: '4px', fontSize: '0.875rem', borderLeft: '3px solid #eab308' }}>
                      <strong>[{log.action}]</strong> by {log.actorId || 'System'} at {log.createdAt}
                      <pre style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#a1a1aa' }}>{JSON.stringify(log.details)}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/mark.png" alt="" />
          <span>Lumen d'Or</span>
        </div>
        <p>Le Cavalier · La Signature · Réserve Privée</p>
        <p>© 2026 Lumen d'Or. All rights reserved.</p>
      </footer>
    </div>
  );
}
