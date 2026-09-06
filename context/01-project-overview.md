# Project Overview — Lumen D'Or

Lumen D'Or is an international private luxury fragrance house offering flagship fragrances (e.g. *Le Cavalier* and *La Signature*) alongside an exclusive membership program.

## Core V1 Capabilities
1. **Authentication & Authorization**: Email/password authentication, RBAC (`customer`, `staff`, `director`, `owner`), and mandatory Admin MFA.
2. **Catalog & Inventory System**: Products with variants/SKUs, real-time stock levels, reservation system, and concurrency-safe non-negative stock control.
3. **Cart & Pricing Engine**: Integer-cent calculations, stacked discount suppression (Member 10% vs Promo %, maximum applied, no double discounting), Stripe Tax integration, and landed cost/shipping calculations.
4. **Checkout & Webhooks**: Stripe TEST mode checkout, verified webhook idempotency, and transactional order creation.
5. **Membership Engine (Phase 7)**:
   - 12-month membership term.
   - 10% product discount & exclusive product access.
   - Billing Modes: Annual Upfront (12 months at price of 11 reference payments) and Monthly Annual Commitment (12-month commitment, 11 paid monthly payments + 1 included).
   - 48-Hour Grace Period on payment failure before entitlement suspension.
6. **Customer Portal (`/account`) & Fulfillment (Phase 8)**: Orders, shipments, tracking, membership dashboard, and safe Stripe portal management.
7. **Returns, Refunds & Outbox Notifications (Phase 9)**: Staff-reviewed returns, Stripe refunds, physical restock isolation, and durable Supabase outbox notifications via Resend.
8. **Security & Operations (Phase 10 & 11)**: Audit logging, multi-tenant data isolation, health/readiness probes, and go-live readiness.
