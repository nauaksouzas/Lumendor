# AGENTS.md — Lumen D'Or Engineering Directives

## Mission & Principles
Lumen D'Or is a luxury private fragrance house operating a modular monolith commerce platform.

### Non-Negotiable Rules
- **Currency & Language**: USD integer cents (`$100.00` = `10000`). English only.
- **State Partition**: Supabase holds operational state (users, orders, inventory, memberships, audit logs). Stripe holds financial state (customers, checkout sessions, test mode subscriptions/payments).
- **Checkout & Cart**: No guest checkout. Email/password authentication required.
- **Admin Security**: Mandatory Admin MFA (`admin_mfa` verified). Server-side authorization enforced on every route and mutation.
- **Inventory Safety**: Concurrency-safe reservations with non-negative constraints (`quantity >= 0`). Expiration releases reserved stock.
- **Membership**: 12-month commitment (Annual Upfront or Monthly Annual Commitment - 11 paid / 1 included). 48-hour business grace period on payment failure before suspension.
- **Returns & Restock**: Refunds NEVER automatically restock inventory. Restock occurs ONLY after staff confirmation of physical product receipt.
- **Transactional Email**: Resend integration via Supabase durable outbox (`outbox_notifications`). Outbox failures must never corrupt business state.

## Quality Gates
Run before submitting code changes:
```bash
npm run lint
npm run build
npm test
```
