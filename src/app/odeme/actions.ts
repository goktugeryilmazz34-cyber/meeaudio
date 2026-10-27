"use server";

import type { PaymentMethod } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";

export type CheckoutLine = {
  slug: string;
  name: string;
  emoji: string;
  qty: number;
  price: number;
};

export async function placeOrder(input: {
  customerName: string;
  customerEmail: string;
  payment: PaymentMethod;
  lines: CheckoutLine[];
  total: number;
}): Promise<{ orderId: string } | { error: string }> {
  const lines = input.lines.filter((l) => l.qty > 0);
  if (!lines.length) {
    return { error: "Sepetiniz boş." };
  }

  const name = input.customerName.trim();
  const email = input.customerEmail.trim().toLowerCase();
  if (!name || !email.includes("@")) {
    return { error: "Geçerli ad ve e-posta girin." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const orderId = `MEE-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  const { error: orderErr } = await supabase.from("orders").insert({
    id: orderId,
    user_id: user?.id ?? null,
    customer_name: name,
    customer_email: email,
    total: input.total,
    status: "Hazırlanıyor",
    payment: input.payment,
  });

  if (orderErr) {
    return { error: orderErr.message };
  }

  const { error: itemsErr } = await supabase.from("order_items").insert(
    lines.map((l) => ({
      order_id: orderId,
      product_slug: l.slug,
      product_name: l.name,
      emoji: l.emoji,
      qty: l.qty,
      unit_price: l.price,
    })),
  );

  if (itemsErr) {
    return { error: itemsErr.message };
  }

  return { orderId };
}
