"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    createClient()
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setUsers((data as Profile[]) ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Kullanıcılar</h1>
      <p className="text-sm text-muted-foreground">
        Supabase Auth ile kayıtlı profiller ({users.length}).
      </p>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-brand text-background" : "bg-muted"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
