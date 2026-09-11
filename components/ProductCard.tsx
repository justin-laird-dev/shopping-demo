import Link from "next/link";
import type { ProductSummary } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.category}
          width={400}
          height={300}
          className="h-40 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {product.category}
        </span>
        <Link href={`/products/${product.id}`} className="font-medium text-text hover:underline">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-text">
            {formatPrice(product.price)}{" "}
            <span className="font-normal text-text-muted">/ {product.unit}</span>
          </span>
        </div>
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
  );
}
