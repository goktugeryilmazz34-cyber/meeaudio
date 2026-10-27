import { createClient } from "@/lib/supabase/server";

export type AnalyticsSummary = {
  visitors: number;
  pageViews: number;
  productViews: number;
  addToCart: number;
  beginCheckout: number;
  purchases: number;
  addToCartRate: number;
  checkoutRate: number;
  topProducts: { slug: string; views: number; addToCart: number }[];
};

export async function fetchAnalyticsSummary(
  days = 30,
): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_type, session_id, product_slug")
    .gte("created_at", sinceIso);

  if (error) throw error;

  const rows = data ?? [];
  const sessions = new Set<string>();
  let pageViews = 0;
  let productViews = 0;
  let addToCart = 0;
  let beginCheckout = 0;
  let purchases = 0;

  const productMap = new Map<string, { views: number; addToCart: number }>();

  for (const row of rows) {
    if (row.session_id) sessions.add(row.session_id);
    switch (row.event_type) {
      case "page_view":
        pageViews++;
        break;
      case "product_view":
        productViews++;
        if (row.product_slug) {
          const cur = productMap.get(row.product_slug) ?? {
            views: 0,
            addToCart: 0,
          };
          cur.views++;
          productMap.set(row.product_slug, cur);
        }
        break;
      case "add_to_cart":
        addToCart++;
        if (row.product_slug) {
          const cur = productMap.get(row.product_slug) ?? {
            views: 0,
            addToCart: 0,
          };
          cur.addToCart++;
          productMap.set(row.product_slug, cur);
        }
        break;
      case "begin_checkout":
        beginCheckout++;
        break;
      case "purchase":
        purchases++;
        break;
      default:
        break;
    }
  }

  const visitors = sessions.size;
  const addToCartRate =
    productViews > 0 ? Math.round((addToCart / productViews) * 1000) / 10 : 0;
  const checkoutRate =
    addToCart > 0 ? Math.round((beginCheckout / addToCart) * 1000) / 10 : 0;

  const topProducts = [...productMap.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return {
    visitors,
    pageViews,
    productViews,
    addToCart,
    beginCheckout,
    purchases,
    addToCartRate,
    checkoutRate,
    topProducts,
  };
}
