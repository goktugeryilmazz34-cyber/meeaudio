"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { formatPrice } from "@/lib/format";
import { STATUS_STYLES, type Order } from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    const supabase = createClient();
    supabase
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Siparişlerim</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">Henüz siparişin yok.</p>
          <Link href="/urunler" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <article key={o.id} className="rounded-2xl border border-border p-5">
              <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                <div>
                  <p className="font-extrabold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(o.date)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                  {o.status}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {o.items.map((it) => (
                  <li key={it.slug} className="flex items-center gap-3 py-3">
                    <span className="text-xl">{it.emoji}</span>
                    <Link href={`/urunler/${it.slug}`} className="flex-1 text-sm font-medium hover:text-brand">
                      {it.name}
                    </Link>
                    <span className="text-sm font-semibold">{formatPrice(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between pt-4 font-extrabold">
                <span>Toplam</span>
                <span>{formatPrice(o.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
