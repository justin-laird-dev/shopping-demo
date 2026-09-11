## Purpose

Lets shoppers browse, search, filter, and view details of a synthetic catalog of grocery products, giving the demo realistic-feeling content to shop from.

## ADDED Requirements

### Requirement: Product Listing
The system SHALL display a listing of all available grocery products, showing at minimum each product's name, category, price, and unit (e.g. "per lb", "each").

#### Scenario: Viewing the product listing
- **WHEN** a visitor opens the home/listing page
- **THEN** the system displays the seeded grocery products with name, category, price, and unit

### Requirement: Product Search
The system SHALL allow visitors to search products by name or keyword and display only matching products.

#### Scenario: Searching by product name
- **WHEN** a visitor enters a search term that matches one or more product names
- **THEN** the system displays only the products whose name matches the search term

#### Scenario: Searching with no matches
- **WHEN** a visitor enters a search term that matches no product
- **THEN** the system displays an empty result set with an indication that no products were found

### Requirement: Category Filtering
The system SHALL allow visitors to filter the product listing by category.

#### Scenario: Filtering by a single category
- **WHEN** a visitor selects a category filter
- **THEN** the system displays only products belonging to that category

### Requirement: Product Detail View
The system SHALL provide a detail view for each product showing its name, category, price, unit, description, and image.

#### Scenario: Viewing product details
- **WHEN** a visitor selects a product from the listing
- **THEN** the system displays that product's detail page with its name, category, price, unit, description, and image

### Requirement: Synthetic Product Data
The system SHALL be pre-populated with a seeded set of synthetic grocery products spanning multiple categories, so the catalog is populated without any manual data entry.

#### Scenario: First run after seeding
- **WHEN** the application database has been seeded
- **THEN** the product listing shows more than one grocery category with multiple products in each
