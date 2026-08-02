"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { codeLanguages, generateCodeSample } from "@/lib/proapi/code-samples";
import { servers } from "@/lib/proapi/mock-data";
import { useProApiStore } from "@/lib/proapi/store";
import type { ApiEndpoint, CodeLanguage } from "@/lib/proapi/types";

export function CodeSampleTabs({ endpoint }: { endpoint: ApiEndpoint }) {
  const [lang, setLang] = useState<CodeLanguage>("curl");
  const [copied, setCopied] = useState(false);
  const apiKey = useProApiStore((s) => s.apiKey);
  const serverId = useProApiStore((s) => s.serverId);
  const server = servers.find((s) => s.id === serverId) ?? servers[0];
  const code = generateCodeSample(endpoint, lang, apiKey, server.url);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950/5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/60 px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5">
          {codeLanguages.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium transition",
                lang === l.id
                  ? "bg-[#7C3AED] text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-slate-800">
        {code}
      </pre>
    </div>
  );
}
