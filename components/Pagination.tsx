import Link from "next/link";

function pageHref(page: number, search: string, category: string) {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function Pagination({
  page,
  totalPages,
  search,
  category,
}: {
  page: number;
  totalPages: number;
  search: string;
  category: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between border-t border-border pt-6"
    >
      {hasPrevious ? (
        <Link
          href={pageHref(page - 1, search, category)}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-muted"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-muted opacity-50">
          Previous
        </span>
      )}

      <span className="text-sm text-text-muted">
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={pageHref(page + 1, search, category)}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-muted"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-muted opacity-50">
          Next
        </span>
      )}
    </nav>
  );
}
