## MODIFIED Requirements

### Requirement: Synthetic Product Data
The system SHALL be pre-populated with a seeded set of synthetic grocery products spanning multiple categories, so the catalog is populated without any manual data entry. The seeded set SHALL contain at least 150 products, SHALL span all 8 existing categories, and SHALL include multiple variants (distinct brand, size, or type) of common staple items within a category rather than a single item per staple concept.

#### Scenario: First run after seeding
- **WHEN** the application database has been seeded
- **THEN** the product listing shows more than one grocery category with multiple products in each

#### Scenario: Realistic variety within a category
- **WHEN** the application database has been seeded
- **THEN** at least one staple item (e.g. milk, bread) appears as multiple distinct products differing by brand, size, or type within the same category
