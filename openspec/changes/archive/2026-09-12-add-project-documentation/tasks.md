## 1. Setup & Running

- [x] 1.1 Write a project overview section (what the app is, tech stack: Next.js 16 App Router, Prisma 7 + SQLite, Tailwind v4) and a table of contents
- [x] 1.2 Write prerequisites (Node version, npm) and installation steps (`npm install`)
- [x] 1.3 Document environment variables (`DATABASE_URL`, optional, defaults to `file:./dev.db`) and note `.env` is gitignored
- [x] 1.4 Document running the dev server (`npm run dev`), building (`npm run build`), and starting production (`npm run start`)
- [x] 1.5 Document database setup: running migrations (`npx prisma migrate dev`) and seeding (`npx prisma db seed`, noting the `npx tsx prisma/seed.ts` workaround — see Troubleshooting)

## 2. Architecture & Extending

- [x] 2.1 Write an architecture section covering the App Router page structure (`app/page.tsx`, `app/products/[id]/page.tsx`, `app/cart/page.tsx`), the `lib/` data layer (`products.ts`, `format.ts`, `db.ts`), `components/` (cart state via `CartContext` + `localStorage`), and the Prisma schema/seed
- [x] 2.2 Write a short section on the theming system (design tokens in `app/globals.css`, Tailwind v4 `@theme inline`)
- [x] 2.3 Write task-shaped "how to extend" guidance: adding a page/component, adding a `Product` field (migration + seed update), adding more seed products, and using the OpenSpec workflow already in place (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`) for future changes
- [x] 2.4 Write a "Running Tests" section describing `npm test` and `npm run test:coverage` (per `add-unit-test-coverage`)

## 3. Troubleshooting & Verify

- [x] 3.1 Document the `better-sqlite3` native-module ABI mismatch symptom (`ERR_DLOPEN_FAILED` / `NODE_MODULE_VERSION` mismatch) and its fix (`npm rebuild better-sqlite3`)
- [x] 3.2 Document the `prisma db seed` CLI crash (`ERR_REQUIRE_ESM` from `@prisma/dev`/`zeptomatch`) and its workaround (`npx tsx prisma/seed.ts`)
- [x] 3.3 Follow every command documented (install, migrate, seed, dev, build, lint, and — once `add-unit-test-coverage` is applied — test/test:coverage) in a clean shell and verify each one works exactly as written
- [x] 3.4 Confirm `openspec validate add-project-documentation --strict` passes
