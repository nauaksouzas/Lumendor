# Lumen D'Or V1 Approved Design Specification

Date: 2026-09-06

## Architectural Mandates
1. **Next.js App Router Monolith**: Single repository containing storefront, API routes, and DB-backed admin console.
2. **Server-Authoritative Commerce**: Browser totals are strictly informative. Checkout sessions recalculate pricing, discounts, shipping, duties, and taxes server-side in USD integer cents.
3. **No Guest Checkout**: All purchases require an authenticated customer account.
4. **Inventory Ledger**: Real-time stock levels with atomic movement logs (`sale`, `restock`, `return`, `manual_adjustment`, `damage`, `reservation`, `release`).
5. **RBAC & Admin MFA**: Roles (`customer`, `staff`, `director`, `owner`). Mandatory MFA check for admin operations. Staff access strictly limited to non-financial/non-security operations.
6. **Provider Abstractions**: Isolated `ShippingProvider` and `LandedCostProvider` interfaces with test adapters when live keys are unconfigured. Block checkout if rate computation fails.
7. **Stripe TEST Mode Webhook Idempotency**: Payment confirmation via Stripe webhook signature verification and deduplicated event logging (`processed_webhooks`).
