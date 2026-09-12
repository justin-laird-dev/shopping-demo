## 1. Test Tooling Setup

- [x] 1.1 Add Vitest, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `@vitest/coverage-v8` as devDependencies
- [x] 1.2 Add `vitest.config.mts` (jsdom environment, `@/` path alias matching `tsconfig.json`, coverage provider `v8`, coverage `include`/`exclude` matching design.md's scope) and a test setup file wiring `@testing-library/jest-dom` matchers
- [x] 1.3 Add `test` and `test:coverage` scripts to `package.json` and verify `npm test` runs (even with zero test files) without configuration errors

## 2. Business Logic Tests

- [x] 2.1 Write `lib/format.test.ts` covering `formatPrice` (whole numbers, decimals, zero) and verify it passes
- [x] 2.2 Write `lib/products.test.ts` for `listProducts`/`listCategories`/`getProductById`, mocking `@/lib/db`'s `prisma` client, covering: search matching, category filtering, combined search+category, pagination (`page`/`pageSize`, total pages, out-of-range clamping per `lib/products.ts:` clamp logic), and category listing; verify all pass and cover every branch

## 3. Component Tests

- [x] 3.1 Write `components/CartContext.test.tsx` covering `addItem` (new item, existing item with default and explicit quantity), `updateQuantity` (increase, decrease, drop to zero removes item), `removeItem`, `clearCart`, and `totalItems`/`totalPrice` computation
- [x] 3.2 Write `components/AddToCartButton.test.tsx` covering the quantity stepper (increment, decrement, disabled at 1), calling `addItem` with the selected quantity, the stepper resetting to 1 after add, and the "Added ✓" transient state
- [x] 3.3 Write `components/Pagination.test.tsx` covering: no render when `totalPages <= 1`, Previous/Next link hrefs carrying `q`/`category`, and Previous/Next disabled state at the first/last page
- [x] 3.4 Write `components/SearchFilterForm.test.tsx` covering the category `<select>` auto-submitting on change and the search input NOT auto-submitting on typing
- [x] 3.5 Write `components/ProductCard.test.tsx` and `components/Header.test.tsx` covering their rendered content (name/category/price/unit, cart badge count) and any interactive elements

## 4. Verify

- [x] 4.1 Run `npm run test:coverage` and verify 100% statements/branches/functions/lines for every file in the coverage scope (design.md's included-file list), with no other files silently pulled into or excluded from the report
- [x] 4.2 Run `npx tsc --noEmit` and verify the new test files introduce no type errors
- [x] 4.3 Confirm `openspec validate add-unit-test-coverage --strict` passes
