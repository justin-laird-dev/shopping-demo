## Context

`components/SearchFilterForm.tsx` is currently a server component: a plain `<form method="get" action="/">` with a search input, a category `<select>`, and a submit button — no client-side JavaScript. Adding an `onChange` handler to auto-submit requires client-side interactivity.

## Goals / Non-Goals

**Goals:**
- Category selection triggers navigation/filtering immediately, via the same GET query-string mechanism already in place (`?q=...&category=...`), so `app/page.tsx`'s server-side data fetching is untouched.

**Non-Goals:**
- Live/debounced search-as-you-type on the text input.
- Any client-side state management for filters (still fully server-driven via URL search params).

## Decisions

- **Convert `SearchFilterForm` to a client component** (`"use client"`) and call the native `form.requestSubmit()` from the select's `onChange`, rather than introducing a router-based filter (e.g. `next/navigation`'s `useRouter().push`). Reason: this is the smallest change that preserves the existing GET-form/query-string architecture (no JS-driven `fetch`/state duplication), and keeps the search input's existing submit behavior identical. Alternative considered: switch the whole form to `useRouter` navigation on every field — rejected as unnecessary scope beyond what was asked (search input behavior should not change).

## Risks / Trade-offs

- [Converting to a client component adds a small JS bundle for this form] → Accepted; the form is tiny and this is the standard, minimal way to add an event handler in the App Router.
