# Fresh Cart Grocery

A synthetic grocery shopping demo: browse a seeded product catalog, search and filter by category, add items to a cart, and check out (no real payment is processed). Built with **Next.js 16** (App Router, Turbopack), **Prisma 7** over **SQLite**, and **Tailwind CSS v4**.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Database Setup](#database-setup)
- [Running Tests](#running-tests)
- [Project Architecture](#project-architecture)
- [Theming](#theming)
- [Extending the App](#extending-the-app)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js (latest LTS recommended)** and npm. This project doesn't hard-require a specific version, but the Prisma CLI (used for migrations, seeding, and client generation) needs **Node 20.19+, 22.12+, or 24.0+** to run at all — on an older Node, install still succeeds but a few steps need a documented manual workaround (see [Troubleshooting](#troubleshooting)). A `.nvmrc` is included if you use `nvm` (`nvm use`).

## Installation

```bash
npm install
```

This also runs `prisma generate` automatically (via a `postinstall` script) to produce the Prisma Client. On an unsupported Node version this step fails loudly but harmlessly — `node_modules` is still installed correctly, you just need to re-run `npx prisma generate` once you're on a supported Node version (see [Troubleshooting](#troubleshooting)).

## Environment Variables

- `DATABASE_URL` — **required for the Prisma CLI** (`migrate`, `db seed`, etc. — see [Database Setup](#database-setup)); the running app itself falls back to `file:./dev.db` if unset, but the CLI does not.

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

`.env` itself is gitignored.

## Running the App

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

The dev server prints the local URL it's listening on (defaults to port 3000, or the next free port).

## Database Setup

The schema is at `prisma/schema.prisma` (a single `Product` model). Migrations live in `prisma/migrations/`.

```bash
npx prisma migrate dev   # apply migrations, creating dev.db if it doesn't exist
npx prisma db seed       # populate the catalog with synthetic products (prisma/seed.ts)
```

If either command crashes with `ERR_REQUIRE_ESM`, see [Troubleshooting](#troubleshooting) — it's a known Node-version issue with a straightforward fix.

Seeding is idempotent: it clears and re-inserts the full product list, so it's safe to re-run any time you want to reset the catalog to its seeded state.

## Running Tests

```bash
npm test              # run the unit test suite once
npm run test:coverage # run with a coverage report
```

Tests cover the data layer (`lib/`) and all interactive client components (`components/`), with 100% statement/branch/function/line coverage enforced on that scope. Full-page Server Components (`app/**/page.tsx`) are intentionally out of unit-test scope — they're thin compositions over the already-tested data layer, verified instead by running the app.

## Project Architecture

- **`app/`** — Next.js App Router pages:
  - `app/page.tsx` — product listing (search, category filter, pagination)
  - `app/products/[id]/page.tsx` — product detail page
  - `app/cart/page.tsx` — cart view (quantities, totals, checkout)
  - `app/layout.tsx` / `app/globals.css` — root layout and design tokens
- **`lib/`** — the data layer:
  - `lib/db.ts` — the Prisma client singleton (SQLite via `@prisma/adapter-better-sqlite3`)
  - `lib/products.ts` — product queries: search, category filtering, pagination
  - `lib/format.ts` — display formatting (currency)
- **`components/`** — UI, including:
  - `CartContext.tsx` — cart state (add/update/remove/clear, totals), persisted to `localStorage`
  - `Header.tsx`, `ProductCard.tsx`, `SearchFilterForm.tsx`, `Pagination.tsx`, `AddToCartButton.tsx`
- **`prisma/`** — `schema.prisma` (the `Product` model), `migrations/`, and `seed.ts` (synthetic catalog data)
- **`openspec/`** — this project's spec-driven change history (see [Extending the App](#extending-the-app))

## Theming

Design tokens live in `app/globals.css` as CSS custom properties (`--bg`, `--surface`, `--text`, `--accent`, etc.), re-exposed to Tailwind v4 via `@theme inline` so they're usable as ordinary utility classes (`bg-accent`, `text-text-muted`, `border-border`, and so on). There's a single light theme — no dark-mode variant is defined, intentionally (see the git history around the storefront redesign for why).

To adjust the palette, edit the `:root` custom properties in `app/globals.css`; the Tailwind utilities pick up the change automatically.

## Extending the App

This project's changes are planned and tracked with **OpenSpec** (`openspec/` — proposals, specs, and an archive of completed changes). To make a change:

```bash
/opsx:propose <describe what you want to build>
/opsx:apply <change-name>
/opsx:archive <change-name>
```

Common extension points:

- **Add a page or component**: follow the existing patterns in `app/` (Server Components by default) or `components/` (add `"use client"` for anything interactive/stateful).
- **Add a field to `Product`**: edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <description>` to generate a migration, then update `prisma/seed.ts` and `lib/products.ts`'s `toProductDetail` mapping to include the new field.
- **Add more seed products**: extend the `products` array in `prisma/seed.ts`, then re-run `npx prisma db seed`.
- **Add a test**: colocate a `*.test.ts`/`*.test.tsx` file next to the module under test (see existing tests in `lib/` and `components/` for the pattern); mock `@/lib/db` for anything touching Prisma.

## Troubleshooting

**Any `prisma` CLI command (`migrate dev`, `db seed`, `db push`, ...) crashes with `Error [ERR_REQUIRE_ESM]: require() of ES Module .../zeptomatch/dist/index.js ... not supported`**

The Prisma CLI bundles a dependency (`@prisma/dev`, via `zeptomatch`) that's ESM-only. Loading it relies on Node's `require(esm)` support, which is only enabled by default starting in **Node 20.19+ / 22.12+ / 24.0+** — it's not a bug in this project's code, and it isn't fixable by changing this project's dependencies (every available version of `@prisma/dev` has the same issue). If your active Node version is older than that (e.g. an Node 20 patch release below `.19`), *every* `prisma` subcommand fails at startup this way.

Fix: switch to a Node version in that range for the command (e.g. `nvm use 22`), run it, then switch back to your usual Node version if needed:

```bash
nvm use 22          # or any Node satisfying 20.19+ / 22.12+ / 24.0+
npx prisma migrate dev
npx prisma db seed
nvm use 20           # back to whatever you normally use for `npm run dev`
```

Because switching Node versions changes which native binary `better-sqlite3` needs, **rebuild it for whichever Node you're about to use** before running a Prisma command or the app (see the next entry) — this project's `dev.db` is opened by both the Prisma CLI and the running app, so a mismatch here surfaces as the next issue below.

If you'd rather not switch Node versions just to seed the database, `prisma db seed` specifically can be bypassed entirely by running the seed script directly (no CLI, no ESM issue):

```bash
npx tsx prisma/seed.ts
```

There's no equivalent bypass for `migrate dev` — applying migrations does need a Node version in the supported range.

**`npm install` reports an error from its `postinstall` script (`prisma generate` failing with `ERR_REQUIRE_ESM`)**

Same root cause as above — `npm install` still completes and `node_modules` is installed correctly (`postinstall` runs after packages are placed), it's only the Prisma Client generation step that didn't run. Fix: switch to a supported Node version (see above) and run `npx prisma generate` once; you don't need to redo the rest of the install.

**`ERR_DLOPEN_FAILED` / a `NODE_MODULE_VERSION` mismatch when running the app, tests, or Prisma commands**

`better-sqlite3` ships a native binary compiled for a specific Node version. If you switch Node versions (e.g. via `nvm`, including as part of the fix above) or reinstall dependencies under a different Node than before, the binary goes stale for whichever Node you're now running. Fix:

```bash
npm rebuild better-sqlite3
```

**`npm install` fails with a Prisma engine error (`Prisma only supports Node.js versions 20.19+, 22.12+, 24.0+`)**

A fresh install (e.g. after deleting `node_modules`) runs Prisma's own installer, which enforces the same Node version floor described above and refuses to proceed on an older Node. Switch to a Node version in that range for the install (see the first entry), then switch back and `npm rebuild better-sqlite3` if needed.
