"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

const FAVORITE_SLUGS = [
  "aurora-kablosuz-kulaklik",
  "nova-akilli-saat",
  "luna-altin-kolye",
  "pulse-bluetooth-hoparlor",
];

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    createClient()
      .from("products")
      .select("*, categories(slug)")
      .in("slug", FAVORITE_SLUGS)
      .then(({ data }) => {
        if (!data) return;
        setFavorites(
          data.map((row) => {
            const cat = row.categories as { slug: string } | { slug: string }[] | null;
            const categorySlug = Array.isArray(cat) ? cat[0]?.slug : cat?.slug;
            return {
              slug: row.slug as string,
              name: row.name as string,
              brand: row.brand as string,
              categorySlug: categorySlug ?? "",
              price: Number(row.price),
              oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
              rating: Number(row.rating),
              reviewCount: row.review_count as number,
              stock: row.stock as number,
              isNew: row.is_new as boolean,
              isBestSeller: row.is_best_seller as boolean,
              description: row.description as string,
              features: (row.features as string[]) ?? [],
              gradient: row.gradient as string,
              emoji: row.emoji as string,
              image: (row.image as string) ?? undefined,
            };
          }),
        );
      });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Favorilerim</h2>
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">Henüz favori ürün yok veya ürünler kaldırıldı.</p>
          <Link href="/urunler" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background">
            Ürünleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {favorites.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
