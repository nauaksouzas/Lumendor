# Spec 001: Lumen D'Or V1 Architecture Foundation & Stripe TEST Commerce Vertical Slice

## Goal
Establish Next.js App Router monolith, editorial storefront, RBAC auth system, products & inventory ledger, server-authoritative checkout, non-stacking discount engine, shipping/duty abstractions, Stripe webhooks, and DB-backed admin routes.

## Scope
- Next.js 15 + React 19 + Tailwind CSS + Vitest
- Database schema in `supabase/migrations/`
- Full Public Storefront routes
- Clerk + Supabase Profile RBAC & MFA check
- Products & Inventory Ledger
- Server Checkout, Non-Stacking Discounts, Shipping & Duty abstractions
- Stripe Webhook handler & Idempotent Order State machine
- 10 DB-backed Admin surfaces

## Verification
- Unit & integration test suite (`tests/`)
- Typecheck (`npm run typecheck`)
- Build (`npm run build`)
