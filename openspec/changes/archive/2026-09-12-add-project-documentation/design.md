## Context

See proposal.md for motivation. Current `README.md` is unmodified `create-next-app` output. The project is Next.js 16 (App Router, Turbopack) + Prisma 7 (SQLite via `@prisma/adapter-better-sqlite3`) + Tailwind v4, with an OpenSpec-driven change workflow already in active use (`openspec/config.yaml`, `openspec/changes/`, `openspec/specs/`). Two real environment issues were hit and worked around earlier in this project's history: a `better-sqlite3` native-module ABI mismatch (fixed with `npm rebuild better-sqlite3`) and a broken `prisma db seed` CLI path (worked around with `npx tsx prisma/seed.ts`) caused by the non-standard `prisma7.config.ts` filename plus a bug in the bundled `@prisma/dev` package.

## Goals / Non-Goals

**Goals:**
- A newcomer (human or AI agent) can install, configure, run, seed, and test the app from `README.md` alone.
- The known environment gotchas are documented so they aren't rediscovered the hard way again.
- Enough architecture context that someone can confidently add a page, a component, a product field, or a new OpenSpec change without reverse-engineering the whole codebase.

**Non-Goals:**
- API reference documentation (there is no public API beyond the App Router pages).
- A style guide beyond pointing at the existing token system in `app/globals.css`.
- Deployment/hosting instructions beyond what's already implied by "it's a standard Next.js app" (no specific hosting target has been chosen for this demo).

## Decisions

- **Single `README.md`, no separate `docs/` directory.** The full content (setup, running, testing, architecture, extending, troubleshooting) fits comfortably in one well-sectioned README for a project this size; splitting into multiple files adds navigation overhead without benefit here. Alternative considered: a `docs/` folder — rejected as premature structure for a single-app demo repo.
- **Testing section describes the commands as they will exist once `add-unit-test-coverage` lands**, since both changes were proposed together. If this change is applied first, the section documents `npm test` / `npm run test:coverage` as forward-looking; the verification task (task 3 below) re-checks the commands actually work once both changes are applied, rather than gating this change's own apply order on the other.
- **Document the two known gotchas as an explicit "Troubleshooting" section**, not buried in setup steps, so they're easy to find by someone hitting the same symptom (e.g. searching the README for "ERR_DLOPEN_FAILED" or "prisma db seed").
- **Extension guidance is task-shaped** ("to add a new product field...", "to propose a new change...") rather than a prose architecture essay, so it's directly actionable.

## Risks / Trade-offs

- [README could grow long and hard to scan] → Mitigated with a table of contents at the top and clear `##`/`###` section headers.
- [Testing section may be written before the test suite exists] → Acceptable per the decision above; the content describes the intended, soon-to-exist commands accurately regardless of apply order, and gets verified for real once both changes are in.
