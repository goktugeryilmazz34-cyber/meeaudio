import { BarChart, DonutChart, StatCard } from "@/components/admin/charts";
import { fetchAllOrders } from "@/lib/db/orders";
import { computeOrderStats } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export default async function AdminAccountingPage() {
  const orders = await fetchAllOrders();
  const stats = computeOrderStats(orders);
  const revenue = stats.revenue;

  const cogs = Math.round(revenue * 0.62);
  const shipping = stats.totalOrders * 45;
  const marketing = Math.round(revenue * 0.08);
  const operations = orders.length > 0 ? 18000 : 0;
  const totalExpenses = cogs + shipping + marketing + operations;
  const netProfit = revenue - totalExpenses;
  const margin = revenue ? (netProfit / revenue) * 100 : 0;

  const expenseRows = [
    { label: "Mal maliyeti (COGS)", value: cogs, icon: "📦" },
    { label: "Kargo & lojistik", value: shipping, icon: "🚚" },
    { label: "Pazarlama", value: marketing, icon: "📣" },
    { label: "Operasyon & sabit", value: operations, icon: "🏢" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Muhasebe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Supabase sipariş verilerine dayalı gelir/gider özeti.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam Gelir" value={formatPrice(revenue)} sub="İptal hariç" icon="💰" accent />
        <StatCard label="Toplam Gider" value={formatPrice(totalExpenses)} icon="📉" />
        <StatCard label="Net Kâr" value={formatPrice(netProfit)} sub={`%${margin.toFixed(1)} marj`} icon="📈" />
        <StatCard label="Ort. Sepet" value={formatPrice(stats.avgOrderValue)} icon="🛒" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Aylık Gelir">
          <BarChart data={stats.monthly.map((m) => ({ label: m.label, value: m.value }))} formatValue={(v) => formatPrice(v)} />
        </Panel>
        <Panel title="Ödeme Yöntemi">
          <BarChart
            data={Object.entries(stats.paymentCounts).map(([label, value]) => ({ label, value }))}
            formatValue={(v) => `${v} sipariş`}
          />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      {children}
    </section>
  );
}
