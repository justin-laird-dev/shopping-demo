## Context

`lib/products.ts`'s `listProducts({ search, category })` currently runs one `prisma.product.findMany` with no `skip`/`take` and returns every match; `app/page.tsx` reads `q`/`category` from `searchParams` and renders all returned items in a CSS grid. There is no existing pagination, page-size, or count concept anywhere in the app. This depends on nothing from the still-unapplied `expand-synthetic-product-data` or `auto-submit-category-filter` changes, but is motivated by the former (see proposal.md) and should compose cleanly with the latter (both touch `SearchFilterForm`/`app/page.tsx`'s query-param handling, but not the same lines).

## Goals / Non-Goals

**Goals:**
- Bounded, predictable page size regardless of catalog size (works today at 35 products and later at 150-250+).
- Pagination driven by a URL query param (`page`), consistent with the existing `q`/`category` GET-form pattern — no client-side data fetching or state.
- Correct behavior at the boundaries: first page, last page, zero results.

**Non-Goals:**
- Infinite scroll or "load more" (a simpler Previous/Next model fits the existing server-rendered GET-form architecture better).
- Numbered page-jump links (e.g. "1 2 3 ... 10") — Previous/Next plus a "Page X of Y" indicator is enough for this catalog size.
- Changing the page size based on viewport/screen size.

## Decisions

- **Page size: 24 products per page.** Divides evenly into the existing 1/2/3-column responsive grid (24 = 8 rows at 3-cols, 12 at 2-cols) and keeps each page's scroll length reasonable at both the current 35-product catalog and the future 150-250-product one. Alternative considered: a larger page size (e.g. 48) — rejected as still a long scroll on mobile (1 column).
- **`listProducts` gains `page`/`pageSize` params and returns both the page's items and a total count** (via a paired `prisma.product.count` with the same `where` clause), so the caller can compute total pages and whether next/previous exist. Alternative considered: cursor-based pagination — rejected as unnecessary complexity; offset-based pagination is simpler and sufficient at this data scale, and matches the existing `orderBy: { name: "asc" }` sort.
- **`page` is a plain query param (`?page=2`), not part of the form's fields.** The search/category `<form>` has no hidden `page` input, so submitting it naturally omits `page` and the listing defaults to page 1 — this is what gives "changing search/category resets to page 1" for free, without extra reset logic. Previous/Next controls are plain links that carry the current `q`/`category` forward plus an incremented/decremented `page`.
- **Out-of-range page numbers clamp rather than error**: a `page` beyond the last page (e.g. after the result set shrinks from a new search) is treated as the last valid page rather than showing an empty page or a 404, so a stale bookmarked/back-navigated URL still shows something sensible.

## Risks / Trade-offs

- [Offset pagination can show slight duplicate/skipped items if data changes between page loads] → Accepted; this is static seeded demo data, not a live-writing dataset, so this doesn't occur in practice.
- [Adding a `count` query per listing request is an extra DB round-trip] → Negligible for a local SQLite demo at this data scale.
