## 1. Tooling Fix

- [x] 1.1 Add a `postinstall` script to `package.json` that runs `prisma generate`, and verify a fresh `npm install` (no manual `prisma generate` afterward) leaves `app/generated/prisma/` present and usable
- [x] 1.2 Add a committed `.env.example` file with `DATABASE_URL="file:./dev.db"`

## 2. Documentation Fix

- [x] 2.1 Update the README's Environment Variables section: `DATABASE_URL` is required for Prisma CLI commands (not just an optional runtime convenience), and reference copying `.env.example` to `.env`
- [x] 2.2 Update the README's Installation/Database Setup sections to remove the now-unnecessary manual `prisma generate` step and reflect that `npm install` handles it

## 3. Verify

- [x] 3.1 Clone the repo into a fresh directory, follow the README exactly (install → copy `.env.example` → migrate → seed → dev/build/lint/test) with no manual steps beyond what's documented, and confirm every command succeeds
- [x] 3.2 Confirm `openspec validate fix-fresh-clone-setup --strict` passes
