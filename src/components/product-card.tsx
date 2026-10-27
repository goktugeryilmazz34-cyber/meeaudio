import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";
import { getProductImage } from "@/lib/catalog-utils";
import { SmartImage } from "./smart-image";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-background transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square">
        <SmartImage
          src={getProductImage(product)}
          alt={product.name}
          gradient={product.gradient}
          emoji={product.emoji}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-background">
              Yeni
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
              %{discount}
            </span>
          )}
          {product.isBestSeller && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-brand">
              Çok Satan
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Stars rating={product.rating} />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex" aria-label={`${rating} / 5 puan`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < full ? "#f59e0b" : "none"}
          stroke={i < full ? "#f59e0b" : "#d6d3d1"}
          aria-hidden
        >
          <path
            d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}
