## Why

`README.md` is still the unmodified `create-next-app` boilerplate — it doesn't mention Prisma, SQLite, seeding, the OpenSpec workflow this project is built with, or any of the environment quirks this project has actually hit (a native-module ABI mismatch, a broken `prisma db seed` CLI path). Anyone new to the repo (including a future AI session) has to rediscover all of that from scratch.

## What Changes

- Replace `README.md`'s boilerplate content with real project documentation: what the app is, prerequisites, install steps, environment variables, running the dev server, seeding/resetting the database, running tests (once `add-unit-test-coverage` is applied), and building for production.
- Add an architecture/extension section (or a linked `docs/` file if `README.md` gets too long) covering: project structure (App Router pages, `lib/` data layer, `components/`, Prisma schema/seed), the theming/design-token system from `app/globals.css`, and how to extend the app (add a page/component, add a product field via migration, add more seed data, work with the OpenSpec change workflow already used throughout this project).
- Document known environment gotchas discovered while building this project: the `better-sqlite3` native module needing `npm rebuild better-sqlite3` after a Node version mismatch, and `npx prisma db seed` failing due to a bundled `@prisma/dev` dependency bug (workaround: `npx tsx prisma/seed.ts` directly).
- **No application code changes**: this is documentation only, so it declares no capability deltas (`skip_specs: true`).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — see `skip_specs: true`; documentation isn't spec-level behavior)

## Impact

- `README.md`: substantially rewritten.
- Possibly a new `docs/` directory (e.g. `docs/architecture.md`, `docs/extending.md`) if the full content doesn't read well as one file — decided in design.md.
- No changes to application code. The "running tests" section references `npm test`/`npm run test:coverage`, which depends on `add-unit-test-coverage` being applied first (or the section is written to still make sense as a to-be-added capability if applied first — see design.md).
