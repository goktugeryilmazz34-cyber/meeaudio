"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/types";

export type CartItem = {
  slug: string;
  qty: number;
  name: string;
  price: number;
  emoji: string;
  gradient: string;
  image?: string;
  stock: number;
  brand: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
};

function snapshot(product: Product, qty: number): CartItem {
  return {
    slug: product.slug,
    qty,
    name: product.name,
    price: product.price,
    emoji: product.emoji,
    gradient: product.gradient,
    image: product.image,
    stock: product.stock,
    brand: product.brand,
    categorySlug: product.categorySlug,
    rating: product.rating,
    reviewCount: product.reviewCount,
    description: product.description,
    features: product.features,
  };
}

function toProduct(item: CartItem): Product {
  return {
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    categorySlug: item.categorySlug,
    price: item.price,
    rating: item.rating,
    reviewCount: item.reviewCount,
    stock: item.stock,
    description: item.description,
    features: item.features,
    gradient: item.gradient,
    emoji: item.emoji,
    image: item.image,
  };
}

export type DetailedCartItem = { product: Product; qty: number };

export type CartNotice = { product: Product; qty: number; id: number };

const CART_KEY = "meeaudio:cart";
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 45;

type CartContextValue = {
  items: CartItem[];
  detailed: DetailedCartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  notice: CartNotice | null;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  clearNotice: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState<CartNotice | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(parsed.filter((i) => i.name && i.price != null));
      }
    } catch {
      // yoksay
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // yoksay
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug
            ? { ...i, qty: Math.min(product.stock, i.qty + qty) }
            : i,
        );
      }
      return [
        ...prev,
        snapshot(product, Math.min(product.stock, qty)),
      ];
    });
    setNotice({ product, qty, id: Date.now() });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.slug === slug ? { ...i, qty } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const clearNotice = useCallback(() => setNotice(null), []);

  const value = useMemo<CartContextValue>(() => {
    const detailed: DetailedCartItem[] = items.map((i) => ({
      product: toProduct(i),
      qty: i.qty,
    }));

    const count = detailed.reduce((s, i) => s + i.qty, 0);
    const subtotal = detailed.reduce(
      (s, i) => s + i.product.price * i.qty,
      0,
    );
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    return {
      items,
      detailed,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      notice,
      addItem,
      removeItem,
      setQty,
      clear,
      clearNotice,
    };
  }, [items, notice, addItem, removeItem, setQty, clear, clearNotice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  }
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };
