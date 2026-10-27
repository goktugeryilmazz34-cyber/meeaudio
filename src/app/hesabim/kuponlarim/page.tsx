"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const WON_KEY = "meeaudio:wheel-won";

type Coupon = {
  code: string;
  title: string;
  discount: string;
  validUntil: string;
  gradient: string;
  source: string;
};

export default function MyCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const base: Coupon[] = [];

    createClient()
      .from("campaigns")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        const rows = (data ?? []) as Record<string, unknown>[];
        for (const c of rows) {
          if (!c.code) continue;
          base.push({
            code: c.code as string,
            title: c.title as string,
            discount: c.discount_label as string,
            validUntil: c.valid_until as string,
            gradient: c.gradient as string,
            source: "Kampanya",
          });
        }

        try {
          const raw = localStorage.getItem(WON_KEY);
          if (raw) {
            const prize = JSON.parse(raw) as {
              label: string;
              code: string | null;
            };
            if (prize.code) {
              base.unshift({
                code: prize.code,
                title: "Çarkıfelek Ödülü",
                discount: prize.label,
                validUntil: "30 gün geçerli",
                gradient: "linear-gradient(135deg, #0a0a0a 0%, #e4572e 100%)",
                source: "Çark",
              });
            }
          }
        } catch {
          // yoksay
        }

        setCoupons([...base]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Kuponlarım</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {coupons.map((c) => (
          <CouponCard key={c.code} coupon={c} />
        ))}
      </div>

      <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
        İpucu: Sağ alttaki çarkıfeleği çevirerek sana özel indirim kuponları
        kazanabilirsin. 🎯
      </p>
    </div>
  );
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="p-5 text-background" style={{ background: coupon.gradient }}>
        <span className="rounded-full bg-background/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
          {coupon.source}
        </span>
        <p className="mt-3 text-2xl font-extrabold">{coupon.discount}</p>
        <p className="text-sm text-background/80">{coupon.title}</p>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="font-mono text-lg font-bold tracking-wider">
            {coupon.code}
          </p>
          <p className="text-xs text-muted-foreground">{coupon.validUntil}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-background transition hover:bg-brand-soft"
        >
          {copied ? "Kopyalandı ✓" : "Kopyala"}
        </button>
      </div>
    </div>
  );
}
