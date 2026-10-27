"use client";

import { useState } from "react";
import { upsertDiscountCode, deleteDiscountCode } from "@/app/admin/actions";
import type { DiscountCode } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function DiscountCodesManager({ initial }: { initial: DiscountCode[] }) {
  const [codes, setCodes] = useState(initial);
  const [error, setError] = useState("");

  async function onSubmit(form: FormData) {
    setError("");
    try {
      await upsertDiscountCode(form);
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">İndirim kodları</h1>
        <p className="text-sm text-muted-foreground">Sepet ve ürün kampanyalarında kullanılır.</p>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }}
        className="grid max-w-3xl gap-3 rounded-2xl border border-border bg-background p-5 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value="" />
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Kod</span>
          <input name="code" required className="mt-1 w-full rounded-xl border border-border px-3 py-2 uppercase" placeholder="HOSGELDIN250" />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Etiket</span>
          <input name="label" className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Tip</span>
          <select name="discount_type" className="mt-1 w-full rounded-xl border border-border px-3 py-2">
            <option value="fixed">Sabit tutar (₺)</option>
            <option value="percent">Yüzde (%)</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium">Değer</span>
          <input name="discount_value" type="number" required className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Min. sepet</span>
          <input name="min_order" type="number" defaultValue={0} className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Geçerlilik</span>
          <input name="valid_until" type="date" className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="is_active" defaultChecked /> Aktif
        </label>
        <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-background sm:col-span-2">
          Kod ekle
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">İndirim</th>
              <th className="px-4 py-3">Min. sepet</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {codes.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3">
                  {c.discountType === "percent"
                    ? `%${c.discountValue}`
                    : formatPrice(c.discountValue)}
                </td>
                <td className="px-4 py-3">{formatPrice(c.minOrder)}</td>
                <td className="px-4 py-3">{c.isActive ? "Aktif" : "Pasif"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-danger"
                    onClick={async () => {
                      if (!confirm("Silinsin mi?")) return;
                      await deleteDiscountCode(c.id);
                      setCodes(codes.filter((x) => x.id !== c.id));
                    }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
