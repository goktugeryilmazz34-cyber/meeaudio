import Link from "next/link";
import { ProductCard, Stars } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SmartImage } from "@/components/smart-image";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqs, testimonials } from "@/lib/data";
import {
  getCategoryProductCount,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/catalog-utils";
import {
  fetchCampaigns,
  fetchCategories,
  fetchProducts,
} from "@/lib/db/catalog";

export default async function HomePage() {
  const [categories, products, campaigns] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    fetchCampaigns(),
  ]);
  const featured = getFeaturedProducts(products);
  const fresh = getNewProducts(products);
  const heroCampaign = campaigns[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-3 rounded-full bg-brand px-4 py-2 text-background shadow-sm">
              <span className="flex items-center gap-1.5 text-sm font-bold">
                <span className="tracking-tight text-accent">★★★★★</span>
                4.8
              </span>
              <span className="h-4 w-px bg-background/25" />
              <span className="text-sm font-medium">
                10.000+ mutlu müşteri
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Aradığın her şey,{" "}
              <span className="relative whitespace-nowrap">
                tek adreste
                <span className="absolute -bottom-1 left-0 h-2 w-full bg-accent/30" />
              </span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Takıdan teknolojik aksesuara, hoparlörden akıllı saatlere binlerce
              ürün; uygun fiyat, hızlı kargo ve güvenli ödeme ile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft"
              >
                Alışverişe Başla
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/kampanyalar"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:border-brand"
              >
                🔥 Kampanyalar
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["10K+", "Mutlu müşteri"],
                ["500+", "Ürün çeşidi"],
                ["4.8", "Ortalama puan"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-extrabold">{n}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero görsel kartları */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {categories.slice(0, 4).map((cat, i) => (
                <Link
                  key={cat.slug}
                  href={`/kategoriler/${cat.slug}`}
                  className={`group relative flex h-52 flex-col justify-end overflow-hidden rounded-3xl p-5 text-white shadow-sm transition hover:shadow-xl ${
                    i % 2 === 0 ? "" : "translate-y-6"
                  }`}
                  style={{ background: cat.gradient }}
                >
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    emoji={cat.icon}
                    gradient={cat.gradient}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-2 text-7xl opacity-25 transition group-hover:opacity-40"
                  >
                    {cat.icon}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5" />
                  <span className="relative text-3xl drop-shadow-md">
                    {cat.icon}
                  </span>
                  <span className="relative mt-2">
                    <span className="block text-base font-bold drop-shadow">
                      {cat.name}
                    </span>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium opacity-90">
                      Keşfet
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo şeridi */}
      <section className="overflow-hidden border-b border-border bg-background py-7">
        <div className="relative flex">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 animate-marquee items-center gap-16 pr-16"
              aria-hidden={dup === 1}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-background animate-spin-slow">
                    <span className="flex items-end gap-[2px]">
                      <span className="block h-2 w-[3px] rounded-full bg-background" />
                      <span className="block h-4 w-[3px] rounded-full bg-background" />
                      <span className="block h-3 w-[3px] rounded-full bg-background" />
                    </span>
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight text-brand">
                    mee<span className="font-light">audio</span>
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Güven şeridi */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {[
            ["🚚", "Ücretsiz Kargo", "500₺ üzeri siparişlerde"],
            ["🔒", "Güvenli Ödeme", "256-bit SSL koruması"],
            ["↩️", "Kolay İade", "14 gün içinde ücretsiz"],
            ["💬", "7/24 Destek", "Her zaman yanındayız"],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="flex items-center gap-3 bg-background px-5 py-6"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategoriler */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          title="Kategorilere Göz At"
          subtitle="İhtiyacın olan her şey, derli toplu kategorilerde."
          href="/kategoriler"
          linkLabel="Tümü"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <Reveal
              key={cat.slug}
              delay={i * 70}
              href={`/kategoriler/${cat.slug}`}
              className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl p-4 text-white transition hover:-translate-y-1 hover:shadow-xl"
              style={{ background: cat.gradient }}
            >
              <SmartImage
                src={cat.image}
                alt={cat.name}
                gradient={cat.gradient}
                className="absolute inset-0 h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-110"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-1 -top-1 text-5xl opacity-25 transition group-hover:opacity-40"
              >
                {cat.icon}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5" />
              <span className="relative text-2xl drop-shadow-md">{cat.icon}</span>
              <span className="relative mt-1 text-sm font-semibold leading-tight">
                {cat.name}
              </span>
              <span className="relative text-xs text-white/70">
                {getCategoryProductCount(products, cat.slug)} ürün
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Çok satanlar */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHeading
          title="Çok Satanlar"
          subtitle="Müşterilerimizin en çok tercih ettiği ürünler."
          href="/urunler"
          linkLabel="Tüm ürünler"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kampanya bannerı */}
      {heroCampaign && (
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <Reveal>
          <Link
            href={`/kampanyalar/${heroCampaign.slug}`}
            className="group relative flex min-h-[280px] flex-col items-start justify-end overflow-hidden rounded-3xl p-8 text-white sm:p-12"
          >
            <SmartImage
              src={heroCampaign.image}
              alt={heroCampaign.title}
              gradient={heroCampaign.gradient}
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: heroCampaign.gradient, opacity: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="relative rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              {heroCampaign.badge}
            </span>
            <h3 className="relative mt-4 text-3xl font-extrabold sm:text-4xl">
              {heroCampaign.title}
            </h3>
            <p className="relative mt-2 max-w-md text-white/90">
              {heroCampaign.subtitle}
            </p>
            <span className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand">
              Fırsatları Gör →
            </span>
          </Link>
        </Reveal>
      </section>
      )}

      {/* Neden MeeAudio */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Neden MeeAudio?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Binlerce mutlu müşterinin bizi tercih etmesinin nedenleri.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["⚡", "Hızlı Teslimat", "Aynı gün kargo, 1-3 günde kapında."],
              ["💎", "Dürüst Fiyat", "Gizli maliyet yok, her zaman net fiyat."],
              ["🛡️", "Güvenli Alışveriş", "256-bit SSL ve 3D Secure ödeme."],
              ["🤝", "Gerçek Destek", "7/24 canlı destek ekibi yanında."],
            ].map(([icon, title, desc], i) => (
              <Reveal
                key={title}
                delay={i * 80}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                  {icon}
                </span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Yeni gelenler */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          title="Yeni Gelenler"
          subtitle="Vitrindeki en taze ürünler seni bekliyor."
          href="/urunler"
          linkLabel="Tümünü gör"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {fresh.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Müşteri yorumları */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Binlerce gerçek değerlendirme arasından bazıları.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 90}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <Stars rating={t.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  “{t.text}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <SmartImage
                    src={t.avatar}
                    alt={t.name}
                    emoji="🙂"
                    className="h-11 w-11 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Aklına takılanlar için hızlı yanıtlar.
          </p>
        </Reveal>
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* Bülten CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center text-background sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(228,87,46,0.4), transparent 70%)",
            }}
          />
          <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">
            Fırsatları kaçırma!
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-background/70">
            Bültenimize katıl, kampanya ve yeni ürünlerden ilk sen haberdar ol.
            Üstelik ilk alışverişine özel 250₺ indirim seni bekliyor.
          </p>
          <form className="relative mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="E-posta adresin"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-background outline-none placeholder:text-background/50 focus:border-white/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Katıl
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 whitespace-nowrap text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
