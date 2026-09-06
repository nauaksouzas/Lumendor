# Project Overview — Lumen D'Or V1

## Vision
Lumen D'Or is an ultra-luxury private fragrance house. V1 establishes the official authenticated digital storefront, customer accounts, internal inventory ledger, server-authoritative checkout via Stripe TEST mode, international shipping & landed cost abstractions, and internal administration console.

## Scope & Constraints
- **Brand:** Official Lumen D'Or luxury identity.
- **Language:** English only.
- **Currency:** USD only (integer cents).
- **Authentication:** Email and password only (Clerk integration + Supabase profile link). No social login, no guest checkout.
- **Admin MFA:** Mandatory for staff/director/owner roles.
- **Architecture:** Next.js App Router modular monolith. Single repository, single Supabase project for V1.
- **Payment Authority:** Verified server-side Stripe response/webhook.
