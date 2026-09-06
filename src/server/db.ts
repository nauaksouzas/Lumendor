import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfile,
  Product,
  ProductVariant,
  InventoryLevel,
  InventoryReservation,
  Order,
  Membership,
  ReturnRequest,
  OutboxNotification,
  AuditLog,
} from './types';

export class OperationalStore {
  supabase: SupabaseClient | null = null;
  profiles = new Map<string, UserProfile>();
  products = new Map<string, Product>();
  variants = new Map<string, ProductVariant>();
  inventory = new Map<string, InventoryLevel>();
  reservations = new Map<string, InventoryReservation>();
  orders = new Map<string, Order>();
  memberships = new Map<string, Membership>();
  returnRequests = new Map<string, ReturnRequest>();
  outbox = new Map<string, OutboxNotification>();
  auditLogs: AuditLog[] = [];
  processedWebhookEvents = new Set<string>();

  constructor() {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (url && key) {
      try {
        this.supabase = createClient(url, key);
        console.log('[SUPABASE] Operational state initialized with Supabase client.');
      } catch (err) {
        console.warn('[SUPABASE] Could not initialize Supabase client, using operational in-memory store:', err);
      }
    }

    this.seedDefaults();
  }

  seedDefaults() {
    const adminId = 'admin-001';
    this.profiles.set(adminId, {
      id: adminId,
      email: 'owner@lumendor.com',
      fullName: 'House Owner',
      roles: ['owner', 'director', 'staff', 'customer'],
      mfaEnabled: true,
      mfaVerified: true,
    });

    const customerId = 'cust-001';
    this.profiles.set(customerId, {
      id: customerId,
      email: 'member@lumendor.com',
      fullName: 'Valued Customer',
      roles: ['customer'],
      mfaEnabled: false,
    });

    const prod1: Product = {
      id: 'prod-le-cavalier',
      slug: 'le-cavalier',
      name: 'Le Cavalier',
      description: 'A composed signature for presence without excess.',
      edition: 'Edition I',
      isMemberExclusive: false,
      isActive: true,
      variants: [],
    };

    const var1: ProductVariant = {
      id: 'var-lc-50',
      productId: prod1.id,
      sku: 'LUM-LC-050',
      title: 'Le Cavalier 50 ml',
      sizeMl: 50,
      priceCents: 25000,
      stripePriceId: 'price_test_lc50',
      isActive: true,
    };
    prod1.variants.push(var1);

    const prod2: Product = {
      id: 'prod-la-signature',
      slug: 'la-signature',
      name: 'La Signature',
      description: 'An elegant signature designed to feel personal and memorable.',
      edition: 'Edition II',
      isMemberExclusive: false,
      isActive: true,
      variants: [],
    };

    const var2: ProductVariant = {
      id: 'var-ls-50',
      productId: prod2.id,
      sku: 'LUM-LS-050',
      title: 'La Signature 50 ml',
      sizeMl: 50,
      priceCents: 29000,
      stripePriceId: 'price_test_ls50',
      isActive: true,
    };
    prod2.variants.push(var2);

    const prod3: Product = {
      id: 'prod-reserve-privee',
      slug: 'reserve-privee',
      name: 'Réserve Privée',
      description: 'Member-exclusive fragrance edition.',
      edition: 'Private Collection',
      isMemberExclusive: true,
      isActive: true,
      variants: [],
    };

    const var3: ProductVariant = {
      id: 'var-rp-50',
      productId: prod3.id,
      sku: 'LUM-RP-050',
      title: 'Réserve Privée 50 ml',
      sizeMl: 50,
      priceCents: 45000,
      stripePriceId: 'price_test_rp50',
      isActive: true,
    };
    prod3.variants.push(var3);

    this.products.set(prod1.id, prod1);
    this.products.set(prod2.id, prod2);
    this.products.set(prod3.id, prod3);

    this.variants.set(var1.id, var1);
    this.variants.set(var2.id, var2);
    this.variants.set(var3.id, var3);

    this.inventory.set(var1.id, { variantId: var1.id, quantity: 100, reservedQuantity: 0 });
    this.inventory.set(var2.id, { variantId: var2.id, quantity: 100, reservedQuantity: 0 });
    this.inventory.set(var3.id, { variantId: var3.id, quantity: 50, reservedQuantity: 0 });
  }

  reset() {
    this.profiles.clear();
    this.products.clear();
    this.variants.clear();
    this.inventory.clear();
    this.reservations.clear();
    this.orders.clear();
    this.memberships.clear();
    this.returnRequests.clear();
    this.outbox.clear();
    this.auditLogs = [];
    this.processedWebhookEvents.clear();
    this.seedDefaults();
  }
}

export const db = new OperationalStore();
