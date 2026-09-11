## 1. Source Candidate Photos

- [ ] 1.1 For each of the 8 categories, identify a candidate photo from Unsplash or Pexels under a no-attribution-required commercial license, and present the specific image URLs/sources to the user for approval before downloading anything
- [ ] 1.2 Get explicit user approval for the specific files to download (per Claude's file-download safety rules) and verify the approved list covers all 8 categories

## 2. Replace Placeholder Assets

- [ ] 2.1 Download the approved images into `public/categories/`, cropped/selected to a 4:3 aspect ratio, and verify each file opens correctly and matches its category
- [ ] 2.2 Update the `categoryImage` map in `prisma/seed.ts` to point at the new files (updated extensions/paths) and verify `npx prisma db seed` still runs without error
- [ ] 2.3 Remove the now-unused SVG placeholder files from `public/categories/` and verify no remaining code references them

## 3. Verify

- [ ] 3.1 Load the listing page, a product detail page, and the cart page with items from each category, and verify the new photos render correctly at existing card/detail sizes with no layout shift
- [ ] 3.2 Confirm `openspec validate real-category-placeholder-photos --strict` passes
