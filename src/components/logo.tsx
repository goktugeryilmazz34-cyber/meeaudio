import Link from "next/link";

export function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const text = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="MeeAudio anasayfa"
    >
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-background"
      >
        <span className="flex items-end gap-[2px]">
          <span className="block h-2 w-[3px] rounded-full bg-background transition-all group-hover:h-3" />
          <span className="block h-4 w-[3px] rounded-full bg-background transition-all group-hover:h-2" />
          <span className="block h-3 w-[3px] rounded-full bg-background transition-all group-hover:h-4" />
        </span>
      </span>
      <span className={`font-extrabold tracking-tight text-brand ${text}`}>
        mee<span className="font-light">audio</span>
      </span>
    </Link>
  );
}
