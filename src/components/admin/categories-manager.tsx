"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteCategory, upsertCategory } from "@/app/admin/actions";

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

export function CategoriesManager() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .order("name");
    if (err) setError(err.message);
    else setRows((data as CategoryRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(form: FormData) {
    try {
      await upsertCategory(form);
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Kategoriler</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-background"
        >
          + Kategori Ekle
        </button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl">{c.icon}</span>
                <h2 className="mt-2 font-bold">{c.name}</h2>
                <p className="text-xs text-muted-foreground">{c.slug}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className="text-brand"
                  onClick={() => {
                    setEditing(c);
                    setOpen(true);
                  }}
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  className="text-danger"
                  onClick={async () => {
                    if (!confirm("Silinsin mi?")) return;
                    await deleteCategory(c.id);
                    load();
                  }}
                >
                  Sil
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit(new FormData(e.currentTarget));
            }}
            className="w-full max-w-md rounded-2xl bg-background p-6"
          >
            <h2 className="font-bold">{editing ? "Kategori Düzenle" : "Yeni Kategori"}</h2>
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <div className="mt-4 space-y-3 text-sm">
              <input name="name" placeholder="Ad" required defaultValue={editing?.name} className="w-full rounded-xl border px-3 py-2" />
              <input name="slug" placeholder="Slug" defaultValue={editing?.slug} className="w-full rounded-xl border px-3 py-2" />
              <textarea name="description" placeholder="Açıklama" defaultValue={editing?.description} className="w-full rounded-xl border px-3 py-2" />
              <input name="icon" placeholder="Emoji" defaultValue={editing?.icon ?? "📦"} className="w-full rounded-xl border px-3 py-2" />
              <input name="image" placeholder="Görsel URL" defaultValue={editing?.image} className="w-full rounded-xl border px-3 py-2" />
              <input name="sort_order" type="number" placeholder="Sıra" defaultValue={String(editing?.sort_order ?? 0)} className="w-full rounded-xl border px-3 py-2" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="rounded-full bg-brand px-4 py-2 text-background">Kaydet</button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border px-4 py-2">İptal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
