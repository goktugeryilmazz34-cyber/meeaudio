"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";
import { trackEvent } from "@/lib/analytics-client";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);

  function addToCart() {
    addItem(product, qty);
    trackEvent({
      eventType: "add_to_cart",
      productSlug: product.slug,
      path: `/urunler/${product.slug}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Adet</span>
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-muted"
            aria-label="Azalt"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-muted"
            aria-label="Artır"
          >
            +
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {product.stock} adet stokta
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={addToCart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition ${
            added
              ? "bg-success text-white"
              : "bg-brand text-background hover:bg-brand-soft"
          }`}
        >
          {added ? "✓ Sepete eklendi" : "Sepete Ekle"}
        </button>
        <button
          type="button"
          onClick={() => setFav((f) => !f)}
          aria-pressed={fav}
          aria-label="Favorilere ekle"
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border transition ${
            fav
              ? "border-accent bg-accent/10 text-accent"
              : "border-border hover:border-brand"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} aria-hidden>
            <path
              d="M12 21s-7.5-4.6-10-9.3C.7 9 1.6 5.7 4.5 4.7 6.6 4 8.7 4.9 12 8c3.3-3.1 5.4-4 7.5-3.3 2.9 1 3.8 4.3 2.5 7C19.5 16.4 12 21 12 21z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
