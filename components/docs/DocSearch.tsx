"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { docPageHref } from "@/lib/prodoc-urls";

type DocIndexItem = { slug: string; title: string; description?: string };

type Props = { index: DocIndexItem[] };

export function DocSearch({ index }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.slug.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [index, query]);

  return (
    <div className="relative mb-4">
      <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search documentation…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {open && query.trim() && results.length > 0 ? (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-background py-1 shadow-lg">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={docPageHref(r.slug)}
                className="block px-3 py-2 text-sm hover:bg-muted"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="font-medium text-foreground">{r.title}</span>
                {r.description ? (
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {r.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
