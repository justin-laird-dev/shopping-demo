## Context

See proposal.md for the two gaps found and reproduced via a fresh clone. `prisma7.config.ts` reads `datasource.url` from `process.env["DATABASE_URL"]` with no fallback; `lib/db.ts` separately falls back to `"file:./dev.db"` for the running app. These are two different code paths with different defaulting behavior, which is why the app can look like it needs no configuration while the Prisma CLI actually does.

## Goals / Non-Goals

**Goals:**
- A plain `npm install` followed by the documented `.env` step is enough to run every documented command with no other manual steps.
- The README accurately reflects what's actually required, verified by reproduction (not just written from memory).

**Non-Goals:**
- Changing `prisma7.config.ts` to add its own fallback default — leaving `DATABASE_URL` as an explicit, required piece of configuration for the Prisma CLI is more transparent than papering over it with a second hardcoded default that could silently diverge from `lib/db.ts`'s.
- Committing a real `.env` file — `.env.example` is the standard pattern; `.env` itself stays gitignored.

## Decisions

- **`postinstall` script runs `prisma generate`.** This is the standard Prisma pattern for this exact problem (generated client is gitignored, must exist before any code importing it can run). Alternative considered: only document the manual step — rejected since automating it removes an entire class of "it works on my machine because I generated it once" confusion, and matches what most Prisma-based project templates do by default.
- **`.env.example` with `DATABASE_URL="file:./dev.db"` committed to the repo.** Copying a file (`cp .env.example .env`) is less error-prone than transcribing a value from prose, and makes the required variable and its expected format self-evident.
- **Don't add a fallback default inside `prisma7.config.ts` itself.** Two independent defaults (one in the Prisma config, one in `lib/db.ts`) for the same value is a maintenance hazard if they ever need to diverge (e.g. a real Postgres URL for CLI-driven migrations vs. a different runtime path). Requiring the `.env` file keeps there being exactly one source of truth.

## Risks / Trade-offs

- [A `postinstall` script adds a small amount of time to every `npm install`] → Accepted; `prisma generate` is fast and was already a required step, just an undocumented manual one.
