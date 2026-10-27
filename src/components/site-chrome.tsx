"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { Chatbot } from "./chatbot";
import { SpinWheel } from "./spin-wheel";
import { BrandIntro } from "./brand-intro";
import { AnalyticsTracker } from "./analytics-tracker";
import { CartCelebration } from "./cart-celebration";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <BrandIntro />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
      <SpinWheel />
      <CartCelebration />
      <AnalyticsTracker />
    </>
  );
}
