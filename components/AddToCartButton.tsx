"use client";

import { useState } from "react";
import { useCart, type AddableProduct } from "@/components/CartContext";

export function AddToCartButton({ product }: { product: AddableProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          className="h-9 w-9 rounded-md border border-border text-sm text-text hover:bg-muted disabled:opacity-40"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-text">{quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => q + 1)}
          className="h-9 w-9 rounded-md border border-border text-sm text-text hover:bg-muted"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          addItem(product, quantity);
          setJustAdded(true);
          setQuantity(1);
          setTimeout(() => setJustAdded(false), 1200);
        }}
        className="flex-1 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        {justAdded ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
