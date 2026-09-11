## MODIFIED Requirements

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
