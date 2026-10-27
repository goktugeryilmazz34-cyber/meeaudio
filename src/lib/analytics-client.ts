"use client";

import { collectClientContext } from "@/lib/device-hints";
import { createClient } from "@/lib/supabase/client";

const SESSION_KEY = "meeaudio:session-id";

function sessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(input: {
  eventType:
    | "page_view"
    | "product_view"
    | "add_to_cart"
    | "begin_checkout"
    | "purchase";
  path?: string;
  productSlug?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ctx = collectClientContext();
    await supabase.from("analytics_events").insert({
      event_type: input.eventType,
      session_id: sessionId(),
      user_id: user?.id ?? null,
      path: input.path ?? null,
      product_slug: input.productSlug ?? null,
      metadata: {
        ...input.metadata,
        device: ctx.device,
        referrer: ctx.referrer,
        viewport: ctx.viewport,
      },
    });
  } catch {
    // Analitik hatası alışverişi engellemesin
  }
}
