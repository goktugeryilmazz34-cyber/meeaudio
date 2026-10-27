"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { formatPrice } from "@/lib/format";
import { STATUS_STYLES, type Order } from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";

const WON_KEY = "meeaudio:wheel-won";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AccountOverview() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wonCount, setWonCount] = useState(0);

  useEffect(() => {
    try {
      setWonCount(localStorage.getItem(WON_KEY) ? 1 : 0);
    } catch {
      setWonCount(0);
    }
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    createClient()
      .from("orders")
      .select("*, order_items(*)")
      .ilike("customer_email", user.email.trim())
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setOrders(
          data.map((row) => ({
            id: row.id as string,
            customerName: row.customer_name as string,
            customerEmail: row.customer_email as string,
            date: row.created_at as string,
            total: Number(row.total),
            status: row.status as Order["status"],
            payment: row.payment as Order["payment"],
            items: ((row.order_items as Record<string, unknown>[]) ?? []).map(
              (it) => ({
                slug: it.product_slug as string,
                name: it.product_name as string,
                emoji: it.emoji as string,
                qty: it.qty as number,
                price: Number(it.unit_price),
              }),
            ),
          })),
        );
      });
  }, [user?.email]);

  const totalSpent = orders
    .filter((o) => o.status !== "İptal edildi")
    .reduce((s, o) => s + o.total, 0);
  const activeOrders = orders.filter(
    (o) => o.status === "Hazırlanıyor" || o.status === "Kargoya verildi",
  ).length;

  // Mevcut kampanya kuponları + çark kuponu
  const couponCount = 3 + wonCount;

  const summary = [
    { icon: "📦", label: "Toplam Sipariş", value: String(orders.length) },
    { icon: "🚚", label: "Aktif Sipariş", value: String(activeOrders) },
    { icon: "🎟️", label: "Kuponlarım", value: String(couponCount) },
    { icon: "💸", label: "Toplam Harcama", value: formatPrice(totalSpent) },
  ];

  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className="mt-3 text-2xl font-extrabold tracking-tight">
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Son Siparişlerim</h2>
          <Link
            href="/hesabim/siparislerim"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Tümünü gör →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Henüz siparişin yok.{" "}
            <Link href="/urunler" className="font-semibold text-brand">
              Alışverişe başla
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-3">
                <div className="flex items-center gap-1">
                  {o.items.map((it) => (
                    <span key={it.slug} className="text-xl">
                      {it.emoji}
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(o.date)}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(o.total)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}
                >
                  {o.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["🎟️", "Kuponlarım", "İndirim kodların", "/hesabim/kuponlarim"],
          ["❤️", "Favorilerim", "Beğendiğin ürünler", "/hesabim/favorilerim"],
          ["📍", "Adreslerim", "Teslimat adreslerin", "/hesabim/adreslerim"],
        ].map(([icon, title, desc, href]) => (
          <Link
            key={title}
            href={href}
            className="rounded-2xl border border-border p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-2xl">{icon}</span>
            <h3 className="mt-2 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
