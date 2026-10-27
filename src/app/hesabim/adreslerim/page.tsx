"use client";

import { useState } from "react";

type Address = {
  id: string;
  title: string;
  name: string;
  phone: string;
  line: string;
  city: string;
  isDefault?: boolean;
};

const initialAddresses: Address[] = [
  {
    id: "a1",
    title: "Ev",
    name: "Demo Kullanıcı",
    phone: "0532 000 00 00",
    line: "Bağdat Cad. No:123 D:5, Kadıköy",
    city: "İstanbul",
    isDefault: true,
  },
  {
    id: "a2",
    title: "İş",
    name: "Demo Kullanıcı",
    phone: "0212 000 00 00",
    line: "Levent Plaza Kat:8, Beşiktaş",
    city: "İstanbul",
  },
];

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  function makeDefault(id: string) {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight">Adreslerim</h2>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
        >
          + Yeni Adres
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-border py-16 text-center text-sm text-muted-foreground">
          Kayıtlı adresin yok.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-bold">{a.title}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    Varsayılan
                  </span>
                )}
              </div>
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.phone}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {a.line}, {a.city}
              </p>
              <div className="mt-4 flex gap-2">
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => makeDefault(a.id)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                  >
                    Varsayılan yap
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-danger hover:text-danger"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
