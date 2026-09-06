# Code Standards

- **TypeScript:** Strict mode enabled.
- **Styling:** Tailwind CSS v4 + editorial design system tokens in `src/app/globals.css`.
- **Financial Math:** All monetary amounts represented as integer USD cents.
- **Error Handling:** Domain actions return typed result objects (`{ success: true, data } | { success: false, error }`).
- **Testing:** Vitest for domain logic, authorization, inventory ledger, pricing, and webhooks.
