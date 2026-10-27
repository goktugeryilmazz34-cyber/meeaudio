"use client";

import { useId, useState } from "react";
import { CardBrandLogo } from "./card-brand-logo";

type Props = {
  holderName: string;
  onHolderNameChange: (v: string) => void;
  cardNumber: string;
  onCardNumberChange: (v: string) => void;
  expiry: string;
  onExpiryChange: (v: string) => void;
  cvv: string;
  onCvvChange: (v: string) => void;
};

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function cardBrand(digits: string) {
  if (digits.startsWith("4")) return "VISA";
  if (/^5[1-5]/.test(digits)) return "MC";
  if (digits.startsWith("9792")) return "TROY";
  return "CARD";
}

export function CheckoutFlipCard({
  holderName,
  onHolderNameChange,
  cardNumber,
  onCardNumberChange,
  expiry,
  onExpiryChange,
  cvv,
  onCvvChange,
}: Props) {
  const [flipped, setFlipped] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const cvvId = useId();

  const digits = cardNumber.replace(/\D/g, "");
  const displayNumber =
    formatCardNumber(cardNumber).padEnd(19, "•") || "•••• •••• •••• ••••";

  return (
    <div className="checkout-card-scene mx-auto w-full max-w-[420px]">
      <div
        className={`checkout-card-inner relative aspect-[1.586/1] w-full transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${flipped ? "checkout-card-flipped" : ""}`}
      >
        {/* Ön yüz */}
        <div className="checkout-card-face absolute inset-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2d2d2d] p-6 text-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] sm:p-7">
          <div className="card-shine pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative flex items-start justify-between gap-3">
            <CardBrandLogo />
            <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wider backdrop-blur">
              {cardBrand(digits)}
            </span>
          </div>

          <div className="relative mt-6 flex items-center gap-3">
            <div
              className="h-9 w-12 rounded-md bg-gradient-to-br from-[#d4af37] via-[#f5e6a8] to-[#c9a227] shadow-md"
              aria-hidden
            />
            <div className="h-6 flex-1 rounded bg-white/5" aria-hidden />
          </div>

          <p
            className={`relative mt-7 font-mono text-xl tracking-[0.22em] transition-all sm:text-2xl ${
              focused === "number" ? "scale-[1.02] text-white" : "text-white/95"
            }`}
          >
            {displayNumber}
          </p>

          <div className="relative mt-6 flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/45">
                Kart sahibi
              </p>
              <p className="truncate text-sm font-semibold uppercase tracking-wide">
                {holderName.trim() || "AD SOYAD"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/45">
                SKT
              </p>
              <p className="font-mono text-base">{expiry || "MM/YY"}</p>
            </div>
          </div>

          <div
            className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-accent/25 blur-3xl"
            aria-hidden
          />
        </div>

        {/* Arka yüz */}
        <div className="checkout-card-face checkout-card-back absolute inset-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-[#141414] to-[#0a0a0a] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)]">
          <div className="mt-7 h-12 w-full bg-black/50" />
          <div className="px-6 pt-5 sm:px-7">
            <div className="flex items-center justify-between">
              <CardBrandLogo className="scale-90 opacity-80" />
              <p className="text-[10px] text-white/40">Güvenli ödeme</p>
            </div>
            <label htmlFor={cvvId} className="mt-5 block text-[10px] uppercase tracking-widest text-white/45">
              CVV / CVC
            </label>
            <div className="mt-1.5 rounded-lg bg-white px-4 py-2.5 text-right font-mono text-xl tracking-[0.35em] text-brand">
              {cvv.replace(/\D/g, "").replace(/./g, "•") || "•••"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div
          className={`rounded-2xl border bg-background/80 p-4 backdrop-blur transition ${focused === "number" ? "border-brand shadow-md" : "border-border"}`}
        >
          <label className="text-xs font-semibold text-muted-foreground">
            Kart numarası
          </label>
          <input
            value={formatCardNumber(cardNumber)}
            onChange={(e) =>
              onCardNumberChange(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
            onFocus={() => setFocused("number")}
            onBlur={() => setFocused(null)}
            className="mt-1.5 w-full bg-transparent font-mono text-lg outline-none"
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
          />
        </div>

        <div
          className={`rounded-2xl border bg-background/80 p-4 backdrop-blur transition ${focused === "name" ? "border-brand shadow-md" : "border-border"}`}
        >
          <label className="text-xs font-semibold text-muted-foreground">
            Kart üzerindeki isim
          </label>
          <input
            value={holderName}
            onChange={(e) => onHolderNameChange(e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            className="mt-1.5 w-full bg-transparent text-base uppercase outline-none"
            placeholder="Ad Soyad"
            autoComplete="cc-name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/80 p-4 backdrop-blur">
            <label className="text-xs font-semibold text-muted-foreground">
              Son kullanma
            </label>
            <input
              value={expiry}
              onChange={(e) => onExpiryChange(formatExpiry(e.target.value))}
              className="mt-1.5 w-full bg-transparent font-mono outline-none"
              placeholder="MM/YY"
              inputMode="numeric"
              autoComplete="cc-exp"
            />
          </div>
          <div
            className={`rounded-2xl border bg-background/80 p-4 backdrop-blur transition ${focused === "cvv" ? "border-brand shadow-md" : "border-border"}`}
          >
            <label htmlFor={cvvId} className="text-xs font-semibold text-muted-foreground">
              CVV
            </label>
            <input
              id={cvvId}
              value={cvv}
              onChange={(e) =>
                onCvvChange(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              onFocus={() => {
                setFocused("cvv");
                setFlipped(true);
              }}
              onBlur={() => {
                setFocused(null);
                setFlipped(false);
              }}
              className="mt-1.5 w-full bg-transparent font-mono outline-none"
              placeholder="•••"
              inputMode="numeric"
              autoComplete="cc-csc"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
