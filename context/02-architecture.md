# System Architecture — Lumen D'Or

## Modular Monolith Structure
Lumen D'Or is implemented as a TypeScript modular monolith containing both backend API services and a React frontend client.

```
src/
├── server/               # Modular Monolith Backend
│   ├── auth/             # Auth, JWT verification, RBAC, Admin MFA
│   ├── catalog/          # Products, Variants/SKUs
│   ├── inventory/        # Stock levels, Reservations, Manual adjustments
│   ├── pricing/          # Integer math, Member 10% vs Promo discount rules, Stripe Tax
│   ├── checkout/         # Stripe TEST checkout sessions, Cart validation
│   ├── webhooks/         # Stripe webhook listener with idempotency
│   ├── membership/       # Membership lifecycle, 48h Grace Period engine
│   ├── orders/           # Order management & ShippingProvider integration
│   ├── returns/          # Return processing, Stripe refunds, Restock confirmation
│   ├── notifications/    # Supabase durable outbox, Resend email worker
│   └── audit/            # Action audit logging
├── client/               # Storefront, Customer Portal (/account), Admin (/admin)
└── test/                 # Integration & Unit test suite
```

## Data Partition Model
- **Supabase (PostgreSQL)**: Primary operational datastore holding users, profiles, roles, products, inventory, orders, memberships, outbox notifications, and audit logs.
- **Stripe**: Financial processor for checkout payments, subscriptions (TEST mode), and tax calculation.
