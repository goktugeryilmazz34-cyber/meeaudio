"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Ayarlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mağaza bilgilerini ve genel tercihleri yönet.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card title="Mağaza Bilgileri">
          <Field label="Mağaza adı" defaultValue="MeeAudio" />
          <Field label="İletişim e-postası" defaultValue="destek@meeaudio.com" />
          <Field label="Telefon" defaultValue="0850 000 00 00" />
          <Field label="Adres" defaultValue="İstanbul, Türkiye" />
        </Card>

        <Card title="Kargo & Ödeme">
          <Field
            label="Ücretsiz kargo limiti (₺)"
            type="number"
            defaultValue="500"
          />
          <Field label="Standart kargo ücreti (₺)" type="number" defaultValue="45" />
          <Toggle label="Kapıda ödeme aktif" defaultChecked />
          <Toggle label="Havale/EFT aktif" defaultChecked />
        </Card>

        <Card title="Bildirimler">
          <Toggle label="Yeni sipariş e-postası" defaultChecked />
          <Toggle label="Stok azaldı uyarısı" defaultChecked />
          <Toggle label="Haftalık satış raporu" />
        </Card>

        <Card title="Görünüm">
          <Field label="Para birimi" defaultValue="TRY (₺)" />
          <Field label="Dil" defaultValue="Türkçe" />
          <Toggle label="Bakım modu" />
        </Card>

        <div className="lg:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft"
          >
            Değişiklikleri Kaydet
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">
              ✓ Ayarlar kaydedildi
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-brand"
      />
    </label>
  );
}

function Toggle({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-border accent-brand"
      />
    </label>
  );
}
