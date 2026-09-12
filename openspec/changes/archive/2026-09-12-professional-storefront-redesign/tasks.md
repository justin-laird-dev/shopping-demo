## 1. Theme Foundation

- [x] 1.1 Remove the `@media (prefers-color-scheme: dark)` block and the unlayered `body { background; color }` rule in `app/globals.css`; replace with the token set from design.md (`--color-bg`, `--color-surface`, `--color-muted`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`) and verify the page renders identically regardless of OS color-scheme setting
- [x] 1.2 Verify no component still relies on ad hoc `text-black/NN` or `border-black/NN` opacity utilities where a token/semantic class should be used instead (grep for `black/` across `app/` and `components/`)

## 2. Placeholder Imagery

- [x] 2.1 Redesign the 8 category placeholder SVGs in `public/categories/` with the gradient + line-art icon treatment from design.md, at a consistent 4:3 aspect ratio, and verify each renders correctly at both card size (listing) and large size (detail page)

## 3. Header & Navigation

- [x] 3.1 Restyle `components/Header.tsx` as a sticky, elevated nav with the new theme tokens and verify the cart badge still reflects `totalItems` correctly

## 4. Product Listing & Cards

- [x] 4.1 Restyle `components/SearchFilterForm.tsx` (input/select/button) with the new tokens and verify search and category filtering still submit and function exactly as before
- [x] 4.2 Restyle `components/ProductCard.tsx` with the new elevation/radius/typography treatment and verify layout holds at 1/2/3-column breakpoints
- [x] 4.3 Restyle `app/page.tsx`'s heading/empty-state copy to match the new type scale and verify the empty-search-result state still renders

## 5. Product Detail Page

- [x] 5.1 Restyle `app/products/[id]/page.tsx` to the new type scale/tokens and verify all fields (name, category, price, unit, description, image, add-to-cart) still render and function

## 6. Cart Page

- [x] 6.1 Restyle `app/cart/page.tsx` as a two-column layout (items list + sticky order-summary panel) on wide screens, collapsing to one column on mobile, and verify item add/quantity/remove/checkout all still function
- [x] 6.2 Restyle `components/AddToCartButton.tsx`'s default/added states with the new accent token and verify the "Added ✓" transient state still works

## 7. Verification

- [x] 7.1 Run through the full flow (browse → search/filter → product detail → add to cart → adjust cart → checkout) in a fresh browser session at both desktop and mobile widths and confirm no console/server errors and no leftover dark-theme artifacts
- [x] 7.2 Confirm `openspec validate professional-storefront-redesign --strict` passes
