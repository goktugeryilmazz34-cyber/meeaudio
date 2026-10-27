import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/catalog-utils";
import {
  fetchCampaigns,
  fetchCategoryBySlug,
  fetchProducts,
} from "@/lib/db/catalog";
import { ProductCard } from "@/components/product-card";
import { SmartImage } from "@/components/smart-image";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/kategoriler/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: "Kategori bulunamadı" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryDetailPage(
  props: PageProps<"/kategoriler/[slug]">,
) {
  const { slug } = await props.params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) notFound();

  const [products, campaigns] = await Promise.all([
    fetchProducts(),
    fetchCampaigns(),
  ]);
  const categoryProducts = getProductsByCategory(products, slug);
  const relatedCampaigns = campaigns.filter((c) => c.categorySlug === slug);

  return (
    <div>
      <header className="relative flex min-h-[240px] items-end overflow-hidden">
        <SmartImage
          src={category.image}
          alt={category.name}
          gradient={category.gradient}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12">
          <nav className="mb-4 text-sm text-white/70">
            <Link href="/kategoriler" className="hover:text-white">
              Kategoriler
            </Link>
            <span> / </span>
            <span className="text-white">{category.name}</span>
          </nav>
          <span className="text-4xl">{category.icon}</span>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-xl text-white/80">{category.description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {relatedCampaigns.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold">Bu kategoride kampanyalar</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relatedCampaigns.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kampanyalar/${c.slug}`}
                    className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {categoryProducts.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Bu kategoride henüz ürün yok.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categoryProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
