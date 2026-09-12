import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CartProvider, type AddableProduct } from "@/components/CartContext";

const product: AddableProduct = {
  id: "a",
  name: "Whole Milk",
  price: 3.79,
  unit: "gallon",
  imageUrl: "/categories/dairy.svg",
};

const STORAGE_KEY = "grocery-demo-cart";

function renderButton() {
  return render(
    <CartProvider>
      <AddToCartButton product={product} />
    </CartProvider>
  );
}

describe("AddToCartButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts at quantity 1 with decrease disabled", () => {
    renderButton();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
  });

  it("increases the quantity when the increase button is clicked", async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByLabelText("Increase quantity"));

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease quantity")).not.toBeDisabled();
  });

  it("decreases the quantity but not below 1", async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Decrease quantity"));

    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Decrease quantity"));
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
  });

  it("adds the selected quantity to the cart and resets the stepper to 1", async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByText("Add to cart"));

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toEqual([expect.objectContaining({ id: "a", quantity: 3 })]);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows the 'Added ✓' state briefly after adding, then reverts", () => {
    vi.useFakeTimers();
    renderButton();

    fireEvent.click(screen.getByText("Add to cart"));
    expect(screen.getByText("Added ✓")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByText("Add to cart")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
