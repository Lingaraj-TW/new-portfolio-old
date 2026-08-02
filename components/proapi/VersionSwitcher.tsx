"use client";

import { cn } from "@/lib/cn";
import { apiVersions } from "@/lib/proapi/mock-data";
import { useProApiStore } from "@/lib/proapi/store";
import type { ApiVersion } from "@/lib/proapi/types";

export function VersionSwitcher() {
  const version = useProApiStore((s) => s.apiVersion);
  const setVersion = useProApiStore((s) => s.setApiVersion);

  return (
    <div className="flex flex-wrap gap-1">
      {apiVersions.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setVersion(v as ApiVersion)}
          className={cn(
            "rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition",
            version === v
              ? "bg-[#7C3AED] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]",
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
