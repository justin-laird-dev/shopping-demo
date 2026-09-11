## Why

The category placeholder graphics (currently code-drawn gradient + line-art SVGs from the `professional-storefront-redesign` change) still read as illustrations, not products. A grocery demo looks more convincing with real photography, even if it's generic per-category imagery rather than per-product photos (per-product sourcing is out of scope — see design.md).

## What Changes

- Replace the 8 per-category placeholder SVGs (`public/categories/*.svg`) with real photographs sourced from a royalty-free, license-clear provider (e.g. Unsplash/Pexels, CC0/no-attribution-required licenses only).
- Keep the existing architecture: one image per category, referenced via the `categoryImage` map in `prisma/seed.ts` and the `Product.imageUrl` field — no schema change, no per-product images.
- Downloading each image file requires the user's explicit go-ahead per Claude's safety rules; tasks.md sequences this as an explicit approval step, not an automatic bulk download.
- **No functional or data-shape changes**: same 8 categories, same `imageUrl` field, same rendering code in `ProductCard`, product detail page, and cart line items. This is an asset swap, so it declares no capability deltas (`skip_specs: true`).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — see `skip_specs: true`; the existing "Product Listing" and "Product Detail View" requirements already just require *an* image to be displayed, satisfied regardless of image source)

## Impact

- `public/categories/*.svg` (8 files): replaced with real photo files (likely `.jpg`/`.webp`), same filenames' extensions updated.
- `prisma/seed.ts`: update the `categoryImage` map's file extensions/paths to match the new asset files.
- No changes to components, pages, schema, or seed data structure.
