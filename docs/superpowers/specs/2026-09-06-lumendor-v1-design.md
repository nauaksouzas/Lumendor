# Lumen D'Or V1 Design Specification

## Overview
Modular Monolith system for luxury commerce:
- **Language**: English
- **Currency**: USD (integer cents)
- **Auth**: Email/Password + Admin MFA
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe TEST mode (Checkout, Webhooks, Subscriptions, Tax)
- **Membership**: 12-Month Term (Annual Upfront or Monthly Annual Commitment - 11 paid / 1 included). 48h payment grace period.
- **Returns & Refunds**: Staff review, Stripe refund, isolated physical restock upon receipt.
- **Notifications**: Resend via Supabase durable outbox (`outbox_notifications`).
