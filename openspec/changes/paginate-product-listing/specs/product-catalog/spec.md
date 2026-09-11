## MODIFIED Requirements

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
