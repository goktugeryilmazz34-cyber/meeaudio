import Link from "next/link";
import { Logo } from "./logo";

const highlights = [
  ["🚚", "Ücretsiz ve hızlı kargo"],
  ["🔒", "Güvenli ödeme altyapısı"],
  ["↩️", "14 gün koşulsuz iade"],
  ["🎁", "Üyelere özel kampanyalar"],
];

export function AuthShell({
  title,
  subtitle,
  children,
  side,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  side: { heading: string; text: string };
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-stretch gap-0 px-4 py-8 lg:grid-cols-2 lg:gap-10">
      {/* Form tarafı */}
      <div className="flex items-center justify-center py-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Marka tarafı */}
      <div className="relative hidden overflow-hidden rounded-3xl bg-brand p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(228,87,46,0.35), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)" }}
        />
        <Link href="/" className="relative">
          <span className="text-2xl font-extrabold tracking-tight">
            mee<span className="font-light">audio</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">{side.heading}</h2>
          <p className="mt-3 max-w-sm text-background/70">{side.text}</p>

          <ul className="mt-8 space-y-3">
            {highlights.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-lg">
                  {icon}
                </span>
                <span className="text-sm text-background/90">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-background/50">
          © {new Date().getFullYear()} MeeAudio
        </p>
      </div>
    </div>
  );
}
