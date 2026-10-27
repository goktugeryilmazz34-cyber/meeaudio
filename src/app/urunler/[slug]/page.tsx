import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductImage, getRelatedProducts } from "@/lib/catalog-utils";
import {
  fetchCategories,
  fetchProductBySlug,
  fetchProducts,
} from "@/lib/db/catalog";
import { discountPercent, formatPrice } from "@/lib/format";
import { ProductActions } from "@/components/product-actions";
import { ProductCard, Stars } from "@/components/product-card";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { SmartImage } from "@/components/smart-image";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/urunler/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/urunler/[slug]">,
) {
  const { slug } = await props.params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const [categories, allProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);
  const category = categories.find((c) => c.slug === product.categorySlug);
  const related = getRelatedProducts(product, allProducts);
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ProductViewTracker slug={product.slug} />
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-brand">
          Anasayfa
        </Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-brand">
          Ürünler
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              href={`/kategoriler/${category.slug}`}
              className="hover:text-brand"
            >
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <SmartImage
            src={getProductImage(product)}
            alt={product.name}
            gradient={product.gradient}
            emoji={product.emoji}
            className="aspect-square rounded-3xl"
          />
          {discount && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-accent px-3 py-1.5 text-sm font-bold text-white">
              %{discount} indirim
            </span>
          )}
        </div>

        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={product.rating} />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({product.reviewCount} değerlendirme)
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-extrabold">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="pb-1 text-lg text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-success">
            Peşin fiyatına 12 taksit imkanı
          </p>

          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-xs text-success">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border pt-6">
            <ProductActions product={product} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            {[
              ["🚚", "Hızlı kargo"],
              ["↩️", "14 gün iade"],
              ["🛡️", "2 yıl garanti"],
            ].map(([icon, label]) => (
              <div
                key={label}
                className="rounded-xl border border-border py-3"
              >
                <div className="text-lg">{icon}</div>
                <div className="mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Benzer Ürünler
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
