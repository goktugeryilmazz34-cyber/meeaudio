import Link from "next/link";
import type { Metadata } from "next";
import { fetchCampaigns } from "@/lib/db/catalog";
import { SmartImage } from "@/components/smart-image";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "MeeAudio'nun güncel kampanyaları ve indirim fırsatları.",
};

export default async function CampaignsPage() {
  const campaigns = await fetchCampaigns();
  const [hero, ...rest] = campaigns;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
          🔥 Fırsatlar
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tüm Kampanyalar
        </h1>
        <p className="mt-2 text-muted-foreground">
          MeeAudio&apos;ya özel indirim ve fırsatların tamamı burada.
        </p>
      </header>

      {campaigns.length === 0 ? (
        <p className="rounded-2xl border py-16 text-center text-muted-foreground">
          Henüz aktif kampanya yok.
        </p>
      ) : (
        <>
          {hero && (
            <Reveal className="mb-10">
              <Link
                href={`/kampanyalar/${hero.slug}`}
                className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white"
              >
                <SmartImage
                  src={hero.image}
                  alt={hero.title}
                  gradient={hero.gradient}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="relative rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {hero.badge}
                </span>
                <h2 className="relative mt-3 text-3xl font-extrabold">{hero.title}</h2>
                <p className="relative text-white/90">{hero.subtitle}</p>
              </Link>
            </Reveal>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {rest.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60} href={`/kampanyalar/${c.slug}`} className="group overflow-hidden rounded-2xl border">
                <div className="relative h-44">
                  <SmartImage src={c.image} alt={c.title} gradient={c.gradient} className="h-full w-full" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold group-hover:text-brand">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
