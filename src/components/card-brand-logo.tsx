/** Kart yüzeyinde kabartma / baskı efektli MeeAudio logosu */
export function CardBrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="card-logo-mark flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 shadow-inner"
        aria-hidden
      >
        <span className="flex items-end gap-[2px]">
          <span className="block h-2 w-[3px] rounded-full bg-brand" />
          <span className="block h-4 w-[3px] rounded-full bg-brand" />
          <span className="block h-3 w-[3px] rounded-full bg-brand" />
        </span>
      </span>
      <span className="text-left leading-none">
        <span className="block text-sm font-extrabold tracking-tight text-white drop-shadow-sm">
          mee<span className="font-light">audio</span>
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/55">
          Premium
        </span>
      </span>
    </div>
  );
}
