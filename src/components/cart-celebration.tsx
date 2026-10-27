"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useCart } from "./cart-provider";
import { getProductImage } from "@/lib/catalog-utils";
import { formatPrice } from "@/lib/format";
import { SmartImage } from "./smart-image";

const EMOJIS = ["🎉", "🎊", "✨", "🥳", "🎈", "⭐", "💫", "🛍️", "🎁"];

export function CartCelebration() {
  const { notice, clearNotice } = useCart();

  const pieces = useMemo(() => {
    if (!notice) return [];
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100,
      drift: `${(Math.random() - 0.5) * 40}vw`,
      delay: `${Math.random() * 0.5}s`,
      dur: `${2.4 + Math.random() * 1.8}s`,
      size: `${18 + Math.random() * 26}px`,
    }));
  }, [notice]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => clearNotice(), 3400);
    return () => clearTimeout(t);
  }, [notice, clearNotice]);

  if (!notice) return null;

  const { product, qty } = notice;

  return (
    <>
      {/* Tam ekran konfeti */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      >
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              fontSize: p.size,
              // @ts-expect-error CSS custom properties
              "--drift": p.drift,
              "--delay": p.delay,
              "--dur": p.dur,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Bildirim kartı */}
      <div className="pointer-events-none fixed inset-x-0 top-24 z-[101] flex justify-center px-4">
        <div className="animate-toast-pop pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-2 bg-success px-4 py-2.5 text-sm font-bold text-white">
            <span className="animate-check-pop flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
              ✓
            </span>
            Ürün sepetinize eklendi!
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="h-16 w-16 shrink-0">
              <SmartImage
                src={getProductImage(product)}
                alt={product.name}
                gradient={product.gradient}
                emoji={product.emoji}
                className="h-16 w-16 rounded-xl"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {qty} adet · {formatPrice(product.price * qty)}
              </p>
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-4">
            <button
              type="button"
              onClick={clearNotice}
              className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Alışverişe devam
            </button>
            <Link
              href="/sepet"
              onClick={clearNotice}
              className="flex-1 rounded-full bg-brand px-4 py-2.5 text-center text-sm font-semibold text-background transition hover:bg-brand-soft"
            >
              Sepete git
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
