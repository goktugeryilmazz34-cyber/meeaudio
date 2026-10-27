"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Hesap Ayarları</h2>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card title="Kişisel Bilgiler">
          <Field label="Ad Soyad" defaultValue={user?.name ?? ""} />
          <Field label="E-posta" defaultValue={user?.email ?? ""} type="email" />
          <Field label="Telefon" placeholder="0500 000 00 00" />
          <Field label="Doğum Tarihi" type="date" />
        </Card>

        <Card title="Şifre Değiştir">
          <Field label="Mevcut şifre" type="password" placeholder="••••••••" />
          <Field label="Yeni şifre" type="password" placeholder="••••••••" />
          <Field
            label="Yeni şifre tekrar"
            type="password"
            placeholder="••••••••"
          />
        </Card>

        <Card title="Bildirim Tercihleri">
          <Toggle label="Kampanya e-postaları" defaultChecked />
          <Toggle label="Sipariş bildirimleri" defaultChecked />
          <Toggle label="SMS bildirimleri" />
        </Card>

        <Card title="Gizlilik">
          <Toggle label="Kişiselleştirilmiş öneriler" defaultChecked />
          <Toggle label="Üçüncü taraf paylaşımı" />
        </Card>

        <div className="lg:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft"
          >
            Bilgilerimi Güncelle
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">
              ✓ Değişiklikler kaydedildi
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border p-5">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
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
