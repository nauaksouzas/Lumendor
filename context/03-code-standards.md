# Code Standards — Lumen D'Or

## Principles
1. **Monetary Values**: Always represented in integer cents (e.g. `$250.00` = `25000`). Never use floating-point numbers for money.
2. **Server-Side Security**: All business logic, discount rules, price checks, entitlement verifications, and role authorizations must occur on the server. Never trust client-supplied totals.
3. **Idempotency**: Webhook events, order confirmations, inventory reservations, and outbox notification jobs must be idempotent.
4. **Physical Restock Separation**: Refunding an order recorded in Stripe must NEVER automatically increase stock levels. Restocking requires an explicit physical confirmation event.
5. **Typescript Strictness**: Strict type checking with `noImplicitAny` and proper error handling.
