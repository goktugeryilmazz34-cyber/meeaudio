"use client";

import Link from "next/link";

type Step = 1 | 2;

export function CheckoutSteps({ step }: { step: Step }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      <StepItem
        n={1}
        label="Sepet"
        active={step === 1}
        done={step > 1}
        href="/sepet"
      />
      <div className="h-px w-8 sm:w-14 bg-border" aria-hidden />
      <StepItem n={2} label="Ödeme" active={step === 2} done={false} href="/odeme" />
    </ol>
  );
}

function StepItem({
  n,
  label,
  active,
  done,
  href,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
  href: string;
}) {
  const ring = active
    ? "border-brand bg-brand text-background scale-105 shadow-lg"
    : done
      ? "border-success bg-success/10 text-success"
      : "border-border bg-muted text-muted-foreground";

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-300 sm:px-4 ${ring}`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          active ? "bg-background text-brand" : "bg-background/80"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
