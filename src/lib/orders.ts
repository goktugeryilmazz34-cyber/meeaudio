export type OrderStatus =
  | "Hazırlanıyor"
  | "Kargoya verildi"
  | "Teslim edildi"
  | "İptal edildi";

export type PaymentMethod = "Kredi Kartı" | "Kapıda Ödeme" | "Havale/EFT";

export type OrderItem = {
  slug: string;
  name: string;
  emoji: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment: PaymentMethod;
};

export type OrderStats = {
  totalOrders: number;
  revenue: number;
  delivered: number;
  pending: number;
  cancelled: number;
  avgOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  paymentCounts: Record<PaymentMethod, number>;
  monthly: { label: string; value: number }[];
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  Hazırlanıyor: "bg-amber-100 text-amber-700",
  "Kargoya verildi": "bg-blue-100 text-blue-700",
  "Teslim edildi": "bg-green-100 text-green-700",
  "İptal edildi": "bg-red-100 text-red-700",
};

export function computeOrderStats(orders: Order[]): OrderStats {
  const valid = orders.filter((o) => o.status !== "İptal edildi");
  const revenue = orders
    .filter((o) => o.status !== "İptal edildi")
    .reduce((s, o) => s + o.total, 0);

  const statusCounts = {
    Hazırlanıyor: 0,
    "Kargoya verildi": 0,
    "Teslim edildi": 0,
    "İptal edildi": 0,
  } as Record<OrderStatus, number>;
  const paymentCounts = {
    "Kredi Kartı": 0,
    "Kapıda Ödeme": 0,
    "Havale/EFT": 0,
  } as Record<PaymentMethod, number>;

  for (const o of orders) {
    statusCounts[o.status]++;
    paymentCounts[o.payment]++;
  }

  const monthNames = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
  ];
  const monthlyMap = new Map<number, number>();
  for (const o of orders) {
    if (o.status === "İptal edildi") continue;
    const m = new Date(o.date).getMonth();
    monthlyMap.set(m, (monthlyMap.get(m) ?? 0) + o.total);
  }
  const monthly = Array.from({ length: 6 }, (_, m) => ({
    label: monthNames[m],
    value: monthlyMap.get(m) ?? 0,
  }));

  return {
    totalOrders: orders.length,
    revenue,
    delivered: statusCounts["Teslim edildi"],
    pending: statusCounts["Hazırlanıyor"] + statusCounts["Kargoya verildi"],
    cancelled: statusCounts["İptal edildi"],
    avgOrderValue: valid.length ? revenue / valid.length : 0,
    statusCounts,
    paymentCounts,
    monthly,
  };
}
