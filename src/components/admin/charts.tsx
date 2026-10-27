export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-transparent bg-brand text-background"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${accent ? "text-background/70" : "text-muted-foreground"}`}
        >
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
      {sub && (
        <p
          className={`mt-1 text-xs ${accent ? "text-background/60" : "text-muted-foreground"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function BarChart({
  data,
  formatValue,
}: {
  data: { label: string; value: number; icon?: string; gradient?: string }[];
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium">
              {d.icon && <span>{d.icon}</span>}
              {d.label}
            </span>
            <span className="text-muted-foreground">
              {formatValue ? formatValue(d.value) : d.value}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.gradient ?? "var(--brand)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const stops = data
    .map((d) => {
      const start = (acc / total) * 360;
      acc += d.value;
      const end = (acc / total) * 360;
      return `${d.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div
        className="relative h-40 w-40 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-background">
          <span className="text-xl font-extrabold">{total}</span>
          <span className="text-[11px] text-muted-foreground">toplam</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: d.color }}
            />
            <span className="font-medium">{d.label}</span>
            <span className="text-muted-foreground">
              ({d.value} • %{Math.round((d.value / total) * 100)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
