## 1. Auto-Submit Category Filter

- [x] 1.1 Convert `components/SearchFilterForm.tsx` to a client component and add an `onChange` handler on the category `<select>` that calls `requestSubmit()` on the form, and verify selecting a category re-filters the listing without clicking Apply
- [x] 1.2 Verify the search text input and "Apply" button are unaffected: typing a search term still requires submitting (Enter or Apply) and does not auto-submit per keystroke

## 2. Verify

- [x] 2.1 Verify combining a search term with a category selection (search first, then change category) still narrows correctly, matching the existing "Filtering by a single category" and "Searching by product name" scenarios together
- [x] 2.2 Confirm `openspec validate auto-submit-category-filter --strict` passes
