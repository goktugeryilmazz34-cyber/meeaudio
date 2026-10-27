"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { useCategories } from "@/hooks/use-categories";
import { useAuth } from "./auth-provider";
import { useCart } from "./cart-provider";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/urunler", label: "Ürünlerimiz" },
];

export function Header() {
  const categories = useCategories();
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { count } = useCart();

  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [query, setQuery] = useState("");

  const catRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    setUserMenu(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/urunler?q=${encodeURIComponent(q)}` : "/urunler");
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Üst bilgi şeridi */}
      <div className="bg-brand text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
          <span aria-hidden>🚚</span>
          <span>
            500₺ ve üzeri tüm siparişlerde <strong>ücretsiz kargo</strong> —
            Kampanya kodu:{" "}
            <span className="font-mono font-semibold text-accent">HOSGELDIN250</span>
          </span>
        </div>
      </div>

      {/* Ana header */}
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-label="Menüyü aç/kapat"
            aria-expanded={mobileOpen}
          >
            <BurgerIcon open={mobileOpen} />
          </button>

          <Logo />

          {/* Arama */}
          <form
            onSubmit={onSearch}
            className="ml-2 hidden flex-1 items-center md:flex"
          >
            <div className="flex w-full items-center gap-2 rounded-full border border-border bg-muted px-4 py-2.5 focus-within:border-brand focus-within:bg-background">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Ürün, marka veya kategori ara..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Sağ aksiyonlar */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/sepet"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-brand hover:bg-muted"
              aria-label={`Sepet, ${count} ürün`}
            >
              <CartIcon className="h-5 w-5" />
              {count > 0 && (
                <span className="cart-badge-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 transition hover:border-brand"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-background">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/hesabim"
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      >
                        Hesabım
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        >
                          📊 Admin Paneli
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-muted"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="hidden rounded-full px-4 py-2 text-sm font-medium transition hover:bg-muted sm:inline-flex"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-background transition hover:bg-brand-soft"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigasyon (masaüstü) */}
        <nav className="mx-auto hidden max-w-7xl items-center gap-1 px-4 pb-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-muted text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-brand"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Kategoriler dropdown */}
          <div ref={catRef} className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname.startsWith("/kategoriler")
                  ? "bg-muted text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-brand"
              }`}
              aria-expanded={catOpen}
            >
              Kategoriler
              <ChevronDown
                className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`}
              />
            </button>
            {catOpen && (
              <div className="absolute left-0 mt-2 w-[560px] overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/kategoriler/${cat.slug}`}
                      className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-muted"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                        style={{ background: cat.gradient }}
                      >
                        {cat.icon}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">
                          {cat.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {cat.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/kategoriler"
                  className="mt-1 block rounded-xl bg-muted px-4 py-2.5 text-center text-sm font-medium hover:bg-border"
                >
                  Tüm kategorileri gör →
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/kampanyalar"
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive("/kampanyalar")
                ? "bg-accent/10 text-accent"
                : "text-accent hover:bg-accent/10"
            }`}
          >
            <span aria-hidden>🔥</span> Kampanyalar
          </Link>

          <Link
            href="/iletisim"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive("/iletisim")
                ? "bg-muted text-brand"
                : "text-muted-foreground hover:bg-muted hover:text-brand"
            }`}
          >
            İletişim
          </Link>
        </nav>
      </div>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className="border-b border-border bg-background lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <form onSubmit={onSearch} className="mb-2">
              <div className="flex w-full items-center gap-2 rounded-full border border-border bg-muted px-4 py-2.5">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Ara..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                Kategoriler
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1 space-y-0.5 pl-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategoriler/${cat.slug}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span aria-hidden>{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </details>
            <Link
              href="/kampanyalar"
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent/10"
            >
              🔥 Kampanyalar
            </Link>
            <Link
              href="/iletisim"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              İletişim
            </Link>
            {!user && (
              <Link
                href="/giris"
                className="mt-2 block rounded-lg border border-border px-3 py-2.5 text-center text-sm font-medium hover:bg-muted sm:hidden"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 6h15l-1.5 9h-12L6 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 6 5 3H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
