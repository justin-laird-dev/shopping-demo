## Purpose

Lets a shopper upload a photo of a shopping list and turn it into reviewed, cart-ready items instead of manually searching the catalog for each thing on the list.

A fixed set of sample input images with hand-verified expected output lives at `test-fixtures/image-order-intake/` (`manifest.json`), covering the scenarios below concretely — including deliberately ambiguous items, items with no catalog match, and struck-through items. This is the concrete acceptance material for this capability; see `design.md` for how it's used in both manual verification and an automated eval suite.

## ADDED Requirements

### Requirement: Shopping List Image Upload
The system SHALL allow a shopper to upload a single photo of a shopping list for processing, and SHALL accept common photo formats and sizes (including a phone-camera photo in its original format and resolution) without requiring the shopper to pre-convert or pre-resize it.

#### Scenario: Uploading a valid shopping list photo
- **WHEN** a shopper uploads a photo containing a handwritten or typed shopping list
- **THEN** the system accepts the upload and begins processing it

#### Scenario: Uploading a non-image file
- **WHEN** a shopper attempts to upload a file that is not a recognizable image
- **THEN** the system rejects the upload and tells the shopper it could not be processed as an image

#### Scenario: Uploading without leaving the current page
- **WHEN** a shopper starts this feature from anywhere in the app
- **THEN** the system presents the upload flow in place (e.g. as a dialog), without navigating the shopper to a different page

#### Scenario: Feedback while processing
- **WHEN** a shopper has submitted an image and processing is underway
- **THEN** the system indicates that processing is happening, distinguishing between reading the list and matching it to products, rather than showing a single undifferentiated wait

### Requirement: Line Item Extraction
The system SHALL extract a candidate list of line items and their quantities from an uploaded shopping list image, reflecting the shopper's evident current intent rather than a literal transcription of every mark on the page — for example, not extracting an item the shopper has visibly crossed out. Since real shopping lists vary in ways that cannot be fully enumerated in advance (annotations, corrections, shorthand, doodles, and conventions not anticipated here), this SHALL rely on general interpretation of the image rather than a fixed, hardcoded list of recognized patterns — the same way a person glancing at someone else's list would use judgment rather than a checklist.

#### Scenario: Extracting items from a legible list
- **WHEN** an uploaded image contains a legible list of items with quantities
- **THEN** the system produces a candidate line item, with its quantity, for each entry it could read

#### Scenario: Nothing recognizable in the image
- **WHEN** an uploaded image contains no readable list content (e.g. it is blurry, blank, or unrelated to a shopping list)
- **THEN** the system reports that no items could be found rather than fabricating line items or silently doing nothing

#### Scenario: Struck-through items are not extracted
- **WHEN** an item on the list is visibly crossed out or struck through
- **THEN** the system does not produce a line item for it, treating it the same as if it were absent from the list

This is one concrete, testable example of the general interpretation principle above, not an exhaustive list of every convention the system must recognize — other unanticipated conventions are expected to be handled the same way, by interpretation rather than by a matching hardcoded rule.

### Requirement: Catalog Matching
The system SHALL attempt to match each extracted line item to a product in the existing catalog, and SHALL explicitly mark a line item as unmatched when no product in the catalog reasonably corresponds to it, rather than guessing a match.

#### Scenario: Line item matches a catalog product
- **WHEN** an extracted line item corresponds to a product that exists in the catalog
- **THEN** the system proposes that product as the match for the line item

#### Scenario: Line item has no reasonable match
- **WHEN** an extracted line item does not correspond to any product in the catalog
- **THEN** the system marks the line item as unmatched instead of proposing an incorrect product

### Requirement: Review Before Adding to Cart
The system SHALL present every extracted line item to the shopper, before anything is added to the cart, as a table of rows — a "pre-cart" — each showing the extracted item and quantity alongside its proposed match (or unmatched status). The shopper judges match accuracy themselves by comparing the two; the system does not report a separate confidence score. The shopper SHALL be able to adjust the quantity, change or clear the proposed match, or exclude the row entirely, for any row, before accepting.

#### Scenario: Reviewing proposed matches
- **WHEN** the system finishes processing an uploaded image
- **THEN** the shopper sees a pre-cart table with each extracted line item alongside its proposed match (or unmatched status) and quantity, without any of it yet being in the cart

#### Scenario: Adjusting a quantity before accepting
- **WHEN** a shopper changes the quantity shown for a line item during review
- **THEN** the system uses the adjusted quantity if that line item is later accepted

#### Scenario: Changing a proposed match
- **WHEN** a shopper selects a different product for a line item during review
- **THEN** the system uses the shopper's chosen product instead of its own proposed match if that line item is later accepted

#### Scenario: Excluding a line item
- **WHEN** a shopper excludes a line item during review
- **THEN** that line item is not added to the cart when the shopper accepts the rest

#### Scenario: Accepting all reviewed items at once
- **WHEN** a shopper selects the action to accept the pre-cart
- **THEN** every non-excluded, matched line item is added to the cart at once, with its reviewed quantity

### Requirement: No Unconfirmed Cart Changes
The system SHALL NOT add any item to the cart as a result of uploading or processing an image; the cart is only changed by an explicit shopper confirmation.

#### Scenario: Uploading an image alone does not change the cart
- **WHEN** a shopper uploads an image and the system extracts and matches line items
- **THEN** the cart is unchanged until the shopper explicitly confirms
