import type { ReactNode } from "react";

export function ProductHero({
  title,
  tagline,
  problem,
  children,
}: {
  title: string;
  tagline: string;
  problem: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg font-medium text-accent">{tagline}</p>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {problem}
      </p>
      {children}
    </div>
  );
}

export function FeatureGrid({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <article
          key={f.title}
          className="rounded-xl border border-border-card bg-card p-5 transition hover:border-border-teal-hover"
        >
          <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {f.body}
          </p>
        </article>
      ))}
    </div>
  );
}

function MetricCell({
  m,
}: {
  m: { label: string; value: string; hint?: string };
}) {
  return (
    <div className="rounded-xl p-px [background:linear-gradient(135deg,rgba(147,51,234,0.4)_0%,rgba(236,72,153,0.28)_45%,rgba(255,255,255,0.06)_100%)]">
      <div className="h-full rounded-[11px] bg-card px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {m.label}
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {m.value}
        </p>
        {m.hint ? (
          <p className="mt-1 text-xs text-fg-tertiary">{m.hint}</p>
        ) : null}
      </div>
    </div>
  );
}

export function MetricsBar({
  metrics,
}: {
  metrics: { label: string; value: string; hint?: string }[];
}) {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCell key={m.label} m={m} />
      ))}
    </div>
  );
}

export function BuiltForTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-12">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Built for
      </p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-[rgba(147,51,234,0.25)] bg-[rgba(147,51,234,0.08)] px-4 py-2 text-xs font-medium text-foreground"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FlowSteps({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="relative rounded-xl border border-border-card bg-card p-5 transition hover:border-border-teal-hover"
        >
          <span className="text-xs font-bold text-accent">0{i + 1}</span>
          <h3 className="mt-2 font-semibold text-foreground">{s.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

export function MockWindowChrome({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-12 overflow-hidden rounded-xl border border-border-card bg-card shadow-xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-border bg-elevated px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 font-mono text-[10px] text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="bg-background/50 p-4">{children}</div>
    </div>
  );
}
