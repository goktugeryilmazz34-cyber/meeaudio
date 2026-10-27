"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { isAdmin } from "@/lib/auth";

const navGroups = [
  {
    title: "Genel",
    items: [
      { href: "/admin", label: "Genel Bakış", icon: "📊" },
      { href: "/admin/analitik", label: "Analitik", icon: "📈" },
      { href: "/admin/siparisler", label: "Siparişler", icon: "🧾" },
    ],
  },
  {
    title: "Katalog",
    items: [
      { href: "/admin/urunler", label: "Ürünler", icon: "📦" },
      { href: "/admin/kategoriler", label: "Kategoriler", icon: "🗂️" },
      { href: "/admin/kampanyalar", label: "Kampanyalar", icon: "🔥" },
      { href: "/admin/indirim-kodlari", label: "İndirim Kodları", icon: "🏷️" },
    ],
  },
  {
    title: "Finans & Müşteri",
    items: [
      { href: "/admin/muhasebe", label: "Muhasebe", icon: "💰" },
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "👥" },
    ],
  },
  {
    title: "Sistem",
    items: [{ href: "/admin/ayarlar", label: "Ayarlar", icon: "⚙️" }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Yükleniyor…
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    const loggedInNonAdmin = !!user && !isAdmin(user);
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-border p-8 text-center">
          <span className="text-4xl">🔒</span>
          <h1 className="mt-4 text-2xl font-extrabold">Admin Paneli</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loggedInNonAdmin
              ? "Bu hesabın admin yetkisi yok. Lütfen admin hesabıyla giriş yap."
              : "Bu alanı görüntülemek için admin hesabıyla giriş yapman gerekiyor."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {loggedInNonAdmin ? (
              <button
                type="button"
                onClick={() => signOut().then(() => router.push("/giris"))}
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft"
              >
                Admin Olarak Giriş Yap
              </button>
            ) : (
              <Link
                href="/giris"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft"
              >
                Giriş Yap
              </Link>
            )}
            <Link
              href="/"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Anasayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-muted/30 lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="border-b border-border bg-background lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-background">
            <span className="flex items-end gap-[2px]">
              <span className="block h-2 w-[3px] rounded-full bg-background" />
              <span className="block h-4 w-[3px] rounded-full bg-background" />
              <span className="block h-3 w-[3px] rounded-full bg-background" />
            </span>
          </span>
          <span className="font-extrabold tracking-tight">
            mee<span className="font-light">audio</span>
          </span>
          <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
            Admin
          </span>
        </div>

        <nav className="no-scrollbar flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:p-4">
          {navGroups.map((group) => (
            <div key={group.title} className="contents lg:block">
              <p className="hidden px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:block">
                {group.title}
              </p>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium transition ${
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
            </div>
          ))}
        </nav>
      </aside>

      {/* İçerik */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-5 backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            ← Siteye Dön
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-background">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => signOut().then(() => router.push("/"))}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-danger hover:text-danger"
            >
              Çıkış
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
