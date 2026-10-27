"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { seedCategories, withCatalogFallback } from "@/lib/seed-catalog";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("slug, name, description, icon, gradient, image")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setCategories(
            withCatalogFallback(data as Category[], seedCategories),
          );
        } else {
          setCategories(seedCategories);
        }
      });
  }, []);

  return categories;
}
