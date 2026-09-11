import { listCategories, listProducts } from "@/lib/products";
import { SearchFilterForm } from "@/components/SearchFilterForm";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const pageParam = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [{ items: products, page: currentPage, totalPages }, categories] = await Promise.all([
    listProducts({ search, category, page }),
    listCategories(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold text-text">Shop groceries</h1>
      <SearchFilterForm categories={categories} search={search} category={category} />

      {products.length === 0 ? (
        <p className="text-text-muted">No products found. Try a different search or category.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={currentPage} totalPages={totalPages} search={search} category={category} />
        </>
      )}
    </main>
  );
}
