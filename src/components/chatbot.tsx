"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { from: "bot" | "user"; text: string };

const quickReplies = [
  "Kargo ne zaman gelir?",
  "İade nasıl yapılır?",
  "Kampanyalar neler?",
  "Garanti var mı?",
];

function botReply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("kargo") || t.includes("teslim"))
    return "🚚 Saat 16:00'dan önceki siparişler aynı gün kargolanır, 1-3 iş gününde teslim edilir. 500₺ üzeri kargo ücretsiz!";
  if (t.includes("iade") || t.includes("değişim") || t.includes("geri"))
    return "↩️ 14 gün içinde koşulsuz iade hakkın var. Hesabım > Siparişlerim'den talep oluşturman yeterli, iade kargosu bizden.";
  if (t.includes("kampanya") || t.includes("indirim") || t.includes("kupon"))
    return "🔥 Şu an 'Yaz Sonu Fırsatları' ile %50'ye varan indirim var! Ayrıca çarkı çevirip ekstra kupon kazanabilirsin. Kampanyalar sayfasına göz at.";
  if (t.includes("garanti"))
    return "🛡️ Tüm elektronik ürünler en az 2 yıl resmi distribütör garantilidir.";
  if (t.includes("ödeme") || t.includes("taksit") || t.includes("kart"))
    return "💳 Kredi/banka kartı, kapıda ödeme ve havale ile ödeyebilirsin. Seçili kartlara 12 taksit imkanı var.";
  if (t.includes("merhaba") || t.includes("selam") || t.includes("iyi"))
    return "Merhaba! 👋 Sana nasıl yardımcı olabilirim? Kargo, iade, kampanya veya ürünler hakkında soru sorabilirsin.";
  return "Bunu tam anlayamadım 🤔 ama destek ekibimiz yardımcı olabilir: destek@meeaudio.com. Kargo, iade, kampanya ve garanti hakkında bana da sorabilirsin.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Merhaba! 👋 Ben MeeBot. Sana nasıl yardımcı olabilirim?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: botReply(value) }]);
      setTyping(false);
    }, 700);
  }

  return (
    <>
      {/* Pencere */}
      {open && (
        <div className="animate-pop-in fixed bottom-24 right-4 z-[90] flex h-[480px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-3 bg-brand px-4 py-3.5 text-background">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-background/15 text-lg">
              🎧
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">MeeBot</p>
              <p className="flex items-center gap-1.5 text-xs text-background/70">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Çevrimiçi
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-background/15"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`animate-msg-in flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.from === "user"
                      ? "rounded-br-md bg-brand text-background"
                      : "rounded-bl-md border border-border bg-background"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-background px-4 py-3">
                  <Dot /> <Dot delay={150} /> <Dot delay={300} />
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border bg-background px-3 py-2">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs transition hover:border-brand hover:bg-muted"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-background p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesaj yaz..."
              className="w-full rounded-full border border-border bg-muted px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              aria-label="Gönder"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-background transition hover:bg-brand-soft"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Tetik düğmesi */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Canlı destek"
        className="fixed bottom-4 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-background shadow-xl transition hover:scale-105 hover:bg-brand-soft"
      >
        {!open && (
          <span className="ping-ring absolute inset-0 rounded-full bg-brand" />
        )}
        <span className="relative">{open ? "✕" : "💬"}</span>
      </button>
    </>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
