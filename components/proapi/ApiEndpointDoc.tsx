"use client";

import { MethodBadge } from "@/components/proapi/MethodBadge";
import { CodeSampleTabs } from "@/components/proapi/CodeSampleTabs";
import type { ApiEndpoint } from "@/lib/proapi/types";

export function ApiEndpointDoc({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <article className="space-y-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-sm text-slate-800">{endpoint.path}</code>
          {endpoint.deprecated ? (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Deprecated
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">{endpoint.summary}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{endpoint.description}</p>
      </header>

      {endpoint.parameters.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-slate-900">Request parameters</h2>
          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">In</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Required</th>
                  <th className="px-3 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {endpoint.parameters.map((p) => (
                  <tr key={p.name}>
                    <td className="px-3 py-2 font-mono font-medium">{p.name}</td>
                    <td className="px-3 py-2">{p.in}</td>
                    <td className="px-3 py-2">{p.type}</td>
                    <td className="px-3 py-2">{p.required ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-slate-600">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {endpoint.requestBody ? (
        <section id="schema">
          <h2 className="text-sm font-semibold text-slate-900">Request body</h2>
          <p className="mt-1 text-xs text-slate-500">{endpoint.requestBody.contentType}</p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Field</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Required</th>
                  <th className="px-3 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {endpoint.requestBody.schema.map((f) => (
                  <tr key={f.name}>
                    <td className="px-3 py-2 font-mono">{f.name}</td>
                    <td className="px-3 py-2">{f.type}</td>
                    <td className="px-3 py-2">{f.required ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-slate-600">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Code samples</h2>
        <div className="mt-2">
          <CodeSampleTabs endpoint={endpoint} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Response examples</h2>
        <div className="mt-2 space-y-3">
          {endpoint.responses.map((r) => (
            <div key={r.status} className="rounded-lg border border-slate-200 bg-white/60 p-3">
              <p className="text-xs font-semibold text-slate-700">
                {r.status} {r.label}
              </p>
              <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-slate-600">
                {JSON.stringify(r.body, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section id="errors">
        <h2 className="text-sm font-semibold text-slate-900">Error codes</h2>
        <ul className="mt-2 space-y-2">
          {endpoint.errors.map((e) => (
            <li key={e.code} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
              <span className="font-mono font-semibold text-rose-600">{e.code}</span>
              <span className="mx-2 text-slate-400">{e.status}</span>
              <span className="text-slate-600">{e.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Best practices</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {endpoint.bestPractices.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          <strong>Rate limit:</strong> {endpoint.rateLimit}
        </p>
      </section>
    </article>
  );
}
