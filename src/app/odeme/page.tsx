"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { CartOrderSummary } from "@/components/cart-order-summary";
import { CheckoutFlipCard } from "@/components/checkout-flip-card";
import { CheckoutSteps } from "@/components/checkout-steps";
import { useCart } from "@/components/cart-provider";
import { trackEvent } from "@/lib/analytics-client";
import type { PaymentMethod } from "@/lib/orders";
import { placeOrder } from "./actions";

const PAYMENTS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "Kredi Kartı", label: "Kredi / Banka Kartı", icon: "💳" },
  { id: "Kapıda Ödeme", label: "Kapıda ödeme", icon: "🚪" },
  { id: "Havale/EFT", label: "Havale / EFT", icon: "🏦" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { detailed, total, clear, count } = useCart();
  const [mounted, setMounted] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("Kredi Kartı");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    trackEvent({ eventType: "begin_checkout", path: "/odeme" });
  }, []);

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setEmail((e) => e || user.email);
    }
  }, [user]);

  const lines = useMemo(
    () =>
      detailed.map(({ product, qty }) => ({
        slug: product.slug,
        name: product.name,
        emoji: product.emoji,
        qty,
        price: product.price,
      })),
    [detailed],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!lines.length) {
      router.push("/sepet");
      return;
    }

    if (payment === "Kredi Kartı") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 16 || cvv.length < 3 || !expiry.includes("/")) {
        setError("Kart bilgilerini kontrol edin.");
        return;
      }
    }

    if (!address.trim() || !city.trim() || !phone.trim()) {
      setError("Teslimat adresi ve telefon zorunludur.");
      return;
    }

    setLoading(true);
    const result = await placeOrder({
      customerName: name,
      customerEmail: email,
      payment,
      lines,
      total,
    });
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    await trackEvent({
      eventType: "purchase",
      path: "/odeme",
      metadata: { orderId: result.orderId, total, itemCount: count },
    });

    clear();
    setSuccessId(result.orderId);
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (successId) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="checkout-success-pop relative">
          <span className="text-7xl" aria-hidden>
            ✅
          </span>
          <div className="confetti-burst pointer-events-none absolute inset-0" aria-hidden />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
          Siparişiniz alındı!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sipariş numaranız:{" "}
          <span className="font-mono font-bold text-foreground">{successId}</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Onay e-postası <strong>{email}</strong> adresine gönderilecek (demo).
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/hesabim/siparislerim"
            className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-background hover:bg-brand-soft"
          >
            Siparişlerim
          </Link>
          <Link
            href="/urunler"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
          >
            Alışverişe devam
          </Link>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">Ödeme için sepetinizde ürün olmalı.</p>
        <Link
          href="/sepet"
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-background"
        >
          Sepete dön
        </Link>
      </div>
    );
  }

  return (
    <div className="relative border-b border-border bg-gradient-to-b from-muted/50 via-background to-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Güvenli ödeme
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ödeme
        </h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-muted-foreground">
          {["256-bit SSL", "3D Secure", "PCI uyumlu altyapı", "MeeAudio güvencesi"].map(
            (t) => (
              <span key={t} className="rounded-full border border-border bg-background/80 px-3 py-1">
                {t}
              </span>
            ),
          )}
        </div>
        <div className="mt-6">
          <CheckoutSteps step={2} />
        </div>
      </div>

      <form
        id="checkout-form"
        onSubmit={onSubmit}
        className="grid gap-8 pb-24 xl:grid-cols-[1fr_400px] xl:items-start lg:pb-0"
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-border p-5 sm:p-6 animate-fade-up">
            <h2 className="text-lg font-bold">İletişim & teslimat</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Ad Soyad" value={name} onChange={setName} required />
              <Field
                label="E-posta"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
              <Field
                label="Telefon"
                type="tel"
                value={phone}
                onChange={setPhone}
                required
                className="sm:col-span-2"
              />
              <Field
                label="Adres"
                value={address}
                onChange={setAddress}
                required
                className="sm:col-span-2"
              />
              <Field label="İl" value={city} onChange={setCity} required />
            </div>
          </section>

          <section className="rounded-2xl border border-border p-5 sm:p-6 animate-fade-up [animation-delay:80ms]">
            <h2 className="text-lg font-bold">Ödeme yöntemi</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayment(p.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                    payment === p.id
                      ? "border-brand bg-brand/5 shadow-md ring-2 ring-brand/20"
                      : "border-border hover:border-brand/40 hover:bg-muted/50"
                  }`}
                >
                  <span className="mr-2">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>

            {payment === "Kredi Kartı" && (
              <div className="mt-8 xl:col-span-2">
                <CheckoutFlipCard
                  holderName={cardName || name}
                  onHolderNameChange={setCardName}
                  cardNumber={cardNumber}
                  onCardNumberChange={setCardNumber}
                  expiry={expiry}
                  onExpiryChange={setExpiry}
                  cvv={cvv}
                  onCvvChange={setCvv}
                />
              </div>
            )}

            {payment === "Kapıda Ödeme" && (
              <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                Siparişiniz kapınıza geldiğinde nakit veya kart ile ödeme yapabilirsiniz.
              </p>
            )}

            {payment === "Havale/EFT" && (
              <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                IBAN: TR00 0000 0000 0000 0000 0000 00 — Açıklama: sipariş numaranız
                (sipariş sonrası gösterilir).
              </p>
            )}
          </section>

          {error && (
            <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-28 space-y-4">
            <CartOrderSummary
              ctaLabel={loading ? "İşleniyor…" : "Siparişi tamamla"}
              ctaType="submit"
              ctaLoading={loading}
              ctaDisabled={loading}
              showCoupon={false}
            />
          </div>
        </div>
      </form>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur xl:hidden">
        <button
          type="submit"
          form="checkout-form"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-background disabled:opacity-50"
        >
          {loading ? "İşleniyor…" : "Siparişi tamamla"}
        </button>
      </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
