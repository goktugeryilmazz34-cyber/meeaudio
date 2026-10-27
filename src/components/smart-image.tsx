"use client";

import { useEffect, useRef, useState } from "react";

export function SmartImage({
  src,
  alt,
  gradient,
  emoji,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  gradient?: string;
  emoji?: string;
  className?: string;
  imgClassName?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const ref = useRef<HTMLImageElement>(null);

  // Önbellekteki/anında yüklenen görsellerde onLoad olayı React dinleyici
  // bağlanmadan tetiklenebilir; bu durumu img.complete ile yakalıyoruz.
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (img.complete) {
      setStatus(img.naturalWidth > 0 ? "loaded" : "error");
    } else {
      setStatus("loading");
    }
  }, [src]);

  // className "absolute" içeriyorsa konum çakışmasını önlemek için relative ekleme
  const pos = className.includes("absolute") ? "" : "relative";

  return (
    <div
      className={`${pos} overflow-hidden ${className}`}
      style={{ background: gradient ?? "var(--muted)" }}
    >
      {status !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}

      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-black/5" />
      )}

      {status === "error" && emoji && (
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {emoji}
        </div>
      )}
    </div>
  );
}
