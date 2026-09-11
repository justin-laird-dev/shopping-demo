## Why

Right now "Add to cart" always adds exactly one unit — to buy 3 of something, a shopper has to click it three times (or add once and then adjust the quantity stepper on the cart page). Real grocery sites let you pick a quantity before adding, which is a more natural flow and reduces friction for anyone stocking up on a staple.

## What Changes

- Add a quantity selector (stepper, default 1, minimum 1) next to "Add to cart" on both the product listing cards and the product detail page.
- "Add to cart" adds the selected quantity in one action — if the product is already in the cart, its quantity increases by the selected amount rather than by a fixed 1.
- After adding, the quantity selector resets to 1 (each add-to-cart action is a fresh choice, not a running total).
- No change to the cart page itself: quantity adjustment there (+/-, remove) is unaffected.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `shopping-cart`: the "Add Product to Cart" requirement is extended to support adding a chosen quantity (not just a fixed 1) in a single action.

## Impact

- `components/AddToCartButton.tsx`: gains a quantity stepper alongside the button; passes the chosen quantity to `addItem`.
- `components/CartContext.tsx`: `addItem` accepts an optional quantity (defaulting to 1) and increases an existing line item by that amount instead of always by 1.
- No changes to `app/cart/page.tsx`'s existing quantity controls, to the `Product` schema, or to checkout.
