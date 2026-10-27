"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadProductImage, upsertProduct } from "@/app/admin/actions";
import { SmartImage } from "@/components/smart-image";
import type { ProductVariant } from "@/lib/types";

type CategoryRow = { id: string; slug: string; name: string };
type DiscountRow = {
  code: string;
  label: string;
};

export type ProductEditorData = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category_id: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  stock: number;
  description: string;
  features: string[];
  emoji: string;
  gradient: string;
  image?: string;
  gallery: string[];
  seoTitle: string;
  seoDescription: string;
  linkedDiscountCode?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  is_active: boolean;
  variants: ProductVariant[];
};

const TABS = [
  { id: "general", label: "Genel" },
  { id: "media", label: "Medya" },
  { id: "pricing", label: "Fiyat & Kampanya" },
  { id: "variants", label: "Varyasyonlar" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = {
  open: boolean;
  editing: ProductEditorData | null;
  categories: CategoryRow[];
  onClose: () => void;
  onSaved: () => void;
};

export function ProductEditorDrawer({
  open,
  editing,
  categories,
  onClose,
  onSaved,
}: Props) {
  const [tab, setTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [galleryLines, setGalleryLines] = useState("");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (!open) return;
    setTab("general");
    setError("");
    setVariants(editing?.variants ?? []);
    setGalleryLines((editing?.gallery ?? []).join("\n"));
    setMainImage(editing?.image ?? "");
  }, [open, editing]);

  useEffect(() => {
    if (!open) return;
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient()
        .from("discount_codes")
        .select("code, label")
        .eq("is_active", true)
        .order("code")
        .then(({ data }) => setDiscounts((data as DiscountRow[]) ?? []));
    });
  }, [open]);

  const title = editing ? "Ürünü düzenle" : "Yeni ürün";
  const slugPreview = editing?.slug ?? "yeni-urun";

  async function onUpload(file: File, slug: string, setUrl: (u: string) => void) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("slug", slug);
      const url = await uploadProductImage(fd);
      setUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);
    form.set("gallery", galleryLines);
    form.set("image", mainImage);
    form.set("variants_json", JSON.stringify(variants));
    try {
      await upsertProduct(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  const previewImages = useMemo(() => {
    const g = galleryLines.split("\n").map((l) => l.trim()).filter(Boolean);
    return mainImage ? [mainImage, ...g.filter((u) => u !== mainImage)] : g;
  }, [mainImage, galleryLines]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:left-[260px]">
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="admin-drawer-enter absolute inset-y-0 right-0 flex w-full max-w-5xl flex-col border-l border-border bg-background shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Katalog yönetimi
            </p>
            <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Kapat
          </button>
        </header>

        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-4 py-2 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id
                  ? "bg-brand text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {error && (
              <p className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            <div className={tab === "general" ? "grid gap-4 lg:grid-cols-2" : "hidden"}>
                <Field label="Ürün adı" name="name" defaultValue={editing?.name} required />
                <Field label="URL slug" name="slug" defaultValue={editing?.slug} />
                <Field label="Marka" name="brand" defaultValue={editing?.brand ?? "MeeAudio"} />
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium">Kategori</span>
                  <select
                    name="category_id"
                    required
                    defaultValue={editing?.category_id ?? categories[0]?.id}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium">Açıklama</span>
                  <textarea
                    name="description"
                    defaultValue={editing?.description ?? ""}
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium">Özellikler (her satır bir madde)</span>
                  <textarea
                    name="features"
                    defaultValue={(editing?.features ?? []).join("\n")}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-mono text-xs"
                  />
                </label>
                <Field label="Emoji" name="emoji" defaultValue={editing?.emoji ?? "📦"} />
                <Field
                  label="Gradient (CSS)"
                  name="gradient"
                  defaultValue={editing?.gradient ?? ""}
                />
                <div className="flex flex-wrap gap-4 lg:col-span-2">
                  <Toggle name="is_new" label="Yeni ürün" defaultChecked={editing?.isNew} />
                  <Toggle name="is_best_seller" label="Çok satan" defaultChecked={editing?.isBestSeller} />
                  <Toggle name="is_active" label="Yayında" defaultChecked={editing?.is_active ?? true} />
                </div>
              </div>

            <div className={tab === "media" ? "grid gap-6 lg:grid-cols-[1fr_280px]" : "hidden"}>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Kapak görseli</p>
                    <p className="text-xs text-muted-foreground">
                      Dosya yükle veya URL yapıştır. Önerilen: 1200×1200 px
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <label className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-background">
                        {uploading ? "Yükleniyor…" : "Dosya yükle"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(ev) => {
                            const f = ev.target.files?.[0];
                            if (f) {
                              const slug =
                                (document.querySelector(
                                  'input[name="slug"]',
                                ) as HTMLInputElement | null)?.value || slugPreview;
                              onUpload(f, slug, setMainImage);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      placeholder="/images/products/..."
                      className="mt-2 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                    />
                  </div>
                  <label className="block text-sm">
                    <span className="font-medium">Galeri (her satırda bir URL)</span>
                    <textarea
                      value={galleryLines}
                      onChange={(e) => setGalleryLines(e.target.value)}
                      rows={6}
                      className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-mono text-xs"
                      placeholder="/uploads/products/...&#10;/images/products/..."
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  {previewImages.slice(0, 4).map((src) => (
                    <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                      <SmartImage src={src} alt="" className="h-full w-full" imgClassName="object-cover" />
                    </div>
                  ))}
                  {!previewImages.length && (
                    <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                      Önizleme yok
                    </div>
                  )}
                </div>
              </div>

            <div className={tab === "pricing" ? "grid max-w-2xl gap-4" : "hidden"}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Satış fiyatı (₺)" name="price" type="number" defaultValue={String(editing?.price ?? 0)} />
                  <Field
                    label="Liste / eski fiyat"
                    name="old_price"
                    type="number"
                    defaultValue={editing?.oldPrice != null ? String(editing.oldPrice) : ""}
                  />
                </div>
                <Field label="Ana stok adedi" name="stock" type="number" defaultValue={String(editing?.stock ?? 0)} />
                <label className="block text-sm">
                  <span className="font-medium">Ürüne bağlı indirim kodu</span>
                  <select
                    name="linked_discount_code"
                    defaultValue={editing?.linkedDiscountCode ?? ""}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5"
                  >
                    <option value="">— Seçilmedi —</option>
                    {discounts.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} · {d.label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-xs text-muted-foreground">
                  Mağaza geneli kodlar için Kampanyalar ve İndirim Kodları bölümünü kullanın.
                </p>
              </div>

            <div className={tab === "variants" ? "space-y-4" : "hidden"}>
                <p className="text-sm text-muted-foreground">
                  Renk, beden, kapasite gibi alt seçenekler. Her varyasyonun kendi fiyat ve stok değeri olabilir.
                </p>
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <input
                      placeholder="Varyasyon adı (ör. Siyah / M)"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, name: e.target.value };
                        setVariants(next);
                      }}
                      className="rounded-lg border border-border px-3 py-2 text-sm lg:col-span-2"
                    />
                    <input
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, sku: e.target.value };
                        setVariants(next);
                      }}
                      className="rounded-lg border border-border px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Fiyat"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, price: Number(e.target.value) };
                        setVariants(next);
                      }}
                      className="rounded-lg border border-border px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Stok"
                      value={v.stock}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, stock: Number(e.target.value) };
                        setVariants(next);
                      }}
                      className="rounded-lg border border-border px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Görsel URL (opsiyonel)"
                      value={v.image ?? ""}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...v, image: e.target.value };
                        setVariants(next);
                      }}
                      className="rounded-lg border border-border px-3 py-2 text-sm sm:col-span-2 lg:col-span-3"
                    />
                    <button
                      type="button"
                      onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                      className="text-sm font-medium text-danger"
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setVariants([
                      ...variants,
                      {
                        name: "",
                        sku: "",
                        price: editing?.price ?? 0,
                        stock: 0,
                        attributes: {},
                      },
                    ])
                  }
                  className="rounded-full border border-dashed border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  + Varyasyon ekle
                </button>
              </div>

            <div className={tab === "seo" ? "max-w-2xl space-y-4" : "hidden"}>
                <Field label="SEO başlık" name="seo_title" defaultValue={editing?.seoTitle ?? ""} />
                <label className="block text-sm">
                  <span className="font-medium">SEO açıklama</span>
                  <textarea
                    name="seo_description"
                    defaultValue={editing?.seoDescription ?? ""}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5"
                  />
                </label>
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                  <p className="font-semibold">Google önizleme</p>
                  <p className="mt-2 text-brand">
                    {(document.querySelector('input[name="seo_title"]') as HTMLInputElement)?.value ||
                      editing?.seoTitle ||
                      editing?.name ||
                      "Ürün başlığı"}
                  </p>
                  <p className="text-xs text-muted-foreground">meeaudio.com › urunler › {slugPreview}</p>
                </div>
              </div>
          </div>

          <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-background disabled:opacity-50"
            >
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border border-border px-3 py-2.5"
      />
    </label>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded" />
      {label}
    </label>
  );
}
