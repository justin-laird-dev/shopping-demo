"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-text">
          🛒 Fresh Cart Grocery
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Cart
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-xs font-semibold text-white">
            {totalItems}
          </span>
        </Link>
      </div>
    </header>
  );
}
