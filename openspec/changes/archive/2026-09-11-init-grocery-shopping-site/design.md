## Context

This is a greenfield project (see proposal.md - Why). There is no existing code, architecture, or data to integrate with, so this design is establishing the baseline rather than fitting into constraints.

## Goals / Non-Goals

**Goals:**
- Get a runnable app with almost no setup: `npm install`, seed, `npm run dev`.
- Keep the stack conventional enough that it reads as a normal tutorial project to anyone following along later.
- Keep the data model and cart logic simple enough to extend in future demos without rework.

**Non-Goals:**
- Production concerns: auth, payments, real inventory, scaling, observability.
- Visual polish — functional, reasonably clean UI is enough.
- Real product photography — placeholder images are fine.

## Decisions

**Framework: Next.js (App Router) + TypeScript**
One process serves both the UI and the data API (route handlers), so there's nothing extra to run or deploy. Alternative considered: separate React + Express — rejected because it adds a second process/port and CORS setup for no benefit at this stage.

**Database: SQLite via Prisma**
SQLite is a single file checked into `.gitignore`d local storage — no service to install or run, which matters for a tutorial repo others will clone. Prisma gives a typed schema/migration/seed workflow that's easy to extend when later demos add tables. Alternative considered: Postgres — more production-like, but requires Docker/local install, adding friction to "clone and run." Alternative considered: static JSON file — simplest, but forecloses future demos that need real query/filter/write behavior against a database.

**Styling: Tailwind CSS**
Ships with the standard `create-next-app` setup, avoids hand-rolling CSS files, and keeps the UI code colocated with markup for a tutorial audience.

**Cart state: client-side only, persisted to `localStorage`**
There are no user accounts (see proposal.md), so there's no server-side session to attach a cart to. Cart state lives in a React context and is mirrored to `localStorage` so it survives a page refresh within the same browser. No cart data is persisted server-side or in the database.

**Product images: static placeholder images per category**
No real product photography is available or needed for a demo. Use a small set of static placeholder images (one per category, reused across products in that category) bundled in `public/`, rather than integrating an external image API or licensing real photos.

**Data model (Prisma schema, initial cut):**
```
model Product {
  id          String  @id @default(cuid())
  name        String
  category    String
  price       Decimal
  unit        String   // e.g. "lb", "each", "dozen"
  description String
  imageUrl    String
}
```
Deliberately minimal — no separate `Category` table yet since categories are just a string field. Fine to normalize later if a downstream demo needs it.

## Risks / Trade-offs

- **SQLite file could be committed accidentally** → `.gitignore` the dev database file; seed script recreates it from scratch on demand.
- **`localStorage`-only cart means the cart is lost if the user switches browsers/devices** → acceptable for a demo; documented as a known limitation, not a bug.
- **Placeholder images may look generic** → acceptable trade-off for zero licensing/setup cost; easy to swap later.

## Migration Plan

Not applicable — this is the first change in the project, there is nothing to migrate from and no rollback target other than deleting the scaffolded app.
