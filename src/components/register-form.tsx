"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "./auth-provider";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthMeta = [
  { label: "Çok zayıf", color: "#dc2626" },
  { label: "Zayıf", color: "#f59e0b" },
  { label: "Orta", color: "#eab308" },
  { label: "İyi", color: "#84cc16" },
  { label: "Güçlü", color: "#15803d" },
];

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => passwordScore(password), [password]);

  function validate() {
    const next: Errors = {};
    if (!name.trim()) next.name = "Ad soyad gerekli.";
    else if (name.trim().length < 3) next.name = "En az 3 karakter girin.";

    if (!email) next.email = "E-posta gerekli.";
    else if (!emailRegex.test(email)) next.email = "Geçerli bir e-posta gir.";

    if (!password) next.password = "Şifre gerekli.";
    else if (password.length < 8) next.password = "En az 8 karakter olmalı.";

    if (!confirm) next.confirm = "Şifreyi tekrar gir.";
    else if (confirm !== password) next.confirm = "Şifreler eşleşmiyor.";

    if (!terms) next.terms = "Koşulları kabul etmelisin.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({ name, email, password });
      router.push("/hesabim");
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

      <Field
        id="name"
        label="Ad Soyad"
        type="text"
        autoComplete="name"
        value={name}
        onChange={setName}
        placeholder="Adınız Soyadınız"
        error={errors.name}
      />

      <Field
        id="email"
        label="E-posta"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="ornek@eposta.com"
        error={errors.email}
      />

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Şifre
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
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

        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{
                    background:
                      i < score
                        ? strengthMeta[score].color
                        : "var(--border)",
                  }}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Şifre gücü:{" "}
              <span style={{ color: strengthMeta[score].color }}>
                {strengthMeta[score].label}
              </span>
            </p>
          </div>
        )}
        {errors.password && (
          <p className="mt-1.5 text-xs text-danger">{errors.password}</p>
        )}
      </div>

      <Field
        id="confirm"
        label="Şifre Tekrar"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
        placeholder="Şifreyi tekrar gir"
        error={errors.confirm}
      />

      <div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span>
            <Link href="#" className="font-medium text-brand hover:underline">
              Kullanım Koşulları
            </Link>{" "}
            ve{" "}
            <Link href="#" className="font-medium text-brand hover:underline">
              Gizlilik Politikası
            </Link>
            &apos;nı okudum, kabul ediyorum.
          </span>
        </label>
        {errors.terms && (
          <p className="mt-1.5 text-xs text-danger">{errors.terms}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-brand-soft disabled:opacity-60"
      >
        {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-semibold text-brand hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-brand ${
          error ? "border-danger" : "border-border"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
