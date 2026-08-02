"use client";

import { FileUp, Link2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

import { parseOpenApiDocument, parseOpenApiFromUrl } from "@/lib/proapi/openapi-parser";
import { useProApiStore } from "@/lib/proapi/store";

export function OpenApiImporter() {
  const setCategories = useProApiStore((s) => s.setCategories);
  const resetCategories = useProApiStore((s) => s.resetCategories);
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const format = file.name.endsWith(".yaml") || file.name.endsWith(".yml") ? "yaml" : "json";
      const parsed = await parseOpenApiDocument(text, format);
      setCategories(parsed.categories, parsed.title);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUrl() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseOpenApiFromUrl(url.trim());
      setCategories(parsed.categories, parsed.title);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        OpenAPI import
      </p>
      <p className="mt-1 text-[10px] text-slate-500">OAS 3.0 · 3.1 · Swagger 2.0</p>
      <div className="mt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-2 py-2 text-[11px] font-medium text-slate-600 hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileUp className="h-3.5 w-3.5" />}
          Upload JSON / YAML
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,.yaml,.yml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
        <div className="flex gap-1">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Import URL"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
          />
          <button
            type="button"
            onClick={() => void handleUrl()}
            disabled={loading}
            className="rounded-lg bg-slate-100 px-2 py-1.5 text-[#7C3AED] hover:bg-[#7C3AED]/10"
            aria-label="Import from URL"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={resetCategories}
          className="text-[10px] text-slate-500 hover:text-[#7C3AED]"
        >
          Reset to default spec
        </button>
        {error ? <p className="text-[10px] text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
