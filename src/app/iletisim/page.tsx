import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "İletişim",
  description: "MeeAudio ile iletişime geçin. Soru, öneri ve talepleriniz için buradayız.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          İletişim
        </h1>
        <p className="mt-2 text-muted-foreground">
          Aklına takılan her şey için buradayız. Sana yardımcı olmaktan mutluluk
          duyarız.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* İletişim bilgileri */}
        <div className="space-y-4">
          {[
            ["📧", "E-posta", "destek@meeaudio.com", "7/24 yanıt veriyoruz"],
            ["📞", "Telefon", "0850 000 00 00", "Hafta içi 09:00 - 18:00"],
            ["💬", "Canlı Destek", "Web sitesi üzerinden", "Hafta içi 09:00 - 22:00"],
            ["📍", "Adres", "Maslak, İstanbul", "Türkiye"],
          ].map(([icon, title, value, note]) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-border p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
                {icon}
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm">{value}</p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-brand p-6 text-background">
            <p className="font-semibold">Sıkça Sorulan Sorular</p>
            <p className="mt-1.5 text-sm text-background/80">
              Kargo, iade ve siparişlerle ilgili pek çok sorunun yanıtı hazır.
              Çoğu sorun anında çözülür.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-border p-6 sm:p-8">
          <h2 className="text-xl font-bold">Bize Yazın</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Formu doldur, en kısa sürede dönüş yapalım.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
