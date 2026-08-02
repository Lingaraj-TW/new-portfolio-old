import { cn } from "@/lib/cn";
import type { HttpMethod } from "@/lib/proapi/types";

const styles: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
  POST: "bg-violet-500/15 text-violet-700 border-violet-500/25",
  PUT: "bg-amber-500/15 text-amber-700 border-amber-500/25",
  PATCH: "bg-sky-500/15 text-sky-700 border-sky-500/25",
  DELETE: "bg-rose-500/15 text-rose-700 border-rose-500/25",
};

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide",
        styles[method],
      )}
    >
      {method}
    </span>
  );
}
