import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/products-explorer";
import { fetchCategories, fetchProducts } from "@/lib/db/catalog";

export const metadata: Metadata = {
  title: "Ürünlerimiz",
  description:
    "MeeAudio'nun tüm ürünleri: kulaklık, hoparlör, takı, akıllı saat ve teknolojik aksesuarlar.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ürünlerimiz
        </h1>
        <p className="mt-2 text-muted-foreground">
          Binlerce ürün arasından sana en uygun olanı keşfet.
        </p>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Yükleniyor…</div>}>
        <ProductsExplorer products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
