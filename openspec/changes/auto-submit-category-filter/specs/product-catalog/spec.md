## MODIFIED Requirements

### Requirement: Category Filtering
The system SHALL allow visitors to filter the product listing by category, applying the filter immediately when a category is selected, without requiring a separate submit action.

#### Scenario: Filtering by a single category
- **WHEN** a visitor selects a category filter
- **THEN** the system displays only products belonging to that category

#### Scenario: Selecting a category applies immediately
- **WHEN** a visitor changes the category dropdown's selection
- **THEN** the system re-filters the listing right away, without the visitor needing to click a separate "Apply" control
