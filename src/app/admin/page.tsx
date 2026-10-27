import Link from "next/link";
import { StatCard } from "@/components/admin/charts";
import { fetchAnalyticsSummary } from "@/lib/db/analytics";
import { fetchCategories, fetchProducts } from "@/lib/db/catalog";
import { fetchAllOrders } from "@/lib/db/orders";
import { computeOrderStats } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { STATUS_STYLES } from "@/lib/orders";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [products, categories, orders, analytics, profilesRes] =
    await Promise.all([
      fetchProducts(false),
      fetchCategories(),
      fetchAllOrders(),
      fetchAnalyticsSummary(30),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

  const oStats = computeOrderStats(orders);
  const recentOrders = orders.slice(0, 6);
  const userCount = profilesRes.count ?? 0;

  const stockValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Genel Bakış</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Canlı mağaza verileri, analitik ve sipariş özeti (son 30 gün).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Ziyaretçi" value={String(analytics.visitors)} sub="Benzersiz oturum" icon="👁️" accent />
        <StatCard label="Sayfa Görüntüleme" value={String(analytics.pageViews)} sub="Toplam" icon="📄" />
        <StatCard label="Ürün Tıklama" value={String(analytics.productViews)} sub="Ürün detay" icon="🖱️" />
        <StatCard label="Sepete Ekleme" value={String(analytics.addToCart)} sub={`%${analytics.addToCartRate} dönüşüm`} icon="🛒" />
        <StatCard label="Ödemeye Geçiş" value={String(analytics.beginCheckout)} sub={`%${analytics.checkoutRate} sepetten`} icon="💳" />
        <StatCard label="Ciro" value={formatPrice(oStats.revenue)} sub={`${oStats.totalOrders} sipariş`} icon="💰" />
        <StatCard label="Ürün / Kategori" value={`${products.length} / ${categories.length}`} sub={`${userCount} kullanıcı`} icon="📦" />
        <StatCard label="Stok Değeri" value={formatPrice(stockValue)} sub={`${totalStock} adet • ${lowStock} düşük stok`} icon="📊" />
      </div>

      {analytics.topProducts.length > 0 && (
        <section className="rounded-2xl border border-border bg-background p-5">
          <h2 className="mb-4 font-bold">En Çok Tıklanan Ürünler</h2>
          <ul className="divide-y divide-border text-sm">
            {analytics.topProducts.map((p) => (
              <li key={p.slug} className="flex justify-between py-2">
                <Link href={`/urunler/${p.slug}`} className="font-medium hover:text-brand">
                  {p.slug}
                </Link>
                <span className="text-muted-foreground">
                  {p.views} görüntüleme · {p.addToCart} sepete ekleme
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Son Siparişler</h2>
          <Link href="/admin/siparisler" className="text-sm font-semibold text-brand">
            Tümü →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz sipariş yok.</p>
        ) : (
          <table className="w-full min-w-[560px] text-sm">
            <tbody className="divide-y divide-border">
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="py-2 pr-4 font-semibold">{o.id}</td>
                  <td className="py-2 pr-4">{o.customerName}</td>
                  <td className="py-2 pr-4 text-right">{formatPrice(o.total)}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
