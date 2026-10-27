"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/admin/charts";
import { formatPrice } from "@/lib/format";
import {
  STATUS_STYLES,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { createClient } from "@/lib/supabase/client";
import { computeOrderStats } from "@/lib/orders";

const STATUSES: (OrderStatus | "Tümü")[] = [
  "Tümü",
  "Hazırlanıyor",
  "Kargoya verildi",
  "Teslim edildi",
  "İptal edildi",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "Tümü">("Tümü");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, order_items(*)")
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
            status: row.status as OrderStatus,
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
  }, []);

  const stats = useMemo(() => computeOrderStats(orders), [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => (status === "Tümü" ? true : o.status === status)).filter(
      (o) =>
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q),
    );
  }, [orders, query, status]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">Siparişler</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam" value={String(stats.totalOrders)} icon="🧾" accent />
        <StatCard label="Ciro" value={formatPrice(stats.revenue)} icon="💰" />
        <StatCard label="Teslim" value={String(stats.delivered)} icon="✅" />
        <StatCard label="Ort. Sepet" value={formatPrice(stats.avgOrderValue)} icon="🛒" />
      </div>
      {/* filters + table same as before */}
      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Sipariş</th>
              <th className="px-4 py-3">Müşteri</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3 text-right">Tutar</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3">
                  <div>{o.customerName}</div>
                  <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                </td>
                <td className="px-4 py-3">{formatDate(o.date)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">Sipariş bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
