"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useDocsVersion } from "@/lib/docs/use-docs-version";

type DocIndexItem = { slug: string; title: string; description?: string };

type Props = { index: DocIndexItem[] };

export function DocsNavbarSearch({ index }: Props) {
  const { docHref } = useDocsVersion();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

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
    <div className="relative hidden flex-1 md:block md:max-w-md lg:max-w-lg">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--docs-muted-fg)]" />
      <input
        type="search"
        placeholder="Search docs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className="pds-search-input"
      />
      {focused && query.trim() && results.length > 0 ? (
        <ul className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border border-[var(--docs-border)] bg-[var(--docs-bg)] py-1 shadow-lg">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={docHref(r.slug)}
                className="block px-3 py-2 hover:bg-[var(--docs-sidebar-bg)]"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="block text-sm font-medium text-[var(--docs-fg)]">
                  {r.title}
                </span>
                {r.description ? (
                  <span className="block truncate text-xs text-[var(--docs-muted-fg)]">
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
