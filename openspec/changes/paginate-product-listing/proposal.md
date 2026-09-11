## Why

`listProducts` currently returns every matching row in one query and `app/page.tsx` renders them all in a single grid with no limit. That's fine at 35 products, but the pending `expand-synthetic-product-data` change targets 150-250 products — rendered on one page, that's an extremely long scroll with no way to jump around. The listing needs pagination to stay usable as the catalog grows.

## What Changes

- The product listing page shows a bounded page of results (a fixed page size) instead of every matching product at once.
- Add Previous/Next pagination controls (with current page indicator) below the product grid, wired to a `page` query parameter alongside the existing `q`/`category` parameters.
- Changing the search term or category filter returns to page 1 (the existing GET-form submission naturally drops any stale `page` value, since the form has no hidden page field — see design.md).
- No change to search/filter matching logic itself, or to the product detail/cart pages.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `product-catalog`: the "Product Listing" requirement is extended to require paginated results with navigation controls, instead of an unbounded single-page listing.

## Impact

- `lib/products.ts`: `listProducts` needs to accept a page number and return both the page's items and enough information to know if there's a next/previous page (or a total count).
- `app/page.tsx`: reads a `page` search param, passes it through, and renders pagination controls.
- A new small component (e.g. `components/Pagination.tsx`) for the Previous/Next controls.
- No schema changes; this is a query/rendering change only.
