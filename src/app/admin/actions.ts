"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum gerekli.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Admin yetkisi gerekli.");
  return supabase;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function upsertCategory(form: FormData) {
  const supabase = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim() || slugify(name);
  const description = String(form.get("description") ?? "").trim();
  const icon = String(form.get("icon") ?? "📦");
  const gradient = String(form.get("gradient") ?? "");
  const image = String(form.get("image") ?? "");
  const sortOrder = Number(form.get("sort_order") ?? 0);

  const payload = {
    name,
    slug,
    description,
    icon,
    gradient:
      gradient ||
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    image,
    sort_order: sortOrder,
  };

  if (id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath("/kategoriler");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/kategoriler");
}

type VariantInput = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
};

function parseVariants(raw: string): VariantInput[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as VariantInput[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v) => v.name?.trim());
  } catch {
    return [];
  }
}

export async function uploadProductImage(form: FormData): Promise<string> {
  await requireAdmin();
  const file = form.get("file");
  const slug = String(form.get("slug") ?? "urun").trim() || "urun";
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Geçerli bir görsel seçin.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Görsel en fazla 5 MB olabilir.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const filename = `${slugify(slug)}-${Date.now()}.${safeExt}`;
  const dir = path.join(process.cwd(), "public/uploads/products");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/products/${filename}`;
}

export async function upsertProduct(form: FormData) {
  const supabase = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim() || slugify(name);
  const brand = String(form.get("brand") ?? "MeeAudio").trim();
  const categoryId = String(form.get("category_id") ?? "");
  const price = Number(form.get("price") ?? 0);
  const oldPriceRaw = String(form.get("old_price") ?? "");
  const stock = Number(form.get("stock") ?? 0);
  const description = String(form.get("description") ?? "").trim();
  const featuresRaw = String(form.get("features") ?? "");
  const emoji = String(form.get("emoji") ?? "📦");
  const gradient = String(form.get("gradient") ?? "");
  const image = String(form.get("image") ?? "").trim() || null;
  const galleryRaw = String(form.get("gallery") ?? "");
  const seoTitle = String(form.get("seo_title") ?? "").trim();
  const seoDescription = String(form.get("seo_description") ?? "").trim();
  const linkedDiscountCode =
    String(form.get("linked_discount_code") ?? "").trim() || null;
  const variantsJson = String(form.get("variants_json") ?? "");
  const isNew = form.get("is_new") === "on";
  const isBestSeller = form.get("is_best_seller") === "on";
  const isActive = form.get("is_active") === "on";

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const gallery = galleryRaw
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const payload = {
    name,
    slug,
    brand,
    category_id: categoryId,
    price,
    old_price: oldPriceRaw ? Number(oldPriceRaw) : null,
    stock,
    description,
    features,
    emoji,
    gradient:
      gradient ||
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    image,
    gallery,
    seo_title: seoTitle,
    seo_description: seoDescription,
    linked_discount_code: linkedDiscountCode,
    is_new: isNew,
    is_best_seller: isBestSeller,
    is_active: isActive,
  };

  let productId = id;
  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    productId = data.id as string;
  }

  const variants = parseVariants(variantsJson);
  if (productId) {
    await supabase.from("product_variants").delete().eq("product_id", productId);
    if (variants.length) {
      const { error: vErr } = await supabase.from("product_variants").insert(
        variants.map((v, i) => ({
          product_id: productId,
          name: v.name.trim(),
          sku: v.sku.trim(),
          price: v.price,
          stock: v.stock,
          image: v.image?.trim() || null,
          attributes: v.attributes ?? {},
          sort_order: i,
        })),
      );
      if (vErr) throw new Error(vErr.message);
    }
  }

  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/urunler");
}

export async function upsertCampaign(form: FormData) {
  const supabase = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim() || slugify(title);
  const subtitle = String(form.get("subtitle") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const badge = String(form.get("badge") ?? "").trim();
  const code = String(form.get("code") ?? "").trim() || null;
  const discountLabel = String(form.get("discount_label") ?? "").trim();
  const validUntil = String(form.get("valid_until") ?? "").trim();
  const gradient = String(form.get("gradient") ?? "");
  const image = String(form.get("image") ?? "").trim();
  const categoryId = String(form.get("category_id") ?? "").trim() || null;
  const isActive = form.get("is_active") === "on";

  const payload = {
    title,
    slug,
    subtitle,
    description,
    badge,
    code,
    discount_label: discountLabel,
    valid_until: validUntil,
    gradient:
      gradient ||
      "linear-gradient(135deg, #e4572e 0%, #ff8a5b 100%)",
    image,
    category_id: categoryId,
    is_active: isActive,
  };

  if (id) {
    const { error } = await supabase.from("campaigns").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("campaigns").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/kampanyalar");
  revalidatePath("/kampanyalar");
}

export async function upsertDiscountCode(form: FormData) {
  const supabase = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const code = String(form.get("code") ?? "").trim().toUpperCase();
  const label = String(form.get("label") ?? "").trim();
  const discountType = String(form.get("discount_type") ?? "fixed") as
    | "percent"
    | "fixed";
  const discountValue = Number(form.get("discount_value") ?? 0);
  const minOrder = Number(form.get("min_order") ?? 0);
  const validUntil = String(form.get("valid_until") ?? "").trim() || null;
  const isActive = form.get("is_active") === "on";

  const payload = {
    code,
    label,
    discount_type: discountType,
    discount_value: discountValue,
    min_order: minOrder,
    valid_until: validUntil,
    is_active: isActive,
  };

  if (id) {
    const { error } = await supabase.from("discount_codes").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("discount_codes").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/indirim-kodlari");
}

export async function deleteDiscountCode(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("discount_codes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/indirim-kodlari");
}

export async function deleteCampaign(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/kampanyalar");
}
