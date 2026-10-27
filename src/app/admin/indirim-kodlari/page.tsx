import { createClient } from "@/lib/supabase/server";
import { DiscountCodesManager } from "@/components/admin/discount-codes-manager";

export default async function DiscountCodesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  const codes = (data ?? []).map((row) => ({
    id: row.id as string,
    code: row.code as string,
    label: row.label as string,
    discountType: row.discount_type as "percent" | "fixed",
    discountValue: Number(row.discount_value),
    minOrder: Number(row.min_order),
    validUntil: (row.valid_until as string) ?? undefined,
    isActive: row.is_active as boolean,
  }));

  return <DiscountCodesManager initial={codes} />;
}
