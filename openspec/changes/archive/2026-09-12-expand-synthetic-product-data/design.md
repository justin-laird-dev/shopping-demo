## Context

See proposal.md for motivation. The seed script (`prisma/seed.ts`) is a flat TypeScript array of `SeedProduct` objects fed to `prisma.product.createMany`. No schema change is needed - only the data.

## Goals / Non-Goals

**Goals:**
- Grow the catalog to ~150-250 products with believable within-category variety (multiple sizes/types/brand-style names per staple).
- Keep the seed script simple to read and re-run.

**Non-Goals:**
- Per-product images (still using per-category placeholder SVGs).
- New categories, new fields, or schema changes.
- Real-world pricing accuracy beyond "looks plausible."

## Decisions

- **Fictional brand names, not real trademarks.** Product names will use invented brand-style names (e.g. "Meadow Gold 2% Milk" rather than "Kraft" or "Coca-Cola"). This is a client-facing demo asset; using real trademarks in synthetic seed data risks implying endorsement or a real business relationship. Generic/fictional names avoid that entirely with no downside for the demo's purpose.
- **Variety via explicit distinct entries, not generated combinations.** Each variant (e.g. "Whole Milk", "2% Milk", "Skim Milk") is written as its own explicit array entry rather than programmatically generated from a cross-product of attributes. This keeps names, descriptions, and prices individually readable and editable, at the cost of more repetitive-looking code - acceptable for a one-time seed list.
- **Stay within the existing 8 categories.** Adding depth (more products per category) rather than breadth (more categories) directly addresses the "thin catalog" problem without touching the category filter UI or the `categoryImage` map.

## Risks / Trade-offs

- [Large flat array becomes unwieldy to hand-edit] → Group entries with `// Category` comments (already the existing convention) and keep one product per line.
- [Idempotent reseed (`deleteMany` + `createMany`) means product IDs change on every reseed] → Already true today; no new risk introduced, just noting it's unchanged.
