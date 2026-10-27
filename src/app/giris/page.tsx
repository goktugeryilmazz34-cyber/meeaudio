import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "MeeAudio hesabına giriş yap.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Tekrar hoş geldin 👋"
      subtitle="Hesabına giriş yap ve alışverişe kaldığın yerden devam et."
      side={{
        heading: "Alışverişin keyfini çıkar",
        text: "Hesabınla siparişlerini takip et, favorilerini kaydet ve sana özel kampanyalardan yararlan.",
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}
