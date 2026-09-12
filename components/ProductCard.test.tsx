import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { CartProvider } from "@/components/CartContext";
import type { ProductSummary } from "@/lib/products";

const product: ProductSummary = {
  id: "prod-1",
  name: "Whole Milk",
  category: "Dairy",
  price: 3.79,
  unit: "gallon",
  imageUrl: "/categories/dairy.svg",
};

const STORAGE_KEY = "grocery-demo-cart";

function renderCard() {
  return render(
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>
  );
}

describe("ProductCard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the product's name, category, price, and unit", () => {
    renderCard();

    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Whole Milk")).toBeInTheDocument();
    expect(screen.getByText("$3.79")).toBeInTheDocument();
    expect(screen.getByText("/ gallon")).toBeInTheDocument();
  });

  it("links the name and image to the product detail page", () => {
    renderCard();

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/products/prod-1");
    });
  });

  it("adds the product to the cart via the embedded Add to Cart button", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByText("Add to cart"));

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toEqual([expect.objectContaining({ id: "prod-1", quantity: 1 })]);
  });
});
