## Context

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript project. There is currently no test runner, no test files, and no `test` script in `package.json`. Business logic lives mostly in `lib/products.ts` (Prisma queries with search/category/pagination), `lib/format.ts` (price formatting), and `components/CartContext.tsx` (cart state as a React Context reducer-style hook backed by `localStorage`). The remaining components (`AddToCartButton`, `Pagination`, `SearchFilterForm`, `ProductCard`, `Header`) are client components with real interactive behavior (steppers, auto-submit, link generation). `app/page.tsx`, `app/products/[id]/page.tsx`, and `app/cart/page.tsx` are the route entry points: the first two are async Server Components that call the data layer directly, and `app/cart/page.tsx` is a client component that's mostly a thin composition of `CartContext` + presentation.

## Goals / Non-Goals

**Goals:**
- A real, runnable test suite (`npm test`) with fast feedback, using tooling that fits Next.js 16 + React 19 + Turbopack.
- Full unit coverage of all pure business logic and interactive client component behavior.
- A coverage report and enforced thresholds so regressions in tested files fail CI/local runs, not just get missed.

**Non-Goals:**
- End-to-end/integration testing of full server-rendered pages against a real database (would need a browser or a Next.js test harness — out of scope for "unit" coverage; this project already has manual/browser-driven verification for that).
- Testing `app/layout.tsx` (framework font/metadata wiring, no branching logic) or `prisma/seed.ts` (a one-off data script, not application logic).
- Visual/snapshot testing or accessibility auditing.

## Decisions

- **Test runner: Vitest, not Jest.** Vitest is ESM-native, fast, and has first-class TypeScript/JSX support with minimal config — a better fit for a Turbopack/Next 16 project than Jest, which needs extra transform config to handle the same ESM/TS/JSX combination. Alternative considered: Jest (the historical Next.js default) — rejected as more config overhead for no benefit here, and Next's own docs now document Vitest as a supported option.
- **Component testing: React Testing Library + `@testing-library/user-event`**, run in a `jsdom` environment. Tests interact with components the way a user would (click, type, read rendered text) rather than testing internal implementation details.
- **Scope = pure logic + client components; Server Component pages are out of scope.** `lib/products.ts` and `lib/format.ts` are tested directly (mocking `@/lib/db`'s Prisma client for `products.ts`, since a unit test shouldn't hit a real SQLite file). `CartContext` is tested via a small test component that consumes `useCart()`. `AddToCartButton`, `Pagination`, `SearchFilterForm`, `ProductCard`, and `Header` are tested by rendering them directly with mock props/context. The three `app/**/page.tsx` route files are async Server Components that fetch directly from the database — rendering/unit-testing these meaningfully would require either a real DB or heavy mocking of Next's server rendering, which is integration-test territory, not unit-test territory. This is a deliberate scope boundary, not an oversight.
- **Coverage target: 100% statements/branches/functions/lines for the included files only** (`lib/format.ts`, `lib/products.ts`, `components/CartContext.tsx`, `components/AddToCartButton.tsx`, `components/Pagination.tsx`, `components/SearchFilterForm.tsx`, `components/ProductCard.tsx`, `components/Header.tsx`), with everything else (`app/**`, `lib/db.ts`, `prisma/**`) explicitly excluded from the coverage report via config — not silently uncounted. This makes "100% coverage" a meaningful, checkable number instead of a diluted average across untestable framework glue.
- **Mocking `lib/db.ts`**: tests for `lib/products.ts` mock the exported `prisma` client (via Vitest's `vi.mock`) rather than hitting SQLite, so tests are fast and deterministic and don't depend on seeded data state.

## Risks / Trade-offs

- [Excluding Server Component pages from coverage could hide a regression there] → Accepted; those pages are thin composition over the already-tested `lib/products.ts` functions, and the project's existing manual browser verification (used throughout this project's history) continues to cover them at the integration level.
- [100% coverage thresholds can make a build fail on a single untested line] → Intentional; that's the point of a threshold. If a future change can't reasonably hit it, the scope list in this file is the place to adjust, not a silent skip.
