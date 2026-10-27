import { fetchAnalyticsInsights } from "@/lib/db/analytics-insights";
import { fetchAnalyticsSummary } from "@/lib/db/analytics";

export default async function AdminAnalyticsPage() {
  const [summary, insights] = await Promise.all([
    fetchAnalyticsSummary(30),
    fetchAnalyticsInsights(30),
  ]);

  const deviceTotal = insights.devices.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Analitik</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Son 30 gün · ziyaretçi, cihaz, sayfa ve kaynak linkleri
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Ziyaretçi", summary.visitors],
          ["Sayfa görüntüleme", summary.pageViews],
          ["Sepete ekleme", summary.addToCart],
          ["Satın alma", summary.purchases],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="text-lg font-bold">Cihaz türleri</h2>
          <ul className="mt-4 space-y-3">
            {insights.devices.map((d) => (
              <li key={d.device}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium capitalize">{d.device}</span>
                  <span className="text-muted-foreground">
                    {d.count} · {Math.round((d.count / deviceTotal) * 100)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(d.count / deviceTotal) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            {!insights.devices.length && (
              <p className="text-sm text-muted-foreground">Henüz veri yok.</p>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="text-lg font-bold">Kaynak linkler (referrer)</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {insights.topReferrers.map((r) => (
              <li key={r.referrer} className="flex justify-between gap-2 border-b border-border/60 py-2">
                <span className="truncate font-medium">{r.referrer}</span>
                <span className="shrink-0 text-muted-foreground">{r.count}</span>
              </li>
            ))}
            {!insights.topReferrers.length && (
              <p className="text-muted-foreground">Doğrudan girişler ağırlıkta.</p>
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="text-lg font-bold">En çok ziyaret edilen sayfalar</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Yol</th>
                <th className="py-2 text-right">Görüntüleme</th>
              </tr>
            </thead>
            <tbody>
              {insights.topPaths.map((p) => (
                <tr key={p.path} className="border-t border-border">
                  <td className="py-2.5 font-mono text-xs">{p.path}</td>
                  <td className="py-2.5 text-right font-semibold">{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
