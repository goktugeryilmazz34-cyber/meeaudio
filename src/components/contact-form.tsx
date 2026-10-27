"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Mock gönderim — gerçek sistemde burada bir API/Supabase çağrısı olur.
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    e.currentTarget.reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad Soyad" name="name" placeholder="Adınız Soyadınız" required />
        <Field
          label="E-posta"
          name="email"
          type="email"
          placeholder="ornek@eposta.com"
          required
        />
      </div>
      <Field label="Konu" name="subject" placeholder="Mesajınızın konusu" required />
      <div>
        <label className="mb-1.5 block text-sm font-medium">Mesajınız</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Bize iletmek istediklerinizi yazın..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft disabled:opacity-60"
      >
        {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
      {sent && (
        <p className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          ✓ Mesajınız alındı! En kısa sürede size dönüş yapacağız.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
      />
    </div>
  );
}
