"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartOrderSummary } from "@/components/cart-order-summary";
import { CheckoutSteps } from "@/components/checkout-steps";
import { FREE_SHIPPING_THRESHOLD, useCart } from "@/components/cart-provider";
import { getProductImage } from "@/lib/catalog-utils";
import { formatPrice } from "@/lib/format";
import { SmartImage } from "@/components/smart-image";
import { trackEvent } from "@/lib/analytics-client";

export default function CartPage() {
  const { detailed, setQty, removeItem, count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackEvent({ eventType: "page_view", path: "/sepet" });
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Alışveriş
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Sepetiniz
        </h1>
        <div className="mt-6">
          <CheckoutSteps step={1} />
        </div>
      </div>

      {detailed.length === 0 ? (
        <div className="cart-empty-pop mx-auto max-w-lg rounded-3xl border border-border bg-muted/30 px-8 py-16 text-center">
          <span className="inline-block text-6xl animate-float" aria-hidden>
            🛒
          </span>
          <h2 className="mt-4 text-xl font-bold">Sepetiniz boş</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {FREE_SHIPPING_THRESHOLD}₺ üzeri siparişlerde ücretsiz kargo sizi bekliyor.
          </p>
          <Link
            href="/urunler"
            className="mt-8 inline-flex rounded-full bg-brand px-8 py-3 text-sm font-bold text-background transition hover:bg-brand-soft"
          >
            Ürünleri keşfet
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <ul className="space-y-4">
            {detailed.map(({ product, qty }, index) => (
              <li
                key={product.slug}
                className="cart-line-in flex gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:shadow-md"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Link
                  href={`/urunler/${product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  <SmartImage
                    src={getProductImage(product)}
                    alt={product.name}
                    gradient={product.gradient}
                    emoji={product.emoji}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/urunler/${product.slug}`}
                      className="font-semibold hover:text-brand"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-border bg-muted/50 p-1">
                      <button
                        type="button"
                        onClick={() => setQty(product.slug, qty - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-background"
                        aria-label="Azalt"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-bold">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQty(product.slug, Math.min(product.stock, qty + 1))
                        }
                        disabled={qty >= product.stock}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-background disabled:opacity-40"
                        aria-label="Artır"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-extrabold">
                      {formatPrice(product.price * qty)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(product.slug)}
                  className="self-start rounded-lg p-2 text-muted-foreground transition hover:bg-danger/10 hover:text-danger"
                  aria-label="Kaldır"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <CartOrderSummary
            ctaHref={count > 0 ? "/odeme" : undefined}
            ctaLabel="Ödemeye geç →"
          />
        </div>
      )}
    </div>
  );
}
