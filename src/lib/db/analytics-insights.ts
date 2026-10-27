import { createClient } from "@/lib/supabase/server";

export type AnalyticsInsights = {
  devices: { device: string; count: number }[];
  topPaths: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
};

export async function fetchAnalyticsInsights(days = 30): Promise<AnalyticsInsights> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("analytics_events")
    .select("path, metadata")
    .gte("created_at", since.toISOString());

  if (error) throw error;

  const deviceMap = new Map<string, number>();
  const pathMap = new Map<string, number>();
  const refMap = new Map<string, number>();

  for (const row of data ?? []) {
    const meta = (row.metadata as Record<string, unknown>) ?? {};
    const device = String(meta.device ?? "unknown");
    deviceMap.set(device, (deviceMap.get(device) ?? 0) + 1);

    const path = (row.path as string) || "/";
    pathMap.set(path, (pathMap.get(path) ?? 0) + 1);

    const ref = String(meta.referrer ?? "").trim();
    if (ref) {
      let host = ref;
      try {
        host = new URL(ref).host;
      } catch {
        host = ref.slice(0, 80);
      }
      refMap.set(host, (refMap.get(host) ?? 0) + 1);
    }
  }

  const sortDesc = (m: Map<string, number>) =>
    [...m.entries()]
      .map(([k, count]) => ({ ...(k.includes("/") ? { path: k } : { device: k, referrer: k }), count }))
      .sort((a, b) => b.count - a.count);

  return {
    devices: [...deviceMap.entries()]
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count),
    topPaths: [...pathMap.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    topReferrers: [...refMap.entries()]
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
  };
}
