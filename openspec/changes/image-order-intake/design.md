## Context

See `proposal.md` for motivation and `specs/image-order-intake/spec.md` for the behavior contract. This document exists specifically to pin down the mechanical decisions that conversation-level exploration deliberately left open, since this change is meant to be built from the spec/design/tasks alone, without further clarifying conversation.

Relevant existing state:
- No `app/api/` routes exist yet in this project — this is the first one.
- The cart (`components/CartContext.tsx`) is entirely client-side, persisted to `localStorage`, with no server-side order record. Adding items to it is a client-side action (`addItem(product, quantity)`), not an API call.
- The catalog is a single `Product` table (id, name, category, price, unit, description, imageUrl) with ~185 seeded rows, queried via `lib/products.ts`. Small enough to pass in full to a model call.
- No AI/LLM dependency exists yet in this project's `package.json`.

## Goals / Non-Goals

**Goals:**
- Define the pipeline precisely enough (schemas, node boundaries, error behavior) that implementation requires no further design decisions.
- Keep the extraction/matching logic decoupled from this project's specific database access, so it stays portable even though it's deployed in-process here.

**Non-Goals:**
- No user accounts, order history, or personalization — matching is stateless against the catalog alone.
- No changes to the product schema (no new brand/synonym/tag fields) in this pass.
- No async job queue or streaming (SSE) progress — two ordinary sequential HTTP requests (see the API contract decision) give honest two-stage progress without that infrastructure.
- No multi-image upload in a single request, and no dedicated camera-capture UI component — a standard file input already exposes "take photo" on mobile browsers.
- No retry/fallback across multiple model providers — one bounded retry per phase against the same model (see Decisions), not a resilience framework.

## Decisions

### Runtime and module boundary
Runs in-process as two new Next.js API routes (see the API contract decision below for why two, not one), using LangGraph.js for orchestration. The extraction/matching logic is implemented as a plain module exposing two functions, neither of which imports Prisma or `lib/db`:
- `runExtraction(image: Buffer): Promise<ExtractionResult>`
- `runMatching(items: ExtractedItem[], catalog: CatalogEntry[]): Promise<MatchResult>` — receives the catalog as data, passed in by the caller.

The route handlers are the only pieces that query the catalog (via the existing `lib/products.ts`) and pass it in. This keeps the module trivially unit-testable (pass a fixed catalog array, no DB mocking) and leaves the option to extract it into a standalone service later without rework, without paying for that separation now. Rejected alternative: a separate Python/FastAPI service — rejected because it would add a second language, a second install/runtime story, and (per the current design) would still need this app's catalog data handed to it, gaining no real decoupling benefit over the in-process module boundary above.

### Graph shape
Two small LangGraph.js graphs, matching the two-endpoint split below:
1. **Extraction graph** (two nodes, linear): `normalizeImage` (plain function, no model call: format-convert, downscale, grayscale) → `extractLineItems` (Claude vision call with structured output). Exposed as `runExtraction`.
2. **Matching graph** (one node): `matchToCatalog` (Claude text call, catalog + extracted items in context, structured output). Exposed as `runMatching`. A single-node graph is trivial in terms of control flow, but keeping it as a graph (rather than a bare function) keeps LangSmith tracing uniform across both graphs with no extra instrumentation code.

No branching in either graph in this pass — using LangGraph.js from the start (rather than plain function calls) means a later fallback/retry/file-type branch is a new node/edge rather than a restructure.

### Structured output schemas
Phase 1 (`extractLineItems`) output:
```json
{
  "items": [
    { "raw_text": "1 dozen eggs", "descriptor": "eggs", "quantity_text": "a dozen" }
  ]
}
```
An empty `items` array means nothing recognizable was found (spec: "Nothing recognizable in the image").

Phase 2 (`matchToCatalog`) input is phase 1's `items` plus the full catalog (`id`, `name`, `category`, `unit`); output:
```json
{
  "items": [
    {
      "matched_product_id": "string | null",
      "resolved_quantity": 1
    }
  ]
}
```
`matched_product_id: null` is the explicit unmatched case required by the spec. There is deliberately no confidence field: the shopper judges match accuracy by comparing `raw_text`/`descriptor` to the proposed match name in the pre-cart table, not from a system-reported score — a float confidence would be poorly calibrated coming from the model, and a categorical tier was considered and rejected as unnecessary machinery when the review step already surfaces the same information more directly. `resolved_quantity` is the model's best conversion of the perceived quantity into a count of the matched product (e.g. "a dozen eggs" matched against a "Dozen Eggs" product resolves to `1`; matched against a "6-pack" product would resolve to `2`); it defaults to `1` when `matched_product_id` is `null`.

Phase 2's output array is index-aligned with phase 1's `items` (same length, same order — the model is instructed to preserve this and never add or drop entries). If the returned length doesn't match, the route treats any missing index as `matched_product_id: null` rather than failing the whole request — a defensive fallback for an occasional structured-output slip, not an expected path.

Each endpoint below composes its phase's output into its own response shape; `line_id` (the stringified array index) is assigned once, by the extract endpoint, and threaded through the match endpoint so the client can correlate rows across both calls.

### API contract
Two sequential endpoints, both `POST`, both ordinary synchronous request/response — chosen over a single combined call specifically to give the shopper honest, two-stage progress feedback (per the spec's "Feedback while processing" requirement) without needing streaming (SSE) or a job queue: each phase's latency (roughly single-digit seconds) fits well within a normal HTTP request, so two ordinary requests in sequence is sufficient. Rejected alternative: one combined endpoint with a generic client-side spinner — rejected because the two phases already exist as separate steps internally, so splitting the endpoint to match costs little and gives the shopper real information ("reading your list" vs. "matching to products") instead of a cosmetic wait indicator; it also means the client can show the phase-1 raw items immediately, before matching even finishes.

**`POST /api/image-order-intake/extract`** — `multipart/form-data` with a single `image` file field. Runs `normalizeImage` then `extractLineItems`. Response:
```json
{
  "status": "extracted" | "no_items_found",
  "items": [
    { "line_id": "0", "raw_text": "1 dozen eggs", "descriptor": "eggs", "quantity_text": "a dozen" }
  ]
}
```
`status: "no_items_found"` corresponds to an empty `items` array. Errors: non-image upload → `400`; normalization failure (e.g. an unsupported format after the format-conversion attempt) → `400`; model call fails structured-output validation after its retry, or the provider call errors outright → `502`, each with a message per the "Error taxonomy" below.

**`POST /api/image-order-intake/match`** — JSON body: `{ "items": [...the extract response's items, unmodified...] }` plus the server fetches the current catalog itself (the client never supplies catalog data). Runs `matchToCatalog`. Response:
```json
{
  "items": [
    { "line_id": "0", "raw_text": "1 dozen eggs", "descriptor": "eggs", "quantity": 1, "matched_product_id": "string | null", "matched_product_name": "string | null" }
  ]
}
```
Same `400`/`502` error shape as above for a validation/provider failure; there is no "non-image" case here since this endpoint never receives an image.

**Error taxonomy** (both endpoints): every error response is `{ "error": "<short machine-readable code>", "message": "<shopper-facing text>" }`, so the client can render `message` directly.

Accepting the pre-cart into the cart is **not** a third API endpoint: the cart is entirely client-side (`CartContext`, `localStorage`), so accepting calls the existing `addItem(product, quantity)` once per non-excluded, matched line item, directly from the review UI. No server-side cart or order state is introduced, and no data from this feature is persisted anywhere — the extraction/match result lives only in the browser's UI state until accepted or discarded.

### Modal entry point, not a page route
The feature is triggered by a button on the existing UI (e.g. the header) that opens a dialog/modal in place, rather than navigating to a new route. This satisfies the spec's "Uploading without leaving the current page" requirement. Rejected alternative: a dedicated page (e.g. `app/order-from-image/page.tsx`) — rejected because it would navigate the shopper away from wherever they were (e.g. mid-browse, or with items already in cart) for no benefit; a modal keeps the surrounding page and cart state untouched and visible underneath.

### Pre-cart table, single accept action
The review UI renders as a table — one row per extracted line item, columns for the extracted text/quantity and the proposed match — referred to in these artifacts as the "pre-cart." Each row has its own controls (edit quantity, change/clear match, exclude); a single "Accept All" action commits every non-excluded, matched row to the real cart at once. There is no per-row accept — per-row controls only adjust or remove a row, they don't commit it individually, since the whole point of the pre-cart is one reviewed batch going into the cart together.

### Retry behavior
Each model call (`extractLineItems`, `matchToCatalog`) gets exactly one automatic retry, with the same input, if its output fails structured-output schema validation. If the retry also fails, the request fails with the `502` error above. This is a minimal robustness measure, not a backoff/circuit-breaker strategy — chosen because zero retries would make the feature visibly flaky on an occasional model hiccup, but anything more elaborate is unjustified for this scale.

### Image normalization
Every upload is converted to a single normalized form before either model call: format-converted to JPEG, downscaled so its longest edge is at most 1568px (informed by Anthropic's general vision-input guidance for balancing quality against cost — worth a quick check against current documentation at implementation time, since this is a reasonable default rather than a hard constraint from this project), and converted to grayscale. Grayscale is for file size, bandwidth, and handwriting legibility/contrast — not for reducing model cost, since Claude's vision cost is driven by pixel dimensions rather than color depth; the downscale step is the actual cost lever. Library: `sharp`. Rejected alternative: a pure-JS image library — rejected because HEIC decoding requires a native `libheif` binding regardless of language (confirmed by this project's own prior experience: even the Python service needed `pillow-heif`, not vanilla Pillow), so a pure-JS library would not avoid the native-dependency risk and would still fail to decode HEIC.

### Interpretation over enumeration
`extractLineItems`'s prompt asks the model to report what the shopper currently intends to buy, interpreting the image the way a person would — it does not enumerate a checklist of recognized conventions (strikethroughs, question marks, arrows, circled items, etc.) for the model to pattern-match against. Rejected alternative: hardcoding detection rules for each convention noticed in the fixture set — rejected because the fixture set is a sample, not an exhaustive catalog of every way a real shopper might annotate a list, and a rule list tuned to today's fixtures would not generalize to a genuinely novel one. The spec's "struck-through items are not extracted" requirement is a concrete, testable *example* of this general capability, not the total scope of it — the eval suite checks that example specifically because it happens to be verifiable against the fixture set, not because it's the only case that matters.

### Testing strategy for a model-driven route
This project enforces 100% statement/branch/function/line coverage on business logic and interactive components elsewhere; that discipline continues here, split across two separate, differently-purposed suites:

- **Deterministic unit tests** (Vitest, same as the rest of the project, part of `npm test`/coverage gating, with the model calls mocked at the module boundary): the normalization function (given a fixed test image buffer), the API route's request parsing/validation/error responses, the phase-1/phase-2 output composition and index-alignment defensive handling, and the review/edit UI components (rendering, quantity edit, match change, exclude, confirm — driven by fixed fixture API responses, no real network calls, no real images). These test the code's logic, not the model's judgment, and must stay fast and fully deterministic.
- **An eval suite** (real API calls, real images, genuinely non-deterministic, deliberately **not** part of `npm test` or the coverage gate): run via a separate `npm run test:eval` script. For each entry in `test-fixtures/image-order-intake/manifest.json`, it calls `runExtraction` then `runMatching` in sequence (the same two calls the real endpoints make) and grades the actual output against that entry's hand-verified expected output:
  - `type: "product"` — the line must match exactly the named product.
  - `type: "any_of"` — the line must match one of the named products (used for genuinely ambiguous items, e.g. generic "buns" against three real bun products — the point is a single reasonable match, not a specific one).
  - `type: "no_match"` — the line must come back unmatched (used for items with no catalog equivalent, e.g. "toilet paper", "cat litter", "vitamins").
  - `type: "excluded"` — the line must not appear in the output at all (used for visibly struck-through items in the source image).
  - Grading is per-line, not whole-image pass/fail, and a summary (N/M lines correct per image, overall) is printed rather than a hard exit-code gate — this is a quality signal to read, not a CI blocker, given real model output can vary run to run.
- Ground truth is expressed by product **name** in the manifest, not id (ids are database-generated at seed time); the eval script resolves names to ids against the live seeded catalog at run time.
- The manifest and fixture images are committed with this change specifically so they're fixed across repeated `apply`-from-clean-checkout attempts — varying the test input between attempts would confound spec quality with input or eval difficulty. `tasks.md`'s manual end-to-end check (§10) and the eval suite use the same fixture set for this reason.

## Risks / Trade-offs

- [Risk] `sharp`'s HEIC decoding may not work out of the box on every platform (the same class of native-binding risk this project already hit with `better-sqlite3`) → Mitigation: verify empirically as the first implementation task, before anything else is built on top of it; if unsupported in this environment, reject HEIC uploads with a clear, specific error message rather than assuming success.
- [Risk] Structured output can occasionally fail validation or be substantively wrong (bad extraction, wrong match) → Mitigation: one bounded retry per phase for validation failures; explicit null-match signaling for unmatched items; mandatory shopper review in the pre-cart before any cart change, so a wrong model output never silently reaches the cart.
- [Risk] This route requires a real, billed Anthropic API key → Mitigation: the feature is fully additive; the rest of the app has no dependency on this key, and this route fails with a clear error (not a crash) if the key is missing or invalid.
- [Risk] Eval suite results can vary run to run since they call the real model → Mitigation: eval output is a graded quality signal to read (per-line, per-image breakdown), not a hard pass/fail CI gate; the fixed fixture set and hand-verified expected output keep the *input* constant so any variance in results reflects model behavior, not test flakiness.
