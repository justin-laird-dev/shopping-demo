## Why

We need a working baseline application to use as a demo and tutorial vehicle. Future demos will layer additional functionality onto this base, so the initial version should be a small, self-contained, easy-to-run grocery shopping site with realistic-looking (but synthetic) product data — nothing more.

## What Changes

- Scaffold a new Next.js (TypeScript) application as a single full-stack app (UI + API routes).
- Add a SQLite database (via Prisma) with a `Product` model and a seed script that populates it with synthetic grocery product data (name, category, price, unit, image placeholder, description).
- Build a product catalog: home/listing page with search and category filtering, and a product detail page.
- Build a shopping cart: add to cart, update quantity, remove item, view running total, and a non-functional "checkout" action (no payment processing, no order persistence).
- No user accounts, authentication, or order history in this version.

## Capabilities

### New Capabilities
- `product-catalog`: Browsing, searching, and filtering synthetic grocery products, and viewing product details.
- `shopping-cart`: Adding products to a cart, adjusting quantities, removing items, viewing the cart total, and a placeholder checkout action.

### Modified Capabilities
(none — greenfield project)

## Impact

- New Next.js application in the project root (or an `app/` subdirectory — decided in design.md).
- New SQLite database file and Prisma schema/migrations, plus a seed script for synthetic product data.
- New dependencies: Next.js, React, Prisma (+ SQLite driver), and standard tooling (TypeScript, ESLint).
- No existing code or systems affected — this is the first capability added to the project.
