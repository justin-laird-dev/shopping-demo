## Why

Right now the category dropdown requires clicking a separate "Apply" button before the filter takes effect, even though a `<select>` change is a single, unambiguous action. Auto-submitting on selection removes an unnecessary extra click and matches how category filters typically behave on real e-commerce sites.

## What Changes

- Selecting a category from the dropdown immediately re-filters the product listing, without requiring the "Apply" button.
- The search text input's behavior is unchanged: it still requires submitting the form (Apply button or Enter key), since auto-submitting on every keystroke would be a much bigger change (debounced live search) that wasn't asked for.
- The "Apply" button remains in the UI (it still matters for the search input), but is no longer required for a category change to take effect.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `product-catalog`: the "Category Filtering" requirement's scenario is tightened to specify that selecting a category applies the filter immediately, without a separate submit step.

## Impact

- `components/SearchFilterForm.tsx`: the category `<select>` gains a client-side change handler that submits the form; the input and button remain as-is.
- No changes to `lib/products.ts`, routing, or data — this only changes *when* the existing filter request is triggered, not how filtering works.
