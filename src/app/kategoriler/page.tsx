import type { Metadata } from "next";
import { getCategoryProductCount } from "@/lib/catalog-utils";
import { fetchCategories, fetchProducts } from "@/lib/db/catalog";
import { SmartImage } from "@/components/smart-image";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kategoriler",
  description: "MeeAudio ürün kategorileri.",
};

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Kategoriler
        </h1>
        <p className="mt-2 text-muted-foreground">
          İhtiyacına göre kategorileri keşfet.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-border py-16 text-center text-muted-foreground">
          Henüz kategori eklenmedi.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal
              key={cat.slug}
              delay={i * 80}
              href={`/kategoriler/${cat.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44">
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  gradient={cat.gradient}
                  emoji={cat.icon}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-xl shadow">
                  {cat.icon}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{cat.name}</h2>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {getCategoryProductCount(products, cat.slug)} ürün
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  Ürünleri gör
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
