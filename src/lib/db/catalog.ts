import type { Campaign, Category, Product } from "@/lib/types";
import {
  seedCampaigns,
  seedCategories,
  seedProducts,
  withCatalogFallback,
} from "@/lib/seed-catalog";
import { createClient } from "@/lib/supabase/server";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  image: string;
  sort_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_id: string;
  price: number;
  old_price: number | null;
  rating: number;
  review_count: number;
  stock: number;
  is_new: boolean;
  is_best_seller: boolean;
  description: string;
  features: string[];
  gradient: string;
  emoji: string;
  image: string | null;
  is_active: boolean;
  categories: { slug: string } | { slug: string }[] | null;
};

type CampaignRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  code: string | null;
  discount_label: string;
  valid_until: string;
  gradient: string;
  image: string;
  is_active: boolean;
  categories: { slug: string } | { slug: string }[] | null;
};

function catSlug(row: ProductRow | CampaignRow): string | undefined {
  const c = row.categories;
  if (!c) return undefined;
  if (Array.isArray(c)) return c[0]?.slug;
  return c.slug;
}

function mapCategory(row: CategoryRow): Category {
  const image =
    row.image?.trim() || `/images/categories/${row.slug}.jpg`;
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    gradient: row.gradient,
    image,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    categorySlug: catSlug(row) ?? "",
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    description: row.description,
    features: Array.isArray(row.features) ? row.features : [],
    gradient: row.gradient,
    emoji: row.emoji,
    image:
      row.image?.trim() ||
      `/images/products/${row.slug}.jpg`,
  };
}

function mapCampaign(row: CampaignRow): Campaign {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    badge: row.badge,
    code: row.code ?? undefined,
    discountLabel: row.discount_label,
    validUntil: row.valid_until,
    gradient: row.gradient,
    image: row.image?.trim() || `/images/products/aurora-kablosuz-kulaklik.jpg`,
    categorySlug: catSlug(row),
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  const rows = (data as CategoryRow[]).map(mapCategory);
  return withCatalogFallback(rows, seedCategories);
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCategory(data as CategoryRow) : null;
}

export async function fetchProducts(activeOnly = true): Promise<Product[]> {
  const supabase = await createClient();
  let q = supabase
    .from("products")
    .select("*, categories(slug)")
    .order("created_at", { ascending: false });
  if (activeOnly) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  const rows = (data as ProductRow[]).map(mapProduct);
  return withCatalogFallback(rows, seedProducts);
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapProduct(data as ProductRow);
}

export async function fetchProductSlugs(): Promise<string[]> {
  const products = await fetchProducts(true);
  return products.map((p) => p.slug);
}

export async function fetchCampaigns(activeOnly = true): Promise<Campaign[]> {
  const supabase = await createClient();
  let q = supabase
    .from("campaigns")
    .select("*, categories(slug)")
    .order("created_at", { ascending: false });
  if (activeOnly) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  const rows = (data as CampaignRow[]).map(mapCampaign);
  return withCatalogFallback(rows, seedCampaigns);
}

export async function fetchCampaignBySlug(
  slug: string,
): Promise<Campaign | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*, categories(slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCampaign(data as CampaignRow) : null;
}

