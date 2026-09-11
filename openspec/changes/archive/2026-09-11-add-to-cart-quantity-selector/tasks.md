## 1. Cart Logic

- [x] 1.1 Update `addItem` in `components/CartContext.tsx` to accept an optional `quantity` parameter (default 1), adding it to a new line item's quantity or increasing an existing line item's quantity by that amount, and verify existing single-add behavior (quantity 1) is unchanged

## 2. Quantity Selector UI

- [x] 2.1 Add a quantity stepper (min 1, no upper bound) to `components/AddToCartButton.tsx`, local to the component, and wire "Add to cart" to call `addItem(product, quantity)`
- [x] 2.2 Reset the stepper to 1 after a successful add, and verify the "Added ✓" transient state still works alongside it

## 3. Verify

- [x] 3.1 On the product listing, set a quantity greater than 1 and add to cart; verify the cart page shows that quantity for the item
- [x] 3.2 On the product detail page, repeat the same check
- [x] 3.3 Add a product already in the cart with an additional chosen quantity and verify the cart's quantity increases by that amount rather than by 1
- [x] 3.4 Verify the cart page's own +/- quantity controls and remove/checkout flows are unaffected
- [x] 3.5 Confirm `openspec validate add-to-cart-quantity-selector --strict` passes
