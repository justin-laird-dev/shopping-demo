## Why

The catalog currently has 35 hand-written products across 8 categories. That's thin for a demo meant to look like a real grocery site — search and filtering barely have anything to chew on, and the assortment doesn't reflect how a real store repeats brands/sizes/variants within a staple (e.g. multiple milk fat percentages, multiple bread types). More volume and variety make the demo's search, filtering, and browsing feel realistic.

## What Changes

- Expand `prisma/seed.ts` from 35 to roughly 150-250 synthetic products.
- Add variety within existing categories: multiple brands, sizes, and variants of common staples (e.g. 2%/whole/skim milk, several bread types, multiple cuts of the same meat) instead of one item per concept.
- Keep the existing 8 categories (Produce, Dairy, Bakery, Pantry, Meat & Seafood, Beverages, Snacks, Frozen); no new categories are required, but a few more may be added if needed to place new items naturally.
- Reuse the existing per-category placeholder images (`categoryImage` map in `prisma/seed.ts`) — no new per-product images.
- No schema or migration changes: same `Product` model, same field shapes (name, category, price, unit, description, imageUrl).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `product-catalog`: the "Synthetic Product Data" requirement's scenario ("more than one category with multiple products in each") is too weak to describe the intended richer catalog — it will be tightened to require a substantially larger, more varied product set.

## Impact

- `prisma/seed.ts`: the bulk of the change — many more `SeedProduct` entries.
- Re-running `npx prisma db seed` against the existing `dev.db` (seed script should remain idempotent/re-runnable, matching current behavior).
- No changes to `prisma/schema.prisma`, API routes, or UI components — the listing/search/filter/detail pages already read from the database generically and need no code changes to handle more rows.
