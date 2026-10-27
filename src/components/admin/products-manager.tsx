"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteProduct } from "@/app/admin/actions";
import { discountPercent, formatPrice } from "@/lib/format";
import { SmartImage } from "@/components/smart-image";
import {
  ProductEditorDrawer,
  type ProductEditorData,
} from "./product-editor-drawer";

type CategoryRow = { id: string; slug: string; name: string };

export function ProductsManager() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductEditorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductEditorData | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [catRes, prodRes, varRes] = await Promise.all([
      supabase.from("categories").select("id, slug, name").order("name"),
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("product_variants").select("*").order("sort_order"),
    ]);
    if (catRes.error || prodRes.error) {
      setError(catRes.error?.message ?? prodRes.error?.message ?? "Yüklenemedi");
      setLoading(false);
      return;
    }
    const cats = catRes.data as CategoryRow[];
    setCategories(cats);
    const variantsByProduct = new Map<string, ProductEditorData["variants"]>();
    for (const v of varRes.data ?? []) {
      const pid = v.product_id as string;
      const list = variantsByProduct.get(pid) ?? [];
      list.push({
        id: v.id as string,
        name: v.name as string,
        sku: v.sku as string,
        price: Number(v.price),
        stock: v.stock as number,
        image: (v.image as string) ?? undefined,
        attributes: (v.attributes as Record<string, string>) ?? {},
      });
      variantsByProduct.set(pid, list);
    }

    setProducts(
      (prodRes.data ?? []).map((row) => {
        const categorySlug =
          cats.find((c) => c.id === row.category_id)?.slug ?? "";
        const pid = row.id as string;
        return {
          id: pid,
          category_id: row.category_id as string,
          categorySlug,
          is_active: row.is_active as boolean,
          slug: row.slug as string,
          name: row.name as string,
          brand: row.brand as string,
          price: Number(row.price),
          oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
          stock: row.stock as number,
          isNew: row.is_new as boolean,
          isBestSeller: row.is_best_seller as boolean,
          description: row.description as string,
          features: (row.features as string[]) ?? [],
          gradient: row.gradient as string,
          emoji: row.emoji as string,
          image: (row.image as string) ?? undefined,
          gallery: (row.gallery as string[]) ?? [],
          seoTitle: (row.seo_title as string) ?? "",
          seoDescription: (row.seo_description as string) ?? "",
          linkedDiscountCode: (row.linked_discount_code as string) ?? undefined,
          variants: variantsByProduct.get(pid) ?? [],
        };
      }),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }, [products, query]);

  async function onDelete(id: string) {
    if (!confirm("Ürün silinsin mi?")) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi");
    }
  }

  const catName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ürünler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ikas tarzı geniş düzenleyici · {products.length} ürün
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-background shadow-sm"
        >
          + Yeni Ürün
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ürün, slug veya marka ara..."
        className="w-full max-w-md rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
      />

      {loading ? (
        <p className="text-muted-foreground">Yükleniyor…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ürün</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Fiyat</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Varyasyon</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => {
                const discount = discountPercent(p.price, p.oldPrice);
                const thumb = p.image ?? `/images/products/${p.slug}.jpg`;
                return (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                          <SmartImage
                            src={thumb}
                            alt={p.name}
                            emoji={p.emoji}
                            className="h-full w-full"
                            imgClassName="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{catName(p.categorySlug)}</td>
                    <td className="px-4 py-3">
                      {formatPrice(p.price)}
                      {discount && (
                        <span className="ml-1 text-xs text-accent">-%{discount}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">{p.variants.length || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.is_active
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.is_active ? "Yayında" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="mr-3 font-semibold text-brand"
                        onClick={() => {
                          setEditing(p);
                          setOpen(true);
                        }}
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        className="mr-3 text-danger"
                        onClick={() => onDelete(p.id)}
                      >
                        Sil
                      </button>
                      <Link href={`/urunler/${p.slug}`} className="text-muted-foreground">
                        Gör
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProductEditorDrawer
        open={open}
        editing={editing}
        categories={categories}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSaved={load}
      />
    </div>
  );
}
