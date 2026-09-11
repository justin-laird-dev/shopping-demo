## 1. Expand Seed Data

- [x] 1.1 Add fictional-brand variants for existing staples within each of the 8 categories (e.g. multiple milk fat percentages, multiple bread types, multiple cuts/proteins) and verify no real trademarked brand names are used
- [x] 1.2 Add additional distinct products (not just variants) within each category until the total reaches at least 150 entries, keeping prices/units/descriptions plausible and grouped by category with comments matching the existing style
- [x] 1.3 Verify the seed file has no duplicate `name` values and every entry's `category` matches a key in `categoryImage`

## 2. Verify

- [x] 2.1 Run `npx prisma db seed` and verify the console log reports at least 150 products across all 8 categories
- [x] 2.2 Start the dev server, load the home page, and verify the listing renders the expanded catalog with no console/server errors
- [x] 2.3 Search for a staple with multiple variants (e.g. "milk") and verify multiple distinct variant products are returned, satisfying the "Realistic variety within a category" scenario
- [x] 2.4 Confirm `openspec validate expand-synthetic-product-data --strict` passes
