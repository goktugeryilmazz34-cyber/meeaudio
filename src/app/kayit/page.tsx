import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "MeeAudio'ya üye ol, fırsatları kaçırma.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Aramıza katıl 🚀"
      subtitle="Saniyeler içinde hesabını oluştur, fırsatlardan ilk sen yararlan."
      side={{
        heading: "MeeAudio ailesine hoş geldin",
        text: "Üye ol, ilk alışverişine özel 250₺ indirim kazan ve binlerce ürünü keşfet.",
      }}
    >
      <RegisterForm />
    </AuthShell>
  );
}
