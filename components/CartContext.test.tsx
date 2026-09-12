import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, type AddableProduct, useCart } from "@/components/CartContext";

const STORAGE_KEY = "grocery-demo-cart";

const productA: AddableProduct = {
  id: "a",
  name: "Whole Milk",
  price: 3.79,
  unit: "gallon",
  imageUrl: "/categories/dairy.svg",
};

const productB: AddableProduct = {
  id: "b",
  name: "Sourdough Loaf",
  price: 4.99,
  unit: "each",
  imageUrl: "/categories/bakery.svg",
};

function TestHarness() {
  const cart = useCart();
  return (
    <div>
      <div data-testid="total-items">{cart.totalItems}</div>
      <div data-testid="total-price">{cart.totalPrice}</div>
      <div data-testid="items">{JSON.stringify(cart.items)}</div>
      <button onClick={() => cart.addItem(productA)}>add-a-default</button>
      <button onClick={() => cart.addItem(productA, 3)}>add-a-three</button>
      <button onClick={() => cart.addItem(productB)}>add-b</button>
      <button onClick={() => cart.updateQuantity(productA.id, 5)}>set-a-5</button>
      <button onClick={() => cart.updateQuantity(productA.id, 0)}>set-a-0</button>
      <button onClick={() => cart.removeItem(productB.id)}>remove-b</button>
      <button onClick={() => cart.clearCart()}>clear</button>
    </div>
  );
}

function getItems() {
  return JSON.parse(screen.getByTestId("items").textContent ?? "[]") as Array<{
    id: string;
    quantity: number;
  }>;
}

function renderHarness() {
  return render(
    <CartProvider>
      <TestHarness />
    </CartProvider>
  );
}

describe("CartContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds a new product with quantity 1 by default", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-default"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("items")).toHaveTextContent("\"quantity\":1");
  });

  it("adds a new product with an explicit quantity", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-three"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("3");
  });

  it("increases an existing product's quantity by the default amount, leaving other items unchanged", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-b"));
    await user.click(screen.getByText("add-a-default"));
    await user.click(screen.getByText("add-a-default"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("3");
    expect(getItems()).toContainEqual(expect.objectContaining({ id: "a", quantity: 2 }));
    expect(getItems()).toContainEqual(expect.objectContaining({ id: "b", quantity: 1 }));
  });

  it("increases an existing product's quantity by a chosen amount", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-default"));
    await user.click(screen.getByText("add-a-three"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("4");
  });

  it("updates a product's quantity to a higher number, leaving other items unchanged", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-b"));
    await user.click(screen.getByText("add-a-default"));
    await user.click(screen.getByText("set-a-5"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("6");
    expect(getItems()).toContainEqual(expect.objectContaining({ id: "a", quantity: 5 }));
    expect(getItems()).toContainEqual(expect.objectContaining({ id: "b", quantity: 1 }));
  });

  it("removes an item when its quantity is set to zero", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-default"));
    await user.click(screen.getByText("set-a-0"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("items")).toHaveTextContent("[]");
  });

  it("removes an item via removeItem", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-default"));
    await user.click(screen.getByText("add-b"));
    await user.click(screen.getByText("remove-b"));

    expect(screen.getByTestId("items")).not.toHaveTextContent("Sourdough Loaf");
    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
  });

  it("clears the cart", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-default"));
    await user.click(screen.getByText("add-b"));
    await user.click(screen.getByText("clear"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("items")).toHaveTextContent("[]");
  });

  it("computes totalItems and totalPrice across multiple items", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-three")); // 3 * 3.79
    await user.click(screen.getByText("add-b")); // 1 * 4.99

    expect(screen.getByTestId("total-items")).toHaveTextContent("4");
    expect(screen.getByTestId("total-price")).toHaveTextContent(
      String(3 * 3.79 + 4.99)
    );
  });

  it("persists cart contents to localStorage after a change", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByText("add-a-default"));

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: "a", quantity: 1 });
  });

  it("loads existing cart contents from localStorage on mount", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...productA, quantity: 2 }])
    );

    renderHarness();

    expect(await screen.findByTestId("total-items")).toHaveTextContent("2");
  });

  it("starts with an empty cart when localStorage contains malformed JSON", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-json");

    renderHarness();

    expect(await screen.findByTestId("total-items")).toHaveTextContent("0");
  });

  it("throws when useCart is used outside a CartProvider", () => {
    function Broken() {
      useCart();
      return null;
    }

    expect(() => {
      act(() => {
        render(<Broken />);
      });
    }).toThrow("useCart must be used within a CartProvider");
  });
});
