## Why

A clean-clone verification of `add-project-documentation`'s README found two real gaps: `npx prisma migrate dev` fails without a `.env` file (the README calls `DATABASE_URL` fully optional, but `prisma7.config.ts` has no fallback for it, unlike `lib/db.ts`'s runtime default), and `npx prisma generate` is a required step nowhere mentioned — nothing imports until it's run, since the generated client is gitignored and there's no `postinstall` hook. Both were reproduced end-to-end in a fresh clone.

## What Changes

- Add a `postinstall` script to `package.json` that runs `prisma generate` automatically, so a plain `npm install` leaves the project ready to use (no manual step, no need to document it as one).
- Add a committed `.env.example` file with `DATABASE_URL="file:./dev.db"`, so setup is "copy this file" rather than "write this file from a prose description."
- Update `README.md`'s Environment Variables and Installation sections to reflect reality: a `.env` file with `DATABASE_URL` is required before running any `prisma` CLI command (not just optional convenience), point at `.env.example`, and mention that `npm install` now generates the client automatically.
- **No product behavior changes**: this only fixes setup tooling/docs, so it declares no capability deltas (`skip_specs: true`).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — see `skip_specs: true`; this is setup tooling and documentation, not product behavior)

## Impact

- `package.json`: adds a `postinstall` script.
- New `.env.example` file (not gitignored, unlike `.env`).
- `README.md`: corrects the Environment Variables and Installation sections; the Database Setup section no longer needs a separate manual `prisma generate` step.
- No changes to `app/`, `components/`, `lib/`, or `prisma/schema.prisma`.
