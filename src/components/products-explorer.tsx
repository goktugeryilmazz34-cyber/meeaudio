"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./product-card";
import type { Category, Product } from "@/lib/types";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "popular", label: "En Popüler" },
  { key: "price-asc", label: "Artan Fiyat" },
  { key: "price-desc", label: "Azalan Fiyat" },
  { key: "rating", label: "En Yüksek Puan" },
];

export function ProductsExplorer({
  initialCategory,
  products,
  categories,
}: {
  initialCategory?: string;
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchesCategory = category === "all" || p.categorySlug === category;
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.reviewCount - a.reviewCount;
      }
    });

    return list;
  }, [query, category, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Filtreler */}
      <aside className="space-y-6 lg:sticky lg:top-44 lg:self-start">
        <div>
          <label className="mb-2 block text-sm font-semibold">Ara</label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Kategoriler</h3>
          <div className="space-y-1">
            <FilterButton
              active={category === "all"}
              onClick={() => setCategory("all")}
              label="Tüm Kategoriler"
            />
            {categories.map((c) => (
              <FilterButton
                key={c.slug}
                active={category === c.slug}
                onClick={() => setCategory(c.slug)}
                label={`${c.icon} ${c.name}`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Liste */}
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> ürün
            bulundu
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sırala:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 font-semibold">Sonuç bulunamadı</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Farklı bir arama veya kategori dene.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-brand font-semibold text-background"
          : "hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
