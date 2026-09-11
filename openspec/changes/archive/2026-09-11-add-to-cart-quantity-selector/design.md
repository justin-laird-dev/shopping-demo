## Context

`components/AddToCartButton.tsx` is a client component that calls `useCart().addItem(product)` on click, showing a transient "Added ✓" state. `CartContext.addItem` currently ignores any concept of quantity — it always sets a new item to `quantity: 1` or increments an existing one by exactly 1. It's used identically on both `ProductCard` (listing) and the product detail page.

## Goals / Non-Goals

**Goals:**
- Let a shopper pick a quantity before adding, on both the listing card and detail page, using the same component.
- Keep the change additive and small: one shared stepper UI, one small `addItem` signature change.

**Non-Goals:**
- A quantity input on the cart page itself (already has its own +/- controls; unaffected).
- Per-product maximum quantity limits (e.g. stock caps) — this is a synthetic demo catalog with no inventory concept.

## Decisions

- **`addItem(product, quantity = 1)`**: extend the existing function with an optional second parameter rather than introducing a separate "addItemWithQuantity" function, since the common case (quantity 1, e.g. any future caller that doesn't care) stays a one-argument call.
- **Quantity stepper lives inside `AddToCartButton`**, as local component state (`useState(1)`), not lifted to a parent or the cart context — it's transient input state for the next add action, not part of cart state itself.
- **Minimum 1, no upper bound.** A decrement below 1 is a no-op (button disables at 1) rather than removing the selector or going to 0/negative, since 0 doesn't mean anything before a product is even added.
- **Selector resets to 1 after a successful add**, matching the proposal — reinforces that it's a "how many this time" input, not a running cart quantity display (that's what the cart page is for).

## Risks / Trade-offs

- [Two nearly-identical stepper UIs could drift if duplicated] → Avoided by keeping the stepper inside the shared `AddToCartButton` component itself (already used by both pages), not duplicating markup per page.
