# MeeAudio — E-Ticaret Mağazası

Takı, teknolojik aksesuar, kulaklık, hoparlör ve akıllı saat gibi karışık
ürünler satan, kendi e-ticaret sitesi (pazaryeri değil). Next.js 16 (App
Router), TypeScript ve Tailwind CSS v4 ile geliştirildi.

## Özellikler

- **Profesyonel tasarım**: Beyaz zemin–siyah yazı marka kimliği, modern ve
  responsive arayüz.
- **Header**: Anasayfa, Hakkımızda, Ürünlerimiz, Kategoriler (dropdown),
  Kampanyalar, İletişim + sağ tarafta Giriş Yap / Kayıt Ol. Arama kutusu ve
  mobil menü dahil.
- **Sağlam giriş/kayıt sayfaları**: Form validasyonu, şifre göster/gizle, şifre
  gücü göstergesi, hata ve yükleniyor durumları, sosyal giriş düğmeleri.
- **Sayfalar**: Anasayfa, Ürünler (filtre + sıralama + arama), Ürün detayı,
  Kategoriler ve kategori detayı, Kampanyalar ve kampanya detayı, Hakkımızda,
  İletişim, Hesabım.

## Kurulum & Çalıştırma

`.env.local` dosyasında `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY`
tanımlı olmalı (örnek: `.env.example`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi
npm start        # üretim sunucusu
```

### Demo hesaplar (Supabase Auth)

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | `admin@meeaudio.com` | `Admin1234!` |
| Kullanıcı | `kullanici@meeaudio.com` | `User1234!` |

Sepet: `/sepet` · Ödeme: `/odeme`

## Proje Yapısı

```
src/
├─ app/                # Sayfalar (App Router)
│  ├─ page.tsx         # Anasayfa
│  ├─ hakkimizda/
│  ├─ urunler/         # + [slug] ürün detayı
│  ├─ kategoriler/     # + [slug] kategori detayı
│  ├─ kampanyalar/     # + [slug] kampanya detayı
│  ├─ iletisim/
│  ├─ giris/           # Giriş Yap
│  ├─ kayit/           # Kayıt Ol
│  └─ hesabim/
├─ components/         # Header, Footer, kartlar, formlar, auth provider
└─ lib/
   ├─ data.ts          # Mock ürün/kategori/kampanya verisi
   ├─ auth.ts          # Kimlik doğrulama katmanı (şimdilik localStorage)
   ├─ types.ts
   └─ format.ts        # Para birimi (₺) biçimlendirme
```

## Veri ve Kimlik Doğrulama

Şu an ürün/kategori/kampanya verileri `src/lib/data.ts` içinde **mock** olarak
tutuluyor. Kullanıcı kaydı/girişi ise `src/lib/auth.ts` üzerinden tarayıcının
`localStorage`'ında saklanıyor.

### Supabase'e Geçiş

Gerçek bir veritabanı ve kimlik doğrulama için:

1. Bir Supabase projesi oluştur ve `.env.local` dosyasına ekle:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

2. `@supabase/supabase-js` paketini kur.
3. Yalnızca `src/lib/auth.ts` içindeki `signUp`, `signIn`, `signOut`,
   `getSession` fonksiyonlarının gövdelerini Supabase çağrılarıyla değiştir.
   Arayüz aynı kaldığı için sayfalarda değişiklik gerekmez (dosyanın başındaki
   açıklamaya bakın).
4. Ürünleri de Supabase'e taşımak için `src/lib/data.ts` yardımcı
   fonksiyonlarını Supabase sorgularıyla değiştirebilirsin.
