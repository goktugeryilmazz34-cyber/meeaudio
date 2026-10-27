import type { Order, OrderItem, OrderStatus, PaymentMethod } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: OrderStatus;
  payment: PaymentMethod;
  created_at: string;
  order_items: {
    product_slug: string;
    product_name: string;
    emoji: string;
    qty: number;
    unit_price: number;
  }[];
};

function mapOrder(row: OrderRow): Order {
  const items: OrderItem[] = (row.order_items ?? []).map((it) => ({
    slug: it.product_slug,
    name: it.product_name,
    emoji: it.emoji,
    qty: it.qty,
    price: Number(it.unit_price),
  }));
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    date: row.created_at,
    items,
    total: Number(row.total),
    status: row.status,
    payment: row.payment,
  };
}

export async function fetchAllOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(mapOrder);
}

export async function fetchOrdersByEmail(email: string): Promise<Order[]> {
  const supabase = await createClient();
  const e = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .ilike("customer_email", e)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(mapOrder);
}
