"use client";

import { useEffect, useState } from "react";

type Prize = { label: string; code: string | null; color: string };

const prizes: Prize[] = [
  { label: "%10 İndirim", code: "CARK10", color: "#0a0a0a" },
  { label: "Ücretsiz Kargo", code: "KARGOBED", color: "#e4572e" },
  { label: "%15 İndirim", code: "CARK15", color: "#1f1f1f" },
  { label: "Yeniden Dene", code: null, color: "#c2421f" },
  { label: "%5 İndirim", code: "CARK5", color: "#0a0a0a" },
  { label: "250₺ Kupon", code: "CARK250", color: "#e4572e" },
  { label: "%20 İndirim", code: "CARK20", color: "#1f1f1f" },
  { label: "Hediye 🎁", code: "SURPRIZ", color: "#c2421f" },
];

const SEG = 360 / prizes.length;
const WON_KEY = "meeaudio:wheel-won";

function buildConic(): string {
  const stops = prizes
    .map((p, i) => `${p.color} ${i * SEG}deg ${(i + 1) * SEG}deg`)
    .join(", ");
  return `conic-gradient(${stops})`;
}

export function SpinWheel() {
  const [open, setOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [alreadyWon, setAlreadyWon] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WON_KEY);
      if (raw) {
        const won = JSON.parse(raw) as Prize;
        setResult(won);
        setAlreadyWon(true);
      }
    } catch {
      /* yoksay */
    }
  }, []);

  function spin() {
    if (spinning || alreadyWon) return;
    setSpinning(true);
    setResult(null);

    const index = Math.floor(Math.random() * prizes.length);
    const segCenter = index * SEG + SEG / 2;
    const target = 360 * 6 + (360 - segCenter);
    // mevcut tam turların üzerine ekle ki her zaman ileri dönsün
    const base = Math.ceil(rotation / 360) * 360;
    const next = base + target;
    setRotation(next);

    setTimeout(() => {
      const prize = prizes[index];
      setResult(prize);
      setSpinning(false);
      if (prize.code) {
        setAlreadyWon(true);
        try {
          localStorage.setItem(WON_KEY, JSON.stringify(prize));
        } catch {
          /* yoksay */
        }
      }
    }, 4400);
  }

  return (
    <>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="animate-pop-in relative w-full max-w-md overflow-hidden rounded-3xl bg-background p-6 text-center shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
            >
              ✕
            </button>

            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              🎁 Şans Çarkı
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
              Çevir, Kazan!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Çarkı çevir, sana özel indirim kuponunu anında kap.
            </p>

            {/* Çark */}
            <div className="relative mx-auto mt-6 h-[280px] w-[280px]">
              {/* İbre */}
              <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
                <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-accent drop-shadow" />
              </div>

              <div
                className="absolute inset-0 rounded-full border-[6px] border-brand shadow-xl"
                style={{
                  background: buildConic(),
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? "transform 4.3s cubic-bezier(0.12, 0.75, 0.1, 1)"
                    : "none",
                }}
              >
                {prizes.map((p, i) => (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${i * SEG + SEG / 2}deg)` }}
                  >
                    <span className="absolute left-1/2 top-4 max-w-[88px] -translate-x-1/2 text-center text-[11px] font-bold leading-tight text-white">
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Merkez */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-brand text-xl text-background shadow-lg">
                🎯
              </div>
            </div>

            {/* Sonuç / Aksiyon */}
            <div className="mt-6">
              {result ? (
                result.code ? (
                  <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
                    <p className="text-sm font-semibold text-success">
                      🎉 Tebrikler! <strong>{result.label}</strong> kazandın.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <code className="rounded-lg border border-dashed border-success/50 bg-background px-4 py-2 font-mono text-lg font-bold tracking-wider">
                        {result.code}
                      </code>
                      <CopyButton code={result.code} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Kodu sepette kullanabilirsin. İyi alışverişler!
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-sm font-medium">
                      Bu sefer olmadı 😅 Yarın tekrar deneyebilirsin!
                    </p>
                    <button
                      type="button"
                      onClick={() => setResult(null)}
                      className="mt-3 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-background transition hover:bg-brand-soft"
                    >
                      Tekrar Çevir
                    </button>
                  </div>
                )
              ) : (
                <button
                  type="button"
                  onClick={spin}
                  disabled={spinning || alreadyWon}
                  className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
                >
                  {spinning
                    ? "Çevriliyor..."
                    : alreadyWon
                      ? "Bugünkü hakkını kullandın"
                      : "ÇARKI ÇEVİR 🎡"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tetik düğmesi */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Şans çarkını aç"
        className="animate-float fixed bottom-4 left-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white shadow-xl transition hover:scale-105 hover:bg-accent-dark"
      >
        🎁
      </button>
    </>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-background transition hover:bg-brand-soft"
    >
      {copied ? "Kopyalandı ✓" : "Kopyala"}
    </button>
  );
}
