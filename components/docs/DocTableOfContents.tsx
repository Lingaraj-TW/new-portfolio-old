"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type TocItem = { id: string; text: string; level: number };

export function DocTableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const root = document.getElementById("doc-root");
    if (!root) return;

    const headings = root.querySelectorAll("h2, h3");
    const toc: TocItem[] = [];
    headings.forEach((h) => {
      if (!h.id) return;
      toc.push({
        id: h.id,
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      });
    });
    setItems(toc);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length < 2) return null;

  return (
    <nav className="hidden xl:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--docs-muted-fg)]">
        On this page
      </p>
      <ul className="space-y-2 border-l border-[var(--docs-border)] text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "doc-toc-link block border-l-2 py-0.5 leading-snug transition-colors",
                item.level === 3 && "pl-5",
                item.level === 2 && "pl-3",
                active === item.id
                  ? "doc-toc-link-active border-[var(--docs-primary)] font-medium"
                  : "border-transparent",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
