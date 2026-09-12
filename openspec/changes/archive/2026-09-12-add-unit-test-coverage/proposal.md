## Why

The project has no test suite at all right now — no test runner installed, no test files, no `npm test` script. Every change so far has been verified manually in the browser, which doesn't scale and leaves regressions to be caught by hand each time. A real unit test suite protects the business logic (product filtering/pagination, cart math, price formatting) and the interactive client components from silent breakage.

## What Changes

- Add a test runner and testing libraries (Vitest + React Testing Library) with a coverage reporter.
- Add `npm test` (and a coverage variant) scripts.
- Write unit tests for all pure/testable logic: `lib/format.ts`, `lib/products.ts` (pagination, search, category filter, clamping), `components/CartContext.tsx` (add/update/remove/totals), and all interactive client components (`AddToCartButton`, `Pagination`, `SearchFilterForm`, `ProductCard`, `Header`).
- Set a coverage threshold enforced by the test runner for the included files (target: 100% statements/branches for the modules above — see design.md for what's explicitly excluded and why).
- **No production code behavior changes**: this only adds tests and test tooling, so it declares no capability deltas (`skip_specs: true`).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — see `skip_specs: true`; adding tests doesn't change any spec-level behavior)

## Impact

- `package.json`: new devDependencies (test runner, testing libraries, coverage tool) and new `test`/`test:coverage` scripts.
- New test config file(s) at the repo root (e.g. `vitest.config.ts`) and a test setup file.
- New `*.test.ts`/`*.test.tsx` files colocated with (or alongside) the modules above.
- No changes to `app/`, `components/`, `lib/`, or `prisma/` production code.
