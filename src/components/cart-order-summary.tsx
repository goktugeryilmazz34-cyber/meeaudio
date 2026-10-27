"use client";

import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, useCart } from "./cart-provider";
import { formatPrice } from "@/lib/format";

type Props = {
  ctaHref?: string;
  ctaLabel?: string;
  onCta?: () => void;
  ctaType?: "button" | "submit";
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  showCoupon?: boolean;
};

export function CartOrderSummary({
  ctaHref,
  ctaLabel = "Ödemeye geç",
  onCta,
  ctaType = "button",
  ctaDisabled,
  ctaLoading,
  showCoupon = true,
}: Props) {
  const { subtotal, shipping, total, count } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const ctaClass =
    "flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-background transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="sticky top-28 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
      <div className="border-b border-border bg-muted/50 px-5 py-4">
        <h2 className="text-lg font-extrabold tracking-tight">Sipariş özeti</h2>
        <p className="text-xs text-muted-foreground">{count} ürün</p>
      </div>

      <div className="space-y-4 p-5">
        {showCoupon && (
          <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Kampanya kodu
            </p>
            <div className="mt-2 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="HOSGELDIN250"
                disabled
              />
              <button
                type="button"
                disabled
                className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                Yakında
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Ücretsiz kargo</span>
            <span>{formatPrice(FREE_SHIPPING_THRESHOLD)}+</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-brand transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {remaining > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Ücretsiz kargo için{" "}
              <strong className="text-foreground">{formatPrice(remaining)}</strong>{" "}
              daha ekleyin.
            </p>
          ) : (
            <p className="mt-2 text-xs font-semibold text-success">
              🎉 Ücretsiz kargo kazandınız!
            </p>
          )}
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Ara toplam</dt>
            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Kargo</dt>
            <dd className="font-semibold">
              {shipping === 0 ? (
                <span className="text-success">Ücretsiz</span>
              ) : (
                formatPrice(shipping)
              )}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base">
            <dt className="font-bold">Toplam</dt>
            <dd className="font-extrabold">{formatPrice(total)}</dd>
          </div>
        </dl>

        {onCta || ctaType === "submit" ? (
          <button
            type={ctaType}
            onClick={ctaType === "button" && onCta ? onCta : undefined}
            disabled={ctaDisabled || ctaLoading}
            className={ctaClass}
          >
            {ctaLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
            ) : null}
            {ctaLabel}
          </button>
        ) : ctaHref ? (
          <Link href={ctaHref} className={ctaClass}>
            {ctaLabel}
          </Link>
        ) : null}

        <p className="text-center text-[11px] text-muted-foreground">
          🔒 Güvenli ödeme · 14 gün iade garantisi
        </p>
      </div>
    </div>
  );
}
