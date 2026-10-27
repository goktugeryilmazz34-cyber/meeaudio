import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCampaignBySlug, fetchCampaigns } from "@/lib/db/catalog";
import { SmartImage } from "@/components/smart-image";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/kampanyalar/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const campaign = await fetchCampaignBySlug(slug);
  if (!campaign) return { title: "Kampanya bulunamadı" };
  return { title: campaign.title, description: campaign.subtitle };
}

export default async function CampaignDetailPage(
  props: PageProps<"/kampanyalar/[slug]">,
) {
  const { slug } = await props.params;
  const campaign = await fetchCampaignBySlug(slug);
  if (!campaign) notFound();

  const all = await fetchCampaigns();

  return (
    <div>
      <header className="relative flex min-h-[320px] items-end overflow-hidden">
        <SmartImage
          src={campaign.image}
          alt={campaign.title}
          gradient={campaign.gradient}
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-0"
          style={{ background: campaign.gradient, opacity: 0.75 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 text-white">
          <nav className="mb-4 text-sm text-white/70">
            <Link href="/kampanyalar">Kampanyalar</Link>
            <span> / {campaign.title}</span>
          </nav>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {campaign.badge}
          </span>
          <h1 className="mt-3 text-4xl font-extrabold">{campaign.title}</h1>
          <p className="mt-2 max-w-xl text-white/90">{campaign.subtitle}</p>
          {campaign.code && (
            <p className="mt-4 font-mono text-lg font-bold">Kod: {campaign.code}</p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-muted-foreground">{campaign.description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Geçerlilik: {campaign.validUntil} · {campaign.discountLabel}
        </p>
        {campaign.categorySlug && (
          <Link
            href={`/kategoriler/${campaign.categorySlug}`}
            className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background"
          >
            İlgili kategoriye git
          </Link>
        )}

        {all.length > 1 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold">Diğer kampanyalar</h2>
            <ul className="mt-4 space-y-2">
              {all
                .filter((c) => c.slug !== campaign.slug)
                .map((c) => (
                  <li key={c.slug}>
                    <Link href={`/kampanyalar/${c.slug}`} className="text-brand hover:underline">
                      {c.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
