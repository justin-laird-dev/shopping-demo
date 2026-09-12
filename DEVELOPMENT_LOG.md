# Development Log — Fresh Cart Grocery

A running narrative of building this project with Claude Code, using an OpenSpec-driven change process for essentially every piece of work — features, bug fixes, tests, and documentation alike. Kept for an eventual presentation on the journey, the problems hit along the way, and an honest assessment of the methodology itself.

## Project Overview

Fresh Cart Grocery is a synthetic grocery shopping demo (Next.js 16 App Router, Prisma 7 over SQLite, Tailwind v4). It exists as a small, self-contained vehicle for exploring a spec-driven, AI-assisted development workflow (OpenSpec) end-to-end: propose a change, implement it task-by-task with verification at each step, archive it into a permanent spec record — repeated for everything from the initial scaffold to a visual redesign to a test suite to this log.

## Timeline

### 1. Project init and initial scaffold
The project began in a completely empty directory. Asked to "initialize this project directory to use openspec," git and OpenSpec were set up first (`@fission-ai/openspec` — the unrelated `openspec` npm package on npm is an abandoned placeholder), confirming each irreversible step (package manager choice, `git init`) with the user before acting.

The user's initial pitch was loose and conversational ("basically Instacart... just a basic tutorial shopping site with synthetic data"). The propose workflow's built-in instruction to surface scope-affecting ambiguity turned that into three concrete recorded decisions before any code existed — Next.js full-stack vs. separate backend, SQLite vs. Postgres vs. flat JSON, and browse+cart-only vs. adding accounts. The user paused the very first tool call to ask what the propose workflow actually does to the filesystem before allowing it to continue — the same "understand before it runs" instinct that later became an explicit standing preference (see the OpenSpec methodology notes below).

Implementation (`init-grocery-shopping-site`, 17 of 18 tasks) surfaced that both Next.js 16 and Prisma 7 were major versions with real breaking changes versus training-era conventions — caught up front by consulting the bundled docs and Prisma skills rather than discovering them as failures later, which is what surfaced the new typed-route-props convention and Prisma 7's mandatory driver-adapter pattern before they became bugs. One self-inflicted mistake occurred and was self-caught: deleting `.agents/` as assumed-unused clutter, without noticing `.claude/skills/prisma-*` were symlinks into it — caught immediately via `ls -la`, recovered by regenerating via `prisma init` in a scratch directory. The one task left undone, a live-browser click-through (5.1), was correctly *not* marked complete on code-review alone — the environment at that point had no real browser access — and was explicitly handed off rather than silently skipped or faked.

### 2. First real bug and finishing the scaffold
The very next task was simply "run and test it" — which immediately surfaced a real bug: `better-sqlite3`'s native binary was compiled for a different Node ABI than the active shell's Node version, crashing every database query. Fixed with `npm rebuild better-sqlite3`. This exact class of problem (Node version drift vs. compiled native bindings) would resurface repeatedly throughout the project.

The `init-grocery-shopping-site` change was then finished — the handed-off live-browser verification task completed for real — and archived, establishing `product-catalog` and `shopping-cart` as the project's first real OpenSpec capability specs.

### 3. Visual redesign
Asked to fix the "dookie" UI, root-caused the actual bug rather than guessing: an *unlayered* `body { background; color }` rule in `globals.css` was beating Tailwind's entire utility layer under `prefers-color-scheme: dark` (CSS cascade layers give unlayered rules priority over layered ones regardless of specificity). Proposed and applied `professional-storefront-redesign`: a deliberate single light theme with design tokens, a real nav header, elevated product cards, and code-drawn gradient+icon category placeholders replacing flat emoji tiles. This was the first change explicitly marked `skip_specs: true` — a purely presentational change with no product-behavior delta.

### 4. Iterative feature requests, each its own OpenSpec change
A batch of unrelated small asks ("quantity picker," "auto-filter category dropdown," "add a lot more data, which may need pagination") were deliberately split into separate changes rather than one bundled change, each proposed, applied, verified in the browser, and archived independently:
- `paginate-product-listing` — bounded page size, Previous/Next controls, reset-to-page-1 on filter change.
- `auto-submit-category-filter` — category `<select>` submits on change instead of requiring a button click.
- `expand-synthetic-product-data` — grew the seed catalog from 35 to 185 products with realistic brand/variant coverage per category. Caught and fixed a real mistake mid-implementation: two of the invented "fictional" brand names (`Meadow Gold`, `Stonefire`) turned out to be real trademarks, replaced before finalizing.
- `add-to-cart-quantity-selector` — a quantity stepper on Add to Cart, resolved from an ambiguous request ("we need quantities for orders, obviously") by asking a clarifying question rather than guessing between two very differently-scoped interpretations (a UI stepper vs. a full persisted-orders feature).

An attempt at real category photography (`real-category-placeholder-photos`) was blocked entirely by the org's browsing policy (Unsplash, Pexels, Pixabay, and Wikimedia Commons were all inaccessible) — correctly treated as a hard external blocker rather than something to route around, and the change was abandoned rather than forced.

### 5. Standing up real infrastructure
Installed and authenticated the GitHub CLI (`gh`), created a private GitHub repository, and pushed. Along the way, fixed an unrelated SSH host-key trust issue for GitHub.

### 6. Test suite and documentation as OpenSpec changes
`add-unit-test-coverage` (Vitest + React Testing Library, 100% coverage on all business logic and interactive components — Server Component pages deliberately out of scope, documented as a boundary rather than a gap) and `add-project-documentation` (rewriting the still-boilerplate README) were both proposed and applied like any feature change. The test-tooling installation alone surfaced a cascade of real, unrelated environment bugs (detailed below) — Vitest 5/`@types/node` conflicts, an npm dependency-resolution bug, Vite 8's default bundler requiring a newer Node than was active, `@vitejs/plugin-react`/Vite version mismatches, `jsdom` 30's Node requirement, and a genuine test-cleanup bug (React Testing Library's automatic `cleanup()` wasn't registered, silently stacking every test's DOM onto the previous one) — each root-caused and fixed rather than worked around superficially.

### 7. The fresh-clone verification saga
Asked directly "is this all up to date and does it actually work from scratch," a real clean-clone test (not just re-reading the README) found the documentation was still wrong in two ways: `DATABASE_URL` wasn't actually optional for the Prisma CLI (only the running app had a fallback default), and `npx prisma generate` was a required, completely undocumented manual step. Both were reproduced end-to-end before being written up, and while investigating, the same CLI startup crash (`ERR_REQUIRE_ESM` from a bundled `@prisma/dev`/`zeptomatch` dependency) turned out to affect *every* Prisma subcommand, not just the one first reported — root-caused to Node's `require(esm)` support only being enabled by default starting in Node 20.19+/22.12+/24.0+. Fixed with a `postinstall` script (auto-generating the Prisma client) and a committed `.env.example`, after the user clarified the actual constraint they cared about: no hard Node-version requirement, just clear documentation and an acceptable manual fallback for anyone on an older Node.

Two more real bugs surfaced purely from the user's own scrutiny during this phase, not from any automated check: `.gitignore`'s `.env*` pattern would have silently excluded the newly-added `.env.example` from being committed at all (fixed with a `!.env.example` exception), and a permission guardrail blocking any tool from reading or writing `.env*` files meant `.env.example` had to be created under a different filename and renamed by the user by hand.

Final verification was done for real: committed, pushed to GitHub, cloned fresh from the actual remote (not a local shortcut), and every documented command — install, env setup, migrate, seed, build, lint, test, dev — run and confirmed working with zero undocumented steps.

### 8. Logging the process itself
Asked to keep this log as a running narrative for an eventual presentation on the project and on OpenSpec itself. The instruction to maintain it was recorded in `CLAUDE.md` (checked into the repo, so any future session picks it up automatically). Asked to make upkeep "as automatic as possible," a `PostToolUse` hook was added (`.claude/settings.json` + `.claude/hooks/dev-log-reminder.sh`) that fires after every `git commit` and injects a reminder to consider logging the milestone — deliberately *not* a hook that writes the log itself, since deciding what's notable is a judgment call, not something a shell script parsing JSON should attempt. Verified end-to-end with a real `git commit --dry-run`, which produced the reminder inline.

A first draft of this log had originally opened with Timeline item 2 (the `better-sqlite3` bug), because the events of item 1 — the project's actual init and first OpenSpec cycle — had only ever been captured as a separate, temporary handoff note rather than lived firsthand. That gap was closed by folding the handoff note's content directly into item 1 and deleting the temporary file once its content was preserved, so the log reads as one sequential narrative from the true beginning rather than one session's account with another's summary awkwardly stitched on front.

Worth noting for the presentation itself: this entry is the log describing its own tooling being built. That's a fairly literal demonstration of the earlier observation that OpenSpec has no natural home for cross-cutting, ambient artifacts — both the hook and the narrative repair above happened entirely outside the propose/apply/archive cycle, as ordinary conversation and file edits, because neither the log's contents nor its own maintenance tooling are really a product "capability" in the OpenSpec sense.

## Problems Encountered (root-cause catalog)

| Problem | Root Cause | Fix |
|---|---|---|
| Custom slash commands didn't appear after `openspec init` | Claude Code loads `.claude/commands/` once at session start, not live | Reload window / start a new session |
| `create-next-app` refused to scaffold into the project root | Existing `package.json`, `node_modules`, `openspec/` flagged as conflicting | Scaffolded into a temp subdirectory, merged files by hand, deleted the temp dir |
| `tsc --noEmit` failed on typed route props | Next.js 16's typed route props are generated by `next dev`/`build`/`typegen`; hadn't been generated yet for the new route | Ran `npx next typegen` before type-checking |
| Prisma client import unresolvable | Prisma 7's `prisma-client` generator has no `index.ts` barrel; the entry point is `client.ts` | Import from the client file explicitly |
| Deleted `.claude/skills/prisma-*` (broken symlinks) | Removed `.agents/` as assumed-unused clutter without checking what symlinked into it | Regenerated via `prisma init` in a scratch dir, copied `.agents/skills` back |
| ESLint error on cart's localStorage-load effect | `react-hooks/set-state-in-effect` flags setState-in-effect generically; this case is the correct SSR-safe hydration pattern | Scoped `eslint-disable` with an explanatory comment, not a blanket suppression |
| `dev.db` created at repo root instead of under `prisma/` | Default datasource URL resolves relative to cwd, not schema location | Extended `.gitignore` to also cover `/dev.db` at root |
| App crashed on every DB query | `better-sqlite3` native binary compiled for a different Node ABI than active | `npm rebuild better-sqlite3` |
| Dark, low-contrast UI regardless of design intent | Unlayered CSS rule in `globals.css` beat Tailwind's entire utility layer (cascade layers > specificity) | Removed the dark-mode media query; committed to one deliberate light theme with proper tokens |
| Vitest 5 install failed | Requires `@types/node ^22`, conflicting with project's `^20` | Pinned Vitest to the 4.x line |
| `npm install` crashed with an internal arborist error | Known npm 10.5.0 bug, unrelated to our dependency choices | `--legacy-peer-deps` |
| A careless `rm -rf node_modules && npm install` let unrelated packages (`prisma`) drift to newer, incompatible versions | Deleting the lockfile lost pinned resolutions | Restored `package-lock.json` from the last commit instead of touching the runtime Node version |
| Vite's default bundler (`rolldown`) crashed at runtime | Uses a Node `util.styleText` signature only available in newer Node, a real incompatibility not just an install-time gate | Pinned `vite@^6` (classic bundler) |
| `@vitejs/plugin-react` crashed loading Vite internals | Latest major targets Vite 7+, incompatible with the pinned Vite 6 | Pinned `@vitejs/plugin-react@^4` |
| Test environment crashed on startup | `jsdom@30` requires Node ≥22.22, unrelated to our code | Pinned `jsdom@^26` |
| Every test after the first one saw a stacked, duplicated DOM | React Testing Library's automatic `afterEach(cleanup)` only auto-registers with Vitest's `globals: true`, which wasn't enabled | Explicit `afterEach(cleanup)` in the shared test setup file |
| Every `prisma` CLI subcommand crashed with `ERR_REQUIRE_ESM` | A bundled dependency (`@prisma/dev` → `zeptomatch`) is ESM-only and needs Node's `require(esm)`, unflagged only from Node 20.19+/22.12+/24.0+ | Documented as a real, unfixable-in-this-repo constraint; run affected commands on a supported Node |
| `DATABASE_URL` "optional" claim was wrong | The Prisma CLI's own config has no fallback default, unlike the app's runtime code | Documented as required for the CLI; added `.env.example` |
| Prisma Client `MODULE_NOT_FOUND` in a fresh clone | Generated client is gitignored; no `postinstall` hook existed | Added `postinstall: "prisma generate"` |
| `.env.example` would have been silently excluded from git | `.gitignore`'s `.env*` pattern matches it too | Added a `!.env.example` exception |

## OpenSpec Methodology — Observations

**Strengths, demonstrated concretely in this project:**
- Forcing a written "Why" before any code exists surfaced real scope questions early — this showed up from the very first proposal: a loose, conversational pitch ("basically Instacart... just a basic tutorial shopping site") became three concrete, recorded decisions (stack, datastore, MVP scope) via one clarifying question before any artifact existed to walk back. The same pattern repeated later — e.g. the "quantities for orders" request was genuinely ambiguous between a small UI tweak and a much larger persisted-orders feature, and the proposal step is exactly where that got clarified instead of silently guessed.
- The proposal → specs/design → tasks dependency graph, driven by `openspec status --json`, gave an unambiguous, resumable checklist across a long, detour-filled initial implementation session (two major dependency-version surprises, one self-inflicted file deletion) — at every point it was clear exactly which tasks were done.
- `design.md` captured real, non-obvious decisions with rejected alternatives on the record — the fictional-brand-name legal-safety call, the pagination page-size choice, the deliberate scope boundary excluding Server Component pages from unit-test coverage, the decision *not* to add a second hardcoded `DATABASE_URL` default to avoid two sources of truth.
- `tasks.md` as a literal checklist with a hard rule ("only mark done once verified") caught real problems before they shipped: two uncovered branches in `CartContext` that the 100%-coverage threshold itself flagged, and a coverage-cleanup bug found only because a test suite was actually run rather than assumed correct.
- The `skip_specs` escape hatch handled documentation, tooling, and test-only changes cleanly, without pressure to invent a fake capability delta just to satisfy the tool.
- Archiving with spec sync kept `openspec/specs/` as a single current-truth document, distinct from the historical record in `openspec/changes/archive/` — three separate changes (`auto-submit-category-filter`, `paginate-product-listing`, `expand-synthetic-product-data`) each modified different requirements within the same `product-catalog` capability, and the sync process merged all three cleanly without clobbering each other.

**Friction / weaknesses observed:**
- The propose/apply skills' default posture is to execute the workflow autonomously (run CLI commands, write files, move through steps without pausing). That collided early on with a user who was actively learning OpenSpec and wanted to understand — and eventually drive — the process rather than watch it happen; a mid-session pause ("what are you doing? are you writing the spec files?") was the first sign of this, and it later became an explicit, durable preference (coach the user through the slash commands rather than run them automatically). Worth designing for from the start next time rather than discovering it mid-workflow.
- Nothing in the `tasks.md` schema distinguishes "verifiable by the agent" from "requires a human/live browser" — a live-browser click-through task was written as an ordinary checkbox item but turned out to be genuinely unverifiable in an environment with no browser tool, and had to be caught and escalated by pausing rather than something the artifact format flagged going in.
- Major-version breaking changes in dependencies (Next.js 16, Prisma 7) aren't something OpenSpec's process surfaces either — those were only caught because the scaffolding tools themselves left warnings (`AGENTS.md`) and bundled skills happened to be available to consult.
- Overhead scales poorly for small changes: even a one-line doc fix goes through the full proposal → design → tasks → apply → archive cycle, with several JSON round-trips through the CLI at each step.
- The methodology describes *intent* well but doesn't replace empirical verification — several of the most damaging bugs in this project (the required `DATABASE_URL`, the missing `prisma generate` step, the `.gitignore` exclusion) were only found by actually cloning the repo and running the documented commands, not by anything in the spec-writing process itself.
- No natural home within OpenSpec for cross-cutting, ambient artifacts like this log, or for environment bugs that don't belong to any single change — they had to be folded into whichever change's `design.md` happened to be open at the time.
- Keeping multiple changes' delta specs mutually consistent when they touch the same capability requires the person (or agent) doing the archiving to actually diff against the current main spec each time, rather than something the tooling guarantees automatically.

## Change History

| Date | Change | Notes |
|---|---|---|
| 2026-09-11 | *(repo init)* | `git init`, OpenSpec scaffolding, initial commit — prior session |
| 2026-09-11 | `init-grocery-shopping-site` | Proposed and implemented (17/18 tasks) in the prior session; live-browser verification task handed off and completed, then archived, in this project's main session |
| 2026-09-11 | `professional-storefront-redesign` | Light theme, design tokens, real header/cards; `skip_specs` |
| 2026-09-12 | `auto-submit-category-filter` | Category select auto-submits |
| 2026-09-12 | `paginate-product-listing` | Previous/Next pagination |
| 2026-09-12 | `expand-synthetic-product-data` | 35 → 185 seeded products |
| 2026-09-11 | `add-to-cart-quantity-selector` | Quantity stepper on Add to Cart |
| *(abandoned)* | `real-category-placeholder-photos` | Blocked by org browsing policy; dropped |
| 2026-09-12 | `add-unit-test-coverage` | Vitest + RTL, 100% coverage on business logic/components; `skip_specs` |
| 2026-09-12 | `add-project-documentation` | Real README (setup/run/test/architecture/extend/troubleshoot); `skip_specs` |
| 2026-09-12 | `fix-fresh-clone-setup` | `postinstall` hook, `.env.example`, corrected docs from real clean-clone verification; `skip_specs` |
