"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  quantity: number;
};

export type AddableProduct = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  addItem: (product: AddableProduct, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "grocery-demo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount (client-only), so state
    // matches server-rendered output on the first paint and hydration
    // doesn't mismatch; this sync-on-mount is the case effects are for.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore malformed/unavailable localStorage - start with an empty cart.
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hasLoaded]);

  const addItem = useCallback((product: AddableProduct, quantity: number = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { ...product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.id !== id);
      }
      return current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
