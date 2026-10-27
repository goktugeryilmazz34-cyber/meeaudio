-- Müşterilerin kendi siparişlerini oluşturması (checkout)
create policy orders_insert_checkout on public.orders
  for insert
  to authenticated, anon
  with check (
    (auth.uid() is not null and user_id = auth.uid())
    or user_id is null
  );

create policy order_items_insert_checkout on public.order_items
  for insert
  to authenticated, anon
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          (auth.uid() is not null and o.user_id = auth.uid())
          or o.user_id is null
        )
    )
  );
