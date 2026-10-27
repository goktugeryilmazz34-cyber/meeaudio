import type { Product } from "@/lib/types";

export function getProductImage(product: Product): string {
  return product.image ?? `/images/products/${product.slug}.jpg`;
}

export function getFeaturedProducts(products: Product[]): Product[] {
  return products.filter((p) => p.isBestSeller).slice(0, 4);
}

export function getNewProducts(products: Product[]): Product[] {
  return products.filter((p) => p.isNew).slice(0, 4);
}

export function getProductsByCategory(
  products: Product[],
  slug: string,
): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getRelatedProducts(product: Product, all: Product[]): Product[] {
  return all
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 4);
}

export function getCategoryProductCount(products: Product[], slug: string): number {
  return products.filter((p) => p.categorySlug === slug).length;
}
