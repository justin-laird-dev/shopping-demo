## Why

The current UI reads as a bare scaffold, not a real storefront: a `prefers-color-scheme: dark` override in `app/globals.css` fights the light-themed components (most of the app is styled for a white/light background), so on a dark-mode system it renders near-black backgrounds with washed-out, low-contrast text. Product "images" are flat colored tiles with a single emoji, and layout/typography are minimal defaults rather than a deliberate design. For a demo meant to look like a professional grocery site, this undermines the pitch.

## What Changes

- Remove the unintentional dark-theme override and commit to a single deliberate light theme (root cause: an un-layered `body { background/color }` rule in `app/globals.css` overrides Tailwind's light-theme utility classes under `prefers-color-scheme: dark`).
- Adopt a concrete visual design system (colors, type scale, spacing, elevation) described in design.md, applied consistently across header, listing, product detail, and cart.
- Redesign the header into a real storefront nav (logo mark, prominent search, cart affordance).
- Redesign product placeholder "images" from a flat emoji-on-color tile to a more polished placeholder graphic (still synthetic/no real photos).
- Polish `ProductCard`, the product detail layout, and the cart page (spacing, card elevation, button/control styling) for visual consistency.
- **No functional or data changes**: search, filtering, add/update/remove cart, and checkout behavior are unchanged. This is presentation-only, so it declares no capability deltas (`skip_specs: true`) — see design.md for the visual direction and tasks.md for the component-by-component work.

## Capabilities

### New Capabilities
(none — presentation-only change, no capability deltas)

### Modified Capabilities
(none — see `skip_specs: true` above; no spec-level behavior changes)

## Impact

- `app/globals.css`: remove the dark-mode override; establish theme tokens.
- `components/Header.tsx`, `components/ProductCard.tsx`, `components/SearchFilterForm.tsx`, `components/AddToCartButton.tsx`: visual restyle only, no prop/behavior changes.
- `app/page.tsx`, `app/products/[id]/page.tsx`, `app/cart/page.tsx`: layout/styling updates only.
- Product placeholder graphics (currently `public/categories/*.svg`, referenced via `categoryImage` in `prisma/seed.ts`): replaced with a more polished placeholder treatment; no change to `Product` data or schema.
- No new dependencies expected (stays within Tailwind CSS v4, already in use).
