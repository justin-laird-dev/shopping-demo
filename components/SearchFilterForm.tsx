"use client";

import { useRef } from "react";

export function SearchFilterForm({
  categories,
  search,
  category,
}: {
  categories: string[];
  search: string;
  category: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      method="get"
      action="/"
      className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="search"
        name="q"
        defaultValue={search}
        placeholder="Search products..."
        className="flex-1 rounded-md border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      <select
        name="category"
        defaultValue={category}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-text focus:border-accent focus:outline-none"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Apply
      </button>
    </form>
  );
}
