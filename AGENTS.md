# AGENTS.md — Instructions for Autonomous Engineers (Jules)

## Core Mandates
- **Single Source of Truth:** Repository documentation in `context/` and `docs/superpowers/specs/` governs product requirements and architecture.
- **Strict Architecture:** Modular monolith pattern under `src/features/<domain>/` and Next.js App Router (`src/app/`).
- **Server Authority:** The browser is never authoritative for price, inventory stock, permissions, discounts, taxes, or shipping rates. All critical calculations execute server-side.
- **Code Quality:** TypeScript strict mode, no `any`, mandatory error handling, zero unused imports.
- **Verification:** Run typecheck, tests, and build after applying changes.

## Commands
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
