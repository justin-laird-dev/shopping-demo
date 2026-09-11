## 1. Project Scaffold

- [x] 1.1 Scaffold a Next.js (App Router, TypeScript) app with Tailwind CSS in the project root and verify `npm run dev` serves the default page
- [x] 1.2 Add Prisma with the SQLite provider and verify `npx prisma init` output and `.gitignore` cover the local database file
- [x] 1.3 Add the `Product` model to `prisma/schema.prisma` (id, name, category, price, unit, description, imageUrl) and verify `npx prisma migrate dev` creates the table without error

## 2. Synthetic Product Data

- [x] 2.1 Add a handful of category placeholder images to `public/` and verify each loads at its static URL
- [x] 2.2 Write a Prisma seed script generating synthetic grocery products across at least 4 categories (e.g. produce, dairy, bakery, pantry) with realistic names, prices, and units, and verify `npx prisma db seed` populates the database
- [x] 2.3 Verify seeded data satisfies the product-catalog spec's "Synthetic Product Data" scenario (multiple categories, multiple products each) by querying the seeded database

## 3. Product Catalog

- [x] 3.1 Implement a data-access function to list products (with optional search term and category filter) and verify it against the seeded data
- [x] 3.2 Build the product listing page rendering seeded products with name, category, price, and unit, and verify it matches the "Product Listing" scenario
- [x] 3.3 Add search input wired to the listing query and verify both the "Searching by product name" and "Searching with no matches" scenarios
- [x] 3.4 Add category filter control wired to the listing query and verify the "Filtering by a single category" scenario
- [x] 3.5 Build the product detail page (name, category, price, unit, description, image) and verify the "Viewing product details" scenario by navigating from the listing

## 4. Shopping Cart

- [x] 4.1 Implement a cart context (add, update quantity, remove, clear) backed by `localStorage` and verify state survives a page refresh
- [x] 4.2 Wire "Add to cart" actions on the listing and detail pages and verify both "Adding a product for the first time" and "Adding a product already in the cart" scenarios
- [x] 4.3 Build the cart page showing items, quantities, unit prices, line totals, and overall total, and verify both the "Viewing a non-empty cart" and "Viewing an empty cart" scenarios
- [x] 4.4 Add quantity update and remove controls on the cart page and verify the "Increasing quantity," "Setting quantity to zero," and "Removing a cart item" scenarios
- [x] 4.5 Add a checkout action that shows a confirmation and clears the cart, and verify the "Triggering checkout" scenario

## 5. Verification

- [x] 5.1 Run through the full flow manually (browse → search/filter → view detail → add to cart → adjust cart → checkout) in a fresh browser session and confirm no console errors
- [x] 5.2 Confirm `openspec validate init-grocery-shopping-site --strict` passes
