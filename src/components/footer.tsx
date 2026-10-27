"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { useCategories } from "@/hooks/use-categories";

export function Footer() {
  const categories = useCategories();
  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Takıdan teknolojik aksesuarlara, hoparlörden akıllı saatlere;
              hayatını kolaylaştıran ve güzelleştiren ürünler tek adreste.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialLink label="Instagram" href="#">
                IG
              </SocialLink>
              <SocialLink label="X" href="#">
                X
              </SocialLink>
              <SocialLink label="YouTube" href="#">
                YT
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Kategoriler</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategoriler/${cat.slug}`}
                    className="transition hover:text-brand"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Kurumsal</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/hakkimizda" className="transition hover:text-brand">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/kampanyalar" className="transition hover:text-brand">
                  Kampanyalar
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="transition hover:text-brand">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/urunler" className="transition hover:text-brand">
                  Tüm Ürünler
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Bültene Katıl</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Kampanya ve yeni ürünlerden ilk sen haberdar ol.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                required
                placeholder="E-posta adresin"
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-brand-soft"
              >
                Katıl
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MeeAudio. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="#" className="transition hover:text-brand">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="transition hover:text-brand">
              Kullanım Koşulları
            </Link>
            <Link href="#" className="transition hover:text-brand">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-xs font-bold transition hover:border-brand hover:bg-brand hover:text-background"
    >
      {children}
    </a>
  );
}
