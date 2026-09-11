"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  function handleCheckout() {
    clearCart();
    setOrderConfirmed(true);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold text-text">Your cart</h1>

      {orderConfirmed && (
        <div className="mb-6 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-accent-hover">
          Order placed! Thanks for shopping with us. (This is a demo — no payment was
          processed.)
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center text-text-muted shadow-sm">
          <p>Your cart is empty.</p>
          <Link href="/" className="mt-3 inline-block font-medium text-accent hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ul className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-text">{item.name}</p>
                  <p className="text-sm text-text-muted">
                    {formatPrice(item.price)} / {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7 rounded border border-border text-sm text-text hover:bg-muted"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm text-text">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 rounded border border-border text-sm text-text hover:bg-muted"
                  >
                    +
                  </button>
                </div>
                <p className="w-20 text-right text-sm font-semibold text-text">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="lg:sticky lg:top-24 lg:col-start-3 lg:row-start-1 lg:h-fit rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-lg font-semibold text-text">Total</span>
              <span className="text-lg font-semibold text-text">{formatPrice(totalPrice)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 w-full rounded-md bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
