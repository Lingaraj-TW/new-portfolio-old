"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { cn } from "@/lib/cn";
import { sdks } from "@/lib/proapi/mock-data";
import type { SdkLanguage } from "@/lib/proapi/types";

export function SdkCenter() {
  const [active, setActive] = useState<SdkLanguage>("javascript");
  const [copied, setCopied] = useState(false);
  const sdk = sdks.find((s) => s.language === active) ?? sdks[0];

  async function copyInstall() {
    await navigator.clipboard.writeText(sdk.install);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-3">
        {sdks.map((s) => (
          <button
            key={s.language}
            type="button"
            id={s.language}
            onClick={() => setActive(s.language)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active === s.language
                ? "bg-[#7C3AED] text-white"
                : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <ProApiGlassCard className="mt-4 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{sdk.name}</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-950/5 px-3 py-2">
          <code className="font-mono text-xs text-slate-700">{sdk.install}</code>
          <button
            type="button"
            onClick={() => void copyInstall()}
            className="flex items-center gap-1 text-xs text-[#7C3AED]"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy
          </button>
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Quick start</h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/5 p-4 font-mono text-[11px] text-slate-700">
            {sdk.quickStart}
          </pre>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Methods</h3>
          <ul className="mt-2 space-y-2">
            {sdk.methods.map((m) => (
              <li key={m.name} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <code className="font-mono text-[#7C3AED]">{m.name}</code>
                <span className="ml-2 text-slate-600">{m.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Example</h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/5 p-4 font-mono text-[11px] text-slate-700">
            {sdk.example}
          </pre>
        </section>
      </ProApiGlassCard>
    </div>
  );
}
