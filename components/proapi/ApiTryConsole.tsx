"use client";

import { Play, Loader2 } from "lucide-react";
import { useState } from "react";

import { MethodBadge } from "@/components/proapi/MethodBadge";
import { servers } from "@/lib/proapi/mock-data";
import { useProApiStore } from "@/lib/proapi/store";
import type { ApiEndpoint } from "@/lib/proapi/types";

type TryResponse = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  durationMs: number;
};

export function ApiTryConsole({ endpoint }: { endpoint: ApiEndpoint }) {
  const apiKey = useProApiStore((s) => s.apiKey);
  const setApiKey = useProApiStore((s) => s.setApiKey);
  const serverId = useProApiStore((s) => s.serverId);
  const setServerId = useProApiStore((s) => s.setServerId);
  const addHistory = useProApiStore((s) => s.addPlaygroundHistory);

  const [body, setBody] = useState(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody.example, null, 2) : "",
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TryResponse | null>(null);

  const server = servers.find((s) => s.id === serverId) ?? servers[0];

  async function execute() {
    setLoading(true);
    try {
      const res = await fetch("/api/proapi/try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: endpoint.method,
          path: endpoint.path,
          serverUrl: server.url,
          apiKey,
          body: body ? JSON.parse(body) : undefined,
        }),
      });
      const data = (await res.json()) as TryResponse;
      setResponse(data);
      addHistory({
        id: `req-${Date.now()}`,
        method: endpoint.method,
        url: `${server.url}${endpoint.path}`,
        headers: { Authorization: `Bearer ${apiKey}` },
        body,
        timestamp: Date.now(),
      });
    } catch {
      setResponse({
        status: 0,
        headers: {},
        body: { error: "Request failed" },
        durationMs: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Authentication
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Bearer token / API key"
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        />
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Server
        </p>
        <select
          value={serverId}
          onChange={(e) => setServerId(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        >
          {servers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.url}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs">
        <MethodBadge method={endpoint.method} />
        <span className="truncate text-slate-700">{endpoint.path}</span>
      </div>

      {endpoint.requestBody ? (
        <div className="min-h-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Request body
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-slate-950/5 p-3 font-mono text-[11px] outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={execute}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] py-2.5 text-sm font-semibold text-white transition hover:bg-[#A855F7] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        Execute
      </button>

      {response ? (
        <div className="rounded-lg border border-slate-200 bg-slate-950/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Response · {response.status} · {response.durationMs}ms
          </p>
          <pre className="mt-2 max-h-48 overflow-auto font-mono text-[10px] text-slate-700">
            {JSON.stringify(response.body, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
