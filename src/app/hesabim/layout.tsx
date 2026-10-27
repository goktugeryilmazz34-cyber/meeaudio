"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

const nav = [
  { href: "/hesabim", label: "Genel Bakış", icon: "🏠" },
  { href: "/hesabim/siparislerim", label: "Siparişlerim", icon: "📦" },
  { href: "/hesabim/kuponlarim", label: "Kuponlarım", icon: "🎟️" },
  { href: "/hesabim/favorilerim", label: "Favorilerim", icon: "❤️" },
  { href: "/hesabim/adreslerim", label: "Adreslerim", icon: "📍" },
  { href: "/hesabim/ayarlar", label: "Hesap Ayarları", icon: "⚙️" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/giris");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        Yükleniyor…
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/hesabim") return pathname === "/hesabim";
    return pathname.startsWith(href);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-background">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Merhaba, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut().then(() => router.push("/"))}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-danger hover:text-danger"
        >
          Çıkış Yap
        </button>
      </header>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="mb-6 lg:mb-0">
          <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1.5">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand text-background shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-base transition ${
                      active
                        ? "bg-background/20"
                        : "bg-muted group-hover:bg-background"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
