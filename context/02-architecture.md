# Architecture — Modular Monolith

## System Layout
```
src/
  app/                    # Next.js App Router pages, APIs & layouts
    (storefront)/         # Public storefront routes
    admin/                # DB-backed internal operations console
    api/                  # Server-authoritative APIs & webhooks
  features/               # Modular business domains
    auth/                 # Clerk identity, Supabase profile sync, RBAC
    account/              # Customer profile & account management
    cart/                 # Pre-login client cart state
    checkout/             # Pricing breakdown & Stripe checkout session
    orders/               # Order lifecycle & historical snapshots
    products/             # Catalog management (Products & ProductVariants/SKUs)
    inventory/            # Inventory ledger & stock movements
    discounts/            # Server-side non-stacking discount engine
    shipping/             # ShippingProvider abstraction & restrictions
    landed-cost/          # LandedCostProvider abstraction
    tax/                  # Stripe Tax snapshot integration
    membership/           # Membership foundations & tier definitions
    audit/                # Admin action audit log ledger
  data/                   # Database schemas & Supabase client setup
  lib/                    # Utilities & env validation
```

## Security & Server Authority
- All business logic (pricing, inventory reservations, discount computation, tax, shipping validation) runs server-side.
- Webhook endpoints process events idempotently using `processed_webhooks` table.
