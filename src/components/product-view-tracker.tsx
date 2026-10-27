"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics-client";

export function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent({
      eventType: "product_view",
      productSlug: slug,
      path: `/urunler/${slug}`,
    });
  }, [slug]);

  return null;
}
