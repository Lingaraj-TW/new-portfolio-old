import { Play } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  duration?: string;
  children?: ReactNode;
};

export function VideoEmbed({ title, duration, children }: Props) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-[var(--docs-border,var(--border))]">
      <div
        className="relative flex aspect-video items-center justify-center"
        style={{ background: "var(--accent-gradient-soft)" }}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-card/95 text-accent shadow-lg">
          <Play className="ml-1 size-7 fill-current" />
        </div>
        {duration ? (
          <span className="absolute bottom-3 right-3 rounded bg-[var(--pds-ink-950)]/60 px-2 py-0.5 text-xs text-[var(--pds-text-dark-primary)]">
            {duration}
          </span>
        ) : null}
      </div>
      <div className="bg-muted/30 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">Video tutorial placeholder</p>
      </div>
      {children}
    </div>
  );
}
