import type { Faq, Testimonial } from "./types";

/** Statik site içeriği — katalog verisi Supabase'den gelir. */

export const testimonials: Testimonial[] = [
  {
    name: "Elif Yıldız",
    role: "Doğrulanmış müşteri",
    avatar: "/images/avatars/elif.jpg",
    rating: 5,
    text: "Siparişim hızlı geldi, ürün kalitesi beklentimin üzerindeydi. MeeAudio artık favori mağazam!",
  },
  {
    name: "Mert Demir",
    role: "Doğrulanmış müşteri",
    avatar: "/images/avatars/mert.jpg",
    rating: 5,
    text: "Fiyat/performans harika. Paketleme özenliydi, destek ekibi de çok ilgili.",
  },
  {
    name: "Zeynep Kaya",
    role: "Doğrulanmış müşteri",
    avatar: "/images/avatars/zeynep.jpg",
    rating: 5,
    text: "Kampanya kodları ve iade süreci çok kolay. Kesinlikle tavsiye ederim.",
  },
];

export const faqs: Faq[] = [
  {
    question: "Kargo ne kadar sürer?",
    answer:
      "Stoktan aynı gün kargo; Türkiye geneli 1–3 iş günü içinde teslimat yapılır.",
  },
  {
    question: "İade nasıl yapılır?",
    answer:
      "14 gün içinde ücretsiz iade. Hesabım > Siparişlerim üzerinden iade talebi oluşturabilirsin.",
  },
  {
    question: "Hangi ödeme yöntemleri var?",
    answer:
      "Kredi/banka kartı, kapıda ödeme ve havale/EFT. Seçili kartlarda taksit imkânı sunulur.",
  },
  {
    question: "Kampanya kodlarını nasıl kullanırım?",
    answer:
      "Ödeme adımındaki indirim kodu alanına kodu girip uygula demen yeterli.",
  },
];
