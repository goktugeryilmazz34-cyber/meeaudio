import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "MeeAudio'nun hikayesi, değerleri ve misyonu. Kaliteli ürünleri uygun fiyatlarla sunan e-ticaret mağazası.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium">
            Hakkımızda
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Teknoloji ve şıklığı{" "}
            <span className="text-accent">herkes için</span> erişilebilir kılıyoruz
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            MeeAudio, takıdan teknolojik aksesuara, hoparlörden akıllı saate
            kadar geniş bir ürün yelpazesini; uygun fiyat, kaliteli hizmet ve
            güvenli alışveriş deneyimiyle bir araya getiren bir e-ticaret
            mağazasıdır.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["10.000+", "Mutlu müşteri", "Türkiye'nin dört bir yanında"],
            ["500+", "Farklı ürün", "Sürekli genişleyen katalog"],
            ["4.8 / 5", "Memnuniyet puanı", "Binlerce değerlendirme"],
          ].map(([n, t, d]) => (
            <div
              key={t}
              className="rounded-3xl border border-border p-8 text-center"
            >
              <p className="text-4xl font-extrabold">{n}</p>
              <p className="mt-2 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-brand p-10 text-background">
            <h2 className="text-2xl font-bold">Misyonumuz</h2>
            <p className="mt-4 text-background/80">
              Kaliteli ürünleri herkesin bütçesine uygun fiyatlarla sunmak ve
              alışverişi mümkün olduğunca kolay, güvenli ve keyifli hale
              getirmek. Müşterilerimizin hayatını kolaylaştıran ürünleri tek bir
              çatı altında topluyoruz.
            </p>
          </div>
          <div className="rounded-3xl border border-border p-10">
            <h2 className="text-2xl font-bold">Vizyonumuz</h2>
            <p className="mt-4 text-muted-foreground">
              Türkiye&apos;nin en sevilen ve en çok güvenilen çok kategorili
              e-ticaret markası olmak. Yenilikçi ürünler, dürüst fiyatlandırma ve
              kusursuz müşteri deneyimiyle sektörde standartları yükseltmek.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-2xl font-extrabold tracking-tight">Değerlerimiz</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["✅", "Kalite", "Her ürünü titizlikle seçer, kalitesinden ödün vermeyiz."],
            ["💎", "Şeffaflık", "Gizli maliyet yok; dürüst ve net fiyatlandırma."],
            ["⚡", "Hız", "Siparişlerini en hızlı şekilde kapına ulaştırırız."],
            ["🤝", "Güven", "Güvenli ödeme ve kolay iade ile içiniz rahat olsun."],
          ].map(([icon, t, d]) => (
            <div key={t} className="rounded-2xl border border-border p-6">
              <span className="text-3xl">{icon}</span>
              <h3 className="mt-3 font-bold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border bg-muted/40 p-10 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold">Alışverişe hazır mısın?</h2>
            <p className="mt-2 text-muted-foreground">
              Binlerce ürün ve özel kampanyalar seni bekliyor.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/urunler"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background transition hover:bg-brand-soft"
            >
              Ürünleri Keşfet
            </Link>
            <Link
              href="/kayit"
              className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:border-brand"
            >
              Üye Ol
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
