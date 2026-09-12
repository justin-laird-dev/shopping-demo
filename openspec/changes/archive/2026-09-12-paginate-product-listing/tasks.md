## 1. Data Layer

- [x] 1.1 Update `listProducts` in `lib/products.ts` to accept `page`/`pageSize` (default page size 24), apply `skip`/`take`, and return both the page's items and a total count (via a paired `prisma.product.count` with the same `where` clause), and verify it against the seeded data at multiple page numbers
- [x] 1.2 Handle an out-of-range `page` value by clamping to the last valid page (or page 1 if there are zero results) and verify with a `page` value beyond the last page

## 2. Listing Page & Controls

- [x] 2.1 Update `app/page.tsx` to read a `page` search param (default 1), pass it to `listProducts`, and verify the correct subset of products renders
- [x] 2.2 Build a `components/Pagination.tsx` showing Previous/Next controls and a "Page X of Y" indicator, carrying the current `q`/`category` query params forward, and verify Previous is hidden/disabled on page 1 and Next is hidden/disabled on the last page
- [x] 2.3 Verify changing the search term or category filter while on a page other than 1 returns to page 1 (matching the "Changing search or category resets to the first page" scenario)

## 3. Verify

- [x] 3.1 With the current ~35-product catalog, verify pagination works correctly (multiple pages, correct counts); re-verify once `expand-synthetic-product-data` is applied and the catalog is much larger
- [x] 3.2 Verify the empty-search-result state (zero matches) still renders correctly with no pagination controls shown
- [x] 3.3 Confirm `openspec validate paginate-product-listing --strict` passes
