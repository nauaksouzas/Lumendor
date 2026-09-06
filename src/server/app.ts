import express, { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { getAllProducts, getProductBySlug } from './catalog';
import { calculateCartTotals } from './pricing';
import { getAvailableStock, adjustInventoryManually } from './inventory';
import { getOrdersByCustomer, getOrderById } from './orders';
import { MembershipService } from './membership';
import { getProfileById, verifyRole, isMfaRequiredAndVerified } from './auth';

export const app = express();
app.use(express.json());

// Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health & Readiness Probes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/ready', (_req: Request, res: Response) => {
  res.json({ status: 'ready', database: 'connected', timestamp: new Date().toISOString() });
});

// Catalog & Inventory APIs
app.get('/api/catalog/products', (req: Request, res: Response) => {
  const isMember = req.query.isMember === 'true';
  const products = getAllProducts(isMember);
  res.json({ products });
});

app.get('/api/catalog/products/:slug', (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const product = getProductBySlug(slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

app.get('/api/inventory/stock/:variantId', (req: Request, res: Response) => {
  const variantId = Array.isArray(req.params.variantId) ? req.params.variantId[0] : req.params.variantId;
  const available = getAvailableStock(variantId);
  res.json({ variantId, availableStock: available });
});

// Pricing Calculation API
app.post('/api/pricing/calculate', (req: Request, res: Response) => {
  try {
    const { variantIds, isMember, promoCode, country, shippingRateId } = req.body;
    const items = (variantIds || []).map((id: string) => {
      const variant = db.variants.get(id);
      if (!variant) throw new Error(`Variant ${id} not found`);
      return { variant, quantity: 1 };
    });

    const promoPercentage = promoCode === 'SUMMER20' ? 20 : promoCode === 'SAVE5' ? 5 : 0;
    const breakdown = calculateCartTotals(items, Boolean(isMember), promoPercentage, country || 'US', shippingRateId);

    res.json({ breakdown });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- CUSTOMER PORTAL (`/account`) APIs ---
app.get('/api/account/overview', (req: Request, res: Response) => {
  const customerId = (req.headers['x-user-id'] as string) || 'cust-001';
  const profile = getProfileById(customerId);
  const orders = getOrdersByCustomer(customerId);
  const membership = db.memberships.get(customerId);
  const isEntitled = MembershipService.isEntitled(customerId);

  res.json({
    profile,
    ordersCount: orders.length,
    recentOrders: orders.slice(0, 5),
    membership: membership
      ? {
          ...membership,
          isEntitled,
        }
      : null,
  });
});

app.get('/api/account/orders', (req: Request, res: Response) => {
  const customerId = (req.headers['x-user-id'] as string) || 'cust-001';
  const orders = getOrdersByCustomer(customerId);
  res.json({ orders });
});

app.get('/api/account/orders/:id', (req: Request, res: Response) => {
  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const order = getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

app.post('/api/account/membership/toggle-auto-renew', (req: Request, res: Response) => {
  try {
    const customerId = (req.headers['x-user-id'] as string) || 'cust-001';
    const { autoRenew } = req.body;
    const updated = MembershipService.setAutoRenew(customerId, Boolean(autoRenew));
    res.json({ membership: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- ADMIN (`/admin`) APIs (RBAC + MFA Enforced) ---
const adminAuthGuard = (req: Request, res: Response, next: NextFunction) => {
  const adminId = (req.headers['x-user-id'] as string) || 'admin-001';
  const profile = getProfileById(adminId);
  if (!profile) return res.status(401).json({ error: 'Unauthorized profile' });

  if (!verifyRole(profile, 'staff')) {
    return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
  }

  if (!isMfaRequiredAndVerified(profile)) {
    return res.status(403).json({ error: 'Forbidden: Mandatory Admin MFA not verified' });
  }

  (req as any).adminUser = profile;
  next();
};

app.post('/api/admin/inventory/adjust', adminAuthGuard, (req: Request, res: Response) => {
  try {
    const { variantId, changeAmount, reason } = req.body;
    const admin = (req as any).adminUser;
    const level = adjustInventoryManually(variantId, admin.id, Number(changeAmount), reason || 'Admin manual adjustment');
    res.json({ level });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/orders', adminAuthGuard, (_req: Request, res: Response) => {
  res.json({ orders: Array.from(db.orders.values()) });
});

app.get('/api/admin/audit-logs', adminAuthGuard, (_req: Request, res: Response) => {
  res.json({ auditLogs: db.auditLogs });
});

// Error Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});
