# Lumen D'Or Go-Live Readiness Checklist

## Production Blockers & Pre-Requisites
Before changing Stripe from TEST to LIVE mode or charging real credit cards, the following items MUST be completed:

- [ ] **Stripe Production Account**: Activated official Lumen D'Or merchant account.
- [ ] **Live Credentials**: Configured `STRIPE_SECRET_KEY` (`sk_live_...`) and `STRIPE_PUBLISHABLE_KEY` (`pk_live_...`).
- [ ] **Production Webhooks**: Webhook endpoint registered at `https://api.lumendor.com/api/webhooks/stripe` with `STRIPE_WEBHOOK_SECRET` (`whsec_...`).
- [ ] **Catalog & Pricing Validation**: Director sign-off on official USD catalog, SKUs, and official 11-paid/1-included membership price points.
- [ ] **Real Shipping Integration**: Registered Carrier API keys for DHL Express / FedEx accounts.
- [ ] **Real Landed Cost Integration**: Live credentials for customs/duty calculation.
- [ ] **Transactional Email Domain**: Verified domain `lumendor.com` in Resend dashboard with SPF, DKIM, and DMARC records.
- [ ] **Legal & Compliance Policies**: Approved Terms of Service, Privacy Policy, Shipping Policy, and Membership Subscription Disclosure (12-month commitment disclosure).
- [ ] **Supabase Production Environment**: Production database instance provisioned, automated point-in-time recovery (PITR) backups enabled, and RLS policies active.
- [ ] **Controlled Production Test**: One executed controlled $1 test transaction verified end-to-end and refunded.
