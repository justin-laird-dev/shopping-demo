## Purpose

Lets shoppers collect grocery products they intend to buy, adjust quantities, and see a running total, giving the demo a recognizable shopping-basket flow without real payment processing.

## Requirements

### Requirement: Add Product to Cart
The system SHALL allow a visitor to choose a quantity (minimum 1, defaulting to 1) and add that quantity of a product to their cart in one action, from the product listing or product detail page.

#### Scenario: Adding a product for the first time
- **WHEN** a visitor adds a product that is not yet in their cart with a chosen quantity
- **THEN** the cart contains that product with that quantity

#### Scenario: Adding a product already in the cart
- **WHEN** a visitor adds a product that is already in their cart with a chosen quantity
- **THEN** the system increases that product's quantity in the cart by the chosen amount rather than adding a duplicate line item

#### Scenario: Quantity selector resets after adding
- **WHEN** a visitor adds a product with a quantity greater than 1
- **THEN** the quantity selector returns to 1 afterward, ready for the next add-to-cart action

### Requirement: Update Cart Item Quantity
The system SHALL allow a visitor to change the quantity of a product already in their cart.

#### Scenario: Increasing quantity
- **WHEN** a visitor sets a cart item's quantity to a higher valid number
- **THEN** the cart updates that item's quantity and recalculates the cart total

#### Scenario: Setting quantity to zero
- **WHEN** a visitor sets a cart item's quantity to zero
- **THEN** the system removes that item from the cart

### Requirement: Remove Item from Cart
The system SHALL allow a visitor to remove a product from their cart entirely.

#### Scenario: Removing a cart item
- **WHEN** a visitor removes a product from their cart
- **THEN** the cart no longer contains that product and the cart total is recalculated

### Requirement: View Cart Summary
The system SHALL display the current cart contents with each item's name, quantity, unit price, line total, and the overall cart total.

#### Scenario: Viewing a non-empty cart
- **WHEN** a visitor opens the cart with one or more items in it
- **THEN** the system displays each item's name, quantity, unit price, line total, and the overall total

#### Scenario: Viewing an empty cart
- **WHEN** a visitor opens the cart with no items in it
- **THEN** the system displays an empty-cart state instead of a total

### Requirement: Checkout Placeholder
The system SHALL provide a checkout action that acknowledges the order was placed without processing any payment or persisting an order record.

#### Scenario: Triggering checkout
- **WHEN** a visitor with a non-empty cart selects the checkout action
- **THEN** the system shows a confirmation that the (simulated) order was placed and clears the cart
