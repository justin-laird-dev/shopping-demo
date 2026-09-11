import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.category}
          width={400}
          height={300}
          className="w-full rounded-xl border border-border object-cover shadow-sm"
        />
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {product.category}
          </span>
          <h1 className="text-3xl font-semibold text-text">{product.name}</h1>
          <p className="text-lg font-semibold text-text">
            {formatPrice(product.price)}{" "}
            <span className="font-normal text-text-muted">/ {product.unit}</span>
          </p>
          <p className="text-sm text-text-muted">{product.description}</p>
          <div className="mt-4 max-w-xs">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                imageUrl: product.imageUrl,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
