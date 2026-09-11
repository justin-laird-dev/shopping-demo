## Context

See proposal.md for motivation and root cause (the dark-mode CSS override). Current stack: Next.js App Router, Tailwind CSS v4 (via `@theme inline` tokens in `app/globals.css`), Geist Sans/Mono fonts already loaded in `app/layout.tsx`. Product "images" are per-category placeholder SVGs (`public/categories/*.svg`) referenced by `categoryImage` in `prisma/seed.ts` — there is no real product photography, and none will be fetched or generated as raster images; any placeholder redesign has to be code-drawn (SVG/CSS).

## Goals / Non-Goals

**Goals:**
- One deliberate light theme, no reliance on OS color-scheme.
- A small, consistent design system (tokens for color/spacing/type/radius/shadow) defined once in `globals.css`/Tailwind theme and reused, not one-off styling per component.
- A storefront look reminiscent of real grocery e-commerce (e.g. Instacart/Whole Foods-style): clean white surfaces, a single confident accent color, generous whitespace, subtle elevation on cards, a real nav bar.
- Nicer per-category placeholder graphic than a flat emoji tile, still 100% synthetic/code-drawn.

**Non-Goals:**
- Real product photography or AI-generated images.
- Dark mode as a supported, chosen theme (may revisit later; out of scope now).
- Any change to data, routes, or interaction behavior (see proposal's "no functional changes").
- A component library migration (stay on Tailwind utility classes).

## Decisions

- **Design tokens in `globals.css` via `@theme inline`, one light theme only.** Delete the `@media (prefers-color-scheme: dark)` block entirely and stop setting `background`/`color` on the bare `body` selector (that unlayered rule is what currently beats Tailwind's utility layer). Define explicit tokens instead: `--color-bg` (white), `--color-surface` (white), `--color-muted` (warm gray, e.g. `#f6f5f2`), `--color-border` (neutral gray), `--color-text` (near-black, e.g. `#1a1a1a`), `--color-text-muted` (mid gray), `--color-accent` (deep green, e.g. `#1f6f43`) and `--color-accent-hover`. Alternative considered: keep both themes and fix only specificity (wrap the dark rule in `@layer base`) — rejected because a demo storefront should look identical for every viewer, not vary with OS setting.
- **Accent color: deep green**, reusing the existing cart/"Add to cart"/checkout green already in the codebase (`green-600`/`green-700`) as the system's single accent rather than introducing a new brand color, so cart affordances stay visually consistent with the rest of the UI.
- **Typography scale**: keep Geist Sans (already loaded), define 4 sizes via Tailwind classes used consistently: page title (`text-3xl font-semibold`), section/product name (`text-lg font-semibold`), body (`text-sm`), and meta/label (`text-xs uppercase tracking-wide text-muted`). Applied uniformly across listing, detail, and cart instead of each page picking ad hoc sizes.
- **Elevation**: cards get `shadow-sm` at rest and `shadow-md` + slight `-translate-y-0.5` on hover (product cards only), with `rounded-xl` instead of `rounded-lg`, to read as tappable/professional rather than flat boxes.
- **Header redesign**: sticky top nav, white surface, subtle bottom border/shadow; logo/wordmark on the left, cart button on the right styled as a filled pill with the existing green accent and item count badge (behavior unchanged, just restyled).
- **Placeholder image redesign**: replace the flat single-color-plus-emoji SVGs with a nicer code-drawn placeholder — soft two-stop gradient background (per category, using the accent/muted palette rather than arbitrary pastels) plus a simple line-art icon, at a larger consistent size/aspect ratio (4:3) so cards line up cleanly. Still SVG, still per-category (not per-product), so no seed/schema changes. Alternative considered: source stock photography — rejected, out of scope for a code change and adds licensing/asset-management concerns for a demo.
- **Cart page as a two-column summary on wider screens** (items list + a sticky order-summary panel with total and checkout button), collapsing to a single column on mobile — mirrors real checkout/cart patterns instead of a single stacked list with the total below it.

## Risks / Trade-offs

- [Removing the dark-mode media query changes look for anyone whose OS is in dark mode] → Intentional per Goals; a demo should present one consistent brand look regardless of viewer's OS setting.
- [Hand-drawn SVG placeholders still won't look like real product photos] → Accepted; goal is "professional demo," not photorealism, and no real images are available to use.
- [Broad component restyle touches every page] → Mitigated by centralizing tokens so most changes are class-name swaps, not structural rewrites; tasks.md sequences this file-by-file.
