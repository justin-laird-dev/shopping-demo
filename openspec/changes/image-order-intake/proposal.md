## Why

Shoppers often start from a list they already wrote down or photographed — a handwritten note, a typed reminder — rather than browsing the catalog by hand. Letting them upload that list and have it turned into cart-ready items removes the manual lookup step entirely. This change is also the second deliberate exercise in this project's spec-driven-development experiment: unlike prior changes, this one introduces genuinely non-deterministic behavior (an AI vision call, a fuzzy catalog-matching call), which makes it a meaningfully harder test of how precisely a spec can define a feature before any of it is built.

## What Changes

- Add an image-upload entry point where a shopper submits a photo of a shopping list.
- Add a server-side pipeline (a new in-process Next.js API route) that:
  1. Normalizes the uploaded image (format conversion, downscale to a bounded size, grayscale) before it reaches any model call.
  2. Sends the normalized image to Claude's vision API with a structured-output schema, extracting a list of line items and quantities as literally perceived from the image (no catalog knowledge at this stage).
  3. Matches each extracted line item against the existing product catalog via a second, text-only structured-output call, returning a matched product or an explicit no-match per line — the shopper judges accuracy by comparing the extracted text to the proposed match, not from a system-reported confidence score.
- Add a review step in the UI — a "pre-cart": a table of every extracted item alongside its proposed match and quantity — where the shopper can adjust the quantity, change or clear the matched product, or exclude the line entirely, then accept all at once. This appears as a dialog opened from the existing UI, not a separate page.
- Accepting adds the resulting lines to the cart via the existing add-to-cart mechanism, one line at a time — no new cart primitive is introduced.
- The extraction/matching logic is designed to receive the catalog as plain input data rather than querying the database itself, so this in-process deployment choice does not foreclose extracting it into a standalone service later.

## Capabilities

### New Capabilities
- `image-order-intake`: accept an uploaded shopping-list photo, extract candidate line items via vision, match them against the product catalog, let the shopper review and adjust each proposed match, and add the confirmed lines to the cart.

### Modified Capabilities
(none — this change composes with the existing `shopping-cart` add-to-cart requirement and reads from `product-catalog` without changing either capability's requirements)

## Impact

- New dependencies: an Anthropic API client and LangGraph.js for orchestration, plus an image-processing library for the normalization step — none of these exist in this project today.
- New required environment variable for the Anthropic API key; optional environment variables for LangSmith tracing (opt-in, not required to run the feature).
- New first API route in this project (nothing under `app/api/` exists yet), a new upload/review UI, and a new image-normalization dependency that may itself rely on a native binding (the same class of risk this project has already hit with `better-sqlite3`) — needs empirical verification before being assumed to work across platforms.
- No changes to the Prisma schema, the existing catalog browsing code, or the existing cart code — this is additive.
- Proposed spec-first, with implementation deliberately deferred: see `design.md` for what's being tested by that sequencing.
