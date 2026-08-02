"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type DocHubSearchEntry = {
  href: string;
  title: string;
  description?: string;
};

const MAX_RESULTS = 8;

function matchEntries(entries: DocHubSearchEntry[], query: string) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const scored = entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const description = entry.description?.toLowerCase() ?? "";
      let score = -1;
      if (title.startsWith(q)) score = 0;
      else if (title.includes(q)) score = 1;
      else if (description.includes(q)) score = 2;
      return { entry, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => a.score - b.score);
  return scored.slice(0, MAX_RESULTS).map((r) => r.entry);
}

export function DocHubSearch({
  entries,
  placeholder,
}: {
  entries: DocHubSearchEntry[];
  placeholder: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => matchEntries(entries, query), [entries, query]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) {
        setOpen(false);
        router.push(target.href);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showResults = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-xl border border-border-card bg-card px-4 py-3.5 transition focus-within:border-border-teal-hover">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="Search documentation"
          role="combobox"
          aria-expanded={showResults}
          aria-controls="doc-hub-search-results"
        />
        <kbd className="hidden shrink-0 rounded-md border border-border-card bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground sm:inline-block">
          {results.length > 0 ? "↵" : "Docs"}
        </kbd>
      </div>

      {showResults ? (
        <ul
          id="doc-hub-search-results"
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border-card bg-card shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">
              No results for “{query.trim()}”
            </li>
          ) : (
            results.map((entry, index) => (
              <li key={entry.href} role="option" aria-selected={index === activeIndex}>
                <Link
                  href={entry.href}
                  className={`block px-4 py-2.5 transition-colors ${
                    index === activeIndex ? "bg-muted" : "hover:bg-muted"
                  }`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className="block text-sm font-medium text-foreground">
                    {entry.title}
                  </span>
                  {entry.description ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
