import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function ProApiGlassCard({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-[rgba(124,58,237,0.12)] bg-white/70 shadow-[0_8px_32px_rgba(124,58,237,0.08)] backdrop-blur-xl",
        "[-webkit-backdrop-filter:blur(12px)] [backdrop-filter:blur(12px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
