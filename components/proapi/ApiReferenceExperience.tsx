"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { ApiEndpointDoc } from "@/components/proapi/ApiEndpointDoc";
import { ApiTryConsole } from "@/components/proapi/ApiTryConsole";
import { OpenApiImporter } from "@/components/proapi/OpenApiImporter";
import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { ProApiSearch } from "@/components/proapi/ProApiSearch";
import { VersionSwitcher } from "@/components/proapi/VersionSwitcher";
import { MethodBadge } from "@/components/proapi/MethodBadge";
import { cn } from "@/lib/cn";
import { useProApiStore } from "@/lib/proapi/store";

export function ApiReferenceExperience() {
  const searchParams = useSearchParams();
  const op = searchParams.get("op");

  const categories = useProApiStore((s) => s.categories);
  const importedTitle = useProApiStore((s) => s.importedTitle);
  const selectedId = useProApiStore((s) => s.selectedEndpointId);
  const setSelected = useProApiStore((s) => s.setSelectedEndpoint);
  const getEndpoints = useProApiStore((s) => s.getEndpointsForVersion);
  const getSelected = useProApiStore((s) => s.getSelectedEndpoint);

  const endpoints = getEndpoints();
  const endpoint = getSelected();

  useEffect(() => {
    if (op) setSelected(op);
  }, [op, setSelected]);

  useEffect(() => {
    if (endpoint && !endpoints.find((e) => e.id === endpoint.id) && endpoints[0]) {
      setSelected(endpoints[0].id);
    }
  }, [endpoint, endpoints, setSelected]);

  return (
    <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
      <ProApiGlassCard className="hidden p-4 xl:block">
        <ProApiSearch className="relative" />
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            API version
          </p>
          <div className="mt-2">
            <VersionSwitcher />
          </div>
        </div>
        {importedTitle ? (
          <p className="mt-3 text-[10px] text-[#7C3AED]">Imported: {importedTitle}</p>
        ) : null}
        <nav className="mt-4 space-y-4" aria-label="Endpoints">
          {categories.map((cat) => {
            const catEndpoints = cat.endpoints.filter((e) =>
              endpoints.some((ep) => ep.id === e.id),
            );
            if (catEndpoints.length === 0) return null;
            return (
              <div key={cat.id}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {cat.label}
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {catEndpoints.map((ep) => (
                    <li key={ep.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(ep.id)}
                        className={cn(
                          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs transition",
                          selectedId === ep.id
                            ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                            : "text-slate-600 hover:bg-slate-100",
                          ep.deprecated && "opacity-70",
                        )}
                      >
                        <MethodBadge method={ep.method} />
                        <span className="truncate font-mono">{ep.path}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <Link href="/proapi/authentication" className="text-xs font-medium text-[#7C3AED] hover:underline">
            Authentication →
          </Link>
        </div>
        <OpenApiImporter />
      </ProApiGlassCard>

      <ProApiGlassCard className="min-h-[480px] p-5 sm:p-6">
        {endpoint ? <ApiEndpointDoc endpoint={endpoint} /> : (
          <p className="text-sm text-slate-500">Select an endpoint from the sidebar.</p>
        )}
      </ProApiGlassCard>

      <ProApiGlassCard className="hidden p-4 lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Try it
        </p>
        {endpoint ? (
          <div className="mt-3">
            <ApiTryConsole endpoint={endpoint} />
          </div>
        ) : null}
      </ProApiGlassCard>
    </div>
  );
}
