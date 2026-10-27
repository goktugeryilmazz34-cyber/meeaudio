"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./auth-provider";
import { isAdmin } from "@/lib/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email) next.email = "E-posta gerekli.";
    else if (!emailRegex.test(email)) next.email = "Geçerli bir e-posta gir.";
    if (!password) next.password = "Şifre gerekli.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signIn({ email, password });
      router.push(isAdmin(user) ? "/admin" : "/hesabim");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span aria-hidden>⚠️</span>
          <span>{formError}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@eposta.com"
          aria-invalid={!!errors.email}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-brand ${
            errors.email ? "border-danger" : "border-border"
          }`}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-danger">{errors.email}</p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium">
            Şifre
          </label>
          <Link
            href="#"
            className="text-xs font-medium text-muted-foreground hover:text-brand"
          >
            Şifremi unuttum
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition focus:border-brand ${
              errors.password ? "border-danger" : "border-border"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-brand"
          >
            {showPassword ? "Gizle" : "Göster"}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-danger">{errors.password}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" className="h-4 w-4 rounded border-border" />
        Beni hatırla
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-brand-soft disabled:opacity-60"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        veya
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="Google" />
        <SocialButton label="Apple" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-brand hover:underline">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-medium transition hover:border-brand hover:bg-muted"
    >
      {label} ile
    </button>
  );
}
