## Context

See proposal.md for motivation. Current placeholders are 400x300 (4:3) SVGs, one per category, listed in `categoryImage` (`prisma/seed.ts`) and rendered via plain `<img>` tags in `ProductCard`, the product detail page, and cart line items — all already handle arbitrary image URLs/formats, so swapping the file format (SVG → JPG/WebP) needs no component changes.

## Goals / Non-Goals

**Goals:**
- Real, license-clear photography per category (Produce, Dairy, Bakery, Pantry, Meat & Seafood, Beverages, Snacks, Frozen).
- Keep the current 4:3 aspect ratio so card/detail layouts need no adjustment.
- Only use sources with licenses that permit commercial reuse without mandatory attribution (CC0-equivalent), since this may be reused in Valtech client demos.

**Non-Goals:**
- Per-product photography (150-250 distinct images) — out of scope; stays per-category as today.
- AI-generated images — not pursued here; no image-generation tool is available in this environment.
- Any change to how images are stored/served (still static files under `public/`).

## Decisions

- **Source: Unsplash or Pexels, CC0/no-attribution license only.** Both offer free, high-quality photography explicitly licensed for commercial use without attribution, which matters for a client-facing demo. Alternative considered: paid stock (Shutterstock/Getty) — rejected, unnecessary cost and licensing complexity for a demo asset.
- **Download requires explicit per-batch user approval.** Fetching each image is a file download, which Claude's safety rules require explicit user go-ahead for (filename, source, size). tasks.md sequences this as: propose specific candidate image URLs/sources first, get approval, then download — not an automatic bulk fetch.
- **Keep file organization identical**: same `public/categories/<slug>.<ext>` layout, same map in `prisma/seed.ts`, just the extension changes (e.g. `.svg` → `.jpg`). No schema/data-shape change.
- **Aspect ratio**: crop/select images at or convertible to 4:3 so existing `object-cover` styling (added in the redesign) continues to frame them consistently without layout changes.

## Risks / Trade-offs

- [Generic per-category stock photos can look repetitive across many product cards in the same category] → Accepted; matches the existing per-category (not per-product) architecture and proposal's stated scope.
- [License terms can change or be misread] → Mitigated by sticking to well-known CC0-style sources (Unsplash License / Pexels License) and recording the source URL for each image for provenance.
- [Network fetch required for images, unlike the fully offline SVG approach] → Acceptable one-time build-time cost; images are static files checked into `public/` after download, not fetched at runtime.
