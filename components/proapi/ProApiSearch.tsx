"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { searchPortal } from "@/lib/proapi/search";
import { useProApiStore } from "@/lib/proapi/store";
import type { SearchResult } from "@/lib/proapi/types";

export function ProApiSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const getEndpoints = useProApiStore((s) => s.getEndpointsForVersion);

  useEffect(() => {
    setResults(searchPortal(query, getEndpoints()));
  }, [query, getEndpoints]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search endpoints, schemas, guides…"
          className="w-full rounded-lg border border-slate-200 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none ring-[#7C3AED]/30 focus:ring-2"
        />
      </div>
      {open && query && results.length > 0 ? (
        <ul className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="block px-3 py-2 text-sm hover:bg-[#7C3AED]/5"
              >
                <span className="font-medium text-slate-800">{r.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{r.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
