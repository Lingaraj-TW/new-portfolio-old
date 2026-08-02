import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type AdmonitionType = "note" | "tip" | "info" | "warning" | "danger";

const styles: Record<AdmonitionType, { label: string }> = {
  note: { label: "Note" },
  tip: { label: "Tip" },
  info: { label: "Info" },
  warning: { label: "Warning" },
  danger: { label: "Important" },
};

type Props = {
  type?: AdmonitionType;
  title?: string;
  children: ReactNode;
};

export function Admonition({ type = "note", title, children }: Props) {
  const s = styles[type];
  return (
    <aside
      className={cn("not-prose pds-admonition", `pds-admonition--${type}`)}
    >
      <p className="pds-admonition__title">{title ?? s.label}</p>
      <div className="pds-admonition__body [&>p]:my-2">{children}</div>
    </aside>
  );
}
