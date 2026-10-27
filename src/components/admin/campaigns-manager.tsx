"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteCampaign, upsertCampaign } from "@/app/admin/actions";

type CampaignRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  code: string | null;
  discount_label: string;
  valid_until: string;
  is_active: boolean;
  category_id: string | null;
};

type CategoryRow = { id: string; name: string };

export function CampaignsManager() {
  const [rows, setRows] = useState<CampaignRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CampaignRow | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [cRes, kRes] = await Promise.all([
      supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").order("name"),
    ]);
    setRows((cRes.data as CampaignRow[]) ?? []);
    setCategories((kRes.data as CategoryRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(form: FormData) {
    await upsertCampaign(form);
    setOpen(false);
    setEditing(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Kampanyalar</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-background"
        >
          + Kampanya Ekle
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">İndirim</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-semibold">{c.title}</td>
                <td className="px-4 py-3">{c.code ?? "—"}</td>
                <td className="px-4 py-3">{c.discount_label}</td>
                <td className="px-4 py-3">{c.is_active ? "Aktif" : "Pasif"}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="text-brand mr-2" onClick={() => { setEditing(c); setOpen(true); }}>Düzenle</button>
                  <button type="button" className="text-danger" onClick={async () => { if (confirm("Sil?")) { await deleteCampaign(c.id); load(); } }}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit(new FormData(e.currentTarget));
            }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-6"
          >
            <input type="hidden" name="id" value={editing?.id ?? ""} />
            <div className="space-y-3 text-sm">
              <input name="title" required placeholder="Başlık" defaultValue={editing?.title} className="w-full rounded-xl border px-3 py-2" />
              <input name="slug" placeholder="Slug" defaultValue={editing?.slug} className="w-full rounded-xl border px-3 py-2" />
              <input name="subtitle" placeholder="Alt başlık" defaultValue={editing?.subtitle} className="w-full rounded-xl border px-3 py-2" />
              <textarea name="description" placeholder="Açıklama" defaultValue="" className="w-full rounded-xl border px-3 py-2" />
              <input name="badge" placeholder="Rozet" defaultValue={editing?.badge} className="w-full rounded-xl border px-3 py-2" />
              <input name="code" placeholder="Kupon kodu" defaultValue={editing?.code ?? ""} className="w-full rounded-xl border px-3 py-2" />
              <input name="discount_label" placeholder="İndirim etiketi" defaultValue={editing?.discount_label} className="w-full rounded-xl border px-3 py-2" />
              <input name="valid_until" placeholder="Geçerlilik" defaultValue={editing?.valid_until} className="w-full rounded-xl border px-3 py-2" />
              <input name="image" placeholder="Görsel URL" className="w-full rounded-xl border px-3 py-2" />
              <select name="category_id" defaultValue={editing?.category_id ?? ""} className="w-full rounded-xl border px-3 py-2">
                <option value="">Kategori yok</option>
                {categories.map((k) => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
              <label className="flex gap-2"><input type="checkbox" name="is_active" defaultChecked={editing?.is_active ?? true} /> Aktif</label>
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
