## Purpose

Lets shoppers browse, search, filter, and view details of a synthetic catalog of grocery products, giving the demo realistic-feeling content to shop from.

## Requirements

### Requirement: Product Listing
The system SHALL display a paginated listing of available grocery products, showing at minimum each product's name, category, price, and unit (e.g. "per lb", "each"), with navigation controls to move between pages when there are more products than fit on one page.

#### Scenario: Viewing the product listing
- **WHEN** a visitor opens the home/listing page
- **THEN** the system displays a page of the seeded grocery products with name, category, price, and unit

#### Scenario: Navigating to the next page
- **WHEN** a visitor is viewing a page of results and more products exist beyond the current page
- **THEN** the system provides a control to view the next page, and selecting it shows the next set of products

#### Scenario: No next page available
- **WHEN** a visitor is viewing the last page of results
- **THEN** the system does not offer a "next page" control (or shows it disabled)

#### Scenario: Changing search or category resets to the first page
- **WHEN** a visitor changes the search term or category filter while viewing a page other than the first
- **THEN** the system returns to the first page of the newly filtered results

### Requirement: Product Search
The system SHALL allow visitors to search products by name or keyword and display only matching products.

#### Scenario: Searching by product name
- **WHEN** a visitor enters a search term that matches one or more product names
- **THEN** the system displays only the products whose name matches the search term

#### Scenario: Searching with no matches
- **WHEN** a visitor enters a search term that matches no product
- **THEN** the system displays an empty result set with an indication that no products were found

### Requirement: Category Filtering
The system SHALL allow visitors to filter the product listing by category, applying the filter immediately when a category is selected, without requiring a separate submit action.

#### Scenario: Filtering by a single category
- **WHEN** a visitor selects a category filter
- **THEN** the system displays only products belonging to that category

#### Scenario: Selecting a category applies immediately
- **WHEN** a visitor changes the category dropdown's selection
- **THEN** the system re-filters the listing right away, without the visitor needing to click a separate "Apply" control

### Requirement: Product Detail View
The system SHALL provide a detail view for each product showing its name, category, price, unit, description, and image.

#### Scenario: Viewing product details
- **WHEN** a visitor selects a product from the listing
- **THEN** the system displays that product's detail page with its name, category, price, unit, description, and image

### Requirement: Synthetic Product Data
The system SHALL be pre-populated with a seeded set of synthetic grocery products spanning multiple categories, so the catalog is populated without any manual data entry. The seeded set SHALL contain at least 150 products, SHALL span all 8 existing categories, and SHALL include multiple variants (distinct brand, size, or type) of common staple items within a category rather than a single item per staple concept.

#### Scenario: First run after seeding
- **WHEN** the application database has been seeded
- **THEN** the product listing shows more than one grocery category with multiple products in each

#### Scenario: Realistic variety within a category
- **WHEN** the application database has been seeded
- **THEN** at least one staple item (e.g. milk, bread) appears as multiple distinct products differing by brand, size, or type within the same category
