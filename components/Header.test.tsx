import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/CartContext";

const STORAGE_KEY = "grocery-demo-cart";

function renderHeader() {
  return render(
    <CartProvider>
      <Header />
    </CartProvider>
  );
}

describe("Header", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the site title linking home", () => {
    renderHeader();

    const homeLink = screen.getByText("🛒 Fresh Cart Grocery");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("links to the cart page", () => {
    renderHeader();

    const cartLink = screen.getByText("Cart").closest("a");
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("shows a cart badge of 0 when the cart is empty", () => {
    renderHeader();

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows the total item count from the cart", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: "a", name: "Milk", price: 3.79, unit: "gallon", imageUrl: "", quantity: 2 },
        { id: "b", name: "Bread", price: 4.99, unit: "each", imageUrl: "", quantity: 1 },
      ])
    );

    renderHeader();

    expect(await screen.findByText("3")).toBeInTheDocument();
  });
});
