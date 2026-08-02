"use client";

import { History, Plus, Save, Share2 } from "lucide-react";
import { useState } from "react";

import { MethodBadge } from "@/components/proapi/MethodBadge";
import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { servers } from "@/lib/proapi/mock-data";
import { useProApiStore } from "@/lib/proapi/store";
import type { HttpMethod } from "@/lib/proapi/types";

export function PlaygroundExperience() {
  const apiKey = useProApiStore((s) => s.apiKey);
  const setApiKey = useProApiStore((s) => s.setApiKey);
  const history = useProApiStore((s) => s.playgroundHistory);
  const collections = useProApiStore((s) => s.playgroundCollections);
  const addHistory = useProApiStore((s) => s.addPlaygroundHistory);
  const saveToCollection = useProApiStore((s) => s.saveToCollection);
  const addCollection = useProApiStore((s) => s.addCollection);

  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState(`${servers[0].url}/v1/feedback`);
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<string>("");
  const [activeCollection, setActiveCollection] = useState("default");
  const [envVars, setEnvVars] = useState("PRODOC_API_KEY=\nPRODOC_BASE_URL=https://api.prodoc.dev");

  async function send() {
    try {
      const res = await fetch("/api/proapi/try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          path: url.replace(servers[0].url, "").replace(servers[1].url, ""),
          serverUrl: servers[0].url,
          apiKey,
          body: body ? JSON.parse(body) : undefined,
        }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      addHistory({
        id: `pg-${Date.now()}`,
        method,
        url,
        headers: JSON.parse(headers || "{}") as Record<string, string>,
        body,
        timestamp: Date.now(),
      });
    } catch (e) {
      setResponse(JSON.stringify({ error: String(e) }, null, 2));
    }
  }

  function saveCurrent() {
    saveToCollection(activeCollection, {
      id: `saved-${Date.now()}`,
      method,
      url,
      headers: JSON.parse(headers || "{}") as Record<string, string>,
      body,
      timestamp: Date.now(),
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <ProApiGlassCard className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="rounded-lg border border-slate-200 px-2 py-2 font-mono text-xs font-bold"
            >
              {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            />
            <button
              type="button"
              onClick={() => void send()}
              className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A855F7]"
            >
              Send
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500">Headers</p>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 font-mono text-[11px]"
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500">Body</p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 font-mono text-[11px]"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveCurrent}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Save className="h-3.5 w-3.5" /> Save to collection
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(`${method} ${url}`)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </ProApiGlassCard>

        <ProApiGlassCard className="p-4">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Response</p>
          <pre className="mt-2 max-h-80 overflow-auto font-mono text-[11px] text-slate-700">
            {response || "Send a request to see the response."}
          </pre>
        </ProApiGlassCard>
      </div>

      <div className="space-y-4">
        <ProApiGlassCard className="p-4">
          <p className="text-[10px] font-semibold uppercase text-slate-500">API Key</p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs"
          />
        </ProApiGlassCard>

        <ProApiGlassCard className="p-4">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Environment</p>
          <textarea
            value={envVars}
            onChange={(e) => setEnvVars(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 font-mono text-[10px]"
          />
        </ProApiGlassCard>

        <ProApiGlassCard className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase text-slate-500">Collections</p>
            <button
              type="button"
              onClick={() => addCollection(`Collection ${collections.length + 1}`)}
              className="text-[#7C3AED]"
              aria-label="Add collection"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            value={activeCollection}
            onChange={(e) => setActiveCollection(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.requests.length})
              </option>
            ))}
          </select>
        </ProApiGlassCard>

        <ProApiGlassCard className="p-4">
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
            <History className="h-3.5 w-3.5" /> History
          </p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-auto">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMethod(h.method);
                    setUrl(h.url);
                    setBody(h.body);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] hover:bg-slate-100"
                >
                  <MethodBadge method={h.method} />
                  <span className="truncate font-mono text-slate-600">{h.url}</span>
                </button>
              </li>
            ))}
          </ul>
        </ProApiGlassCard>
      </div>
    </div>
  );
}
