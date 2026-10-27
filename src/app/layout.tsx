import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { SiteChrome } from "@/components/site-chrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MeeAudio — Takı, Teknoloji ve Ses Ürünleri",
    template: "%s | MeeAudio",
  },
  description:
    "MeeAudio; takı, teknolojik aksesuar, kulaklık, hoparlör ve akıllı saat gibi ürünleri uygun fiyatlarla sunan e-ticaret mağazası.",
  keywords: [
    "meeaudio",
    "kulaklık",
    "hoparlör",
    "takı",
    "teknolojik aksesuar",
    "akıllı saat",
    "e-ticaret",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
