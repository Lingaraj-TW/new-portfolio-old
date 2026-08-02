"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDocsVersion } from "@/lib/docs/use-docs-version";
import { DOCS_VERSIONS } from "@/lib/docs/versions";
import { docPageHref } from "@/lib/prodoc-urls";
import { cn } from "@/lib/cn";

export function DocsVersionDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { version, docSlug } = useDocsVersion();

  function switchVersion(targetId: string) {
    setOpen(false);
    if (targetId === version.id) return;
    const slug = docSlug || "getting-started/intro";
    router.push(docPageHref(slug, targetId));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="pds-version-trigger flex h-9 items-center gap-1.5 rounded-[var(--pds-radius-sm)] border border-[var(--docs-border)] px-2.5 text-sm font-medium text-[var(--docs-fg)] hover:bg-[var(--docs-sidebar-bg)]"
      >
        <span>{version.label}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close version menu"
            onClick={() => setOpen(false)}
          />
          <ul
            className="pds-version-menu absolute right-0 z-[100] mt-1 min-w-[16rem] overflow-hidden rounded-[var(--pds-radius-md)] border border-[var(--docs-border)] py-1 shadow-lg"
            role="listbox"
            aria-label="Documentation version"
          >
            {DOCS_VERSIONS.map((v) => {
              const active = v.id === version.id;
              const versionLine = v.isLatest ? `${v.label} - current` : v.label;
              return (
                <li key={v.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={cn(
                      "pds-version-menu-item block w-full px-3 py-2.5 text-left transition-colors hover:bg-[var(--docs-sidebar-bg)]",
                      active && "bg-[var(--docs-sidebar-bg)]",
                    )}
                    onClick={() => switchVersion(v.id)}
                  >
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        active
                          ? "text-[var(--docs-primary)]"
                          : "text-[var(--docs-fg)]",
                      )}
                    >
                      {versionLine}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--docs-muted-fg)]">
                      Released {v.released}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-[var(--docs-muted-fg)]">
                      {v.summary}
                    </span>
                    {v.releaseNotesSlug ? (
                      <Link
                        href={docPageHref(v.releaseNotesSlug, v.id)}
                        className="mt-1 inline-block text-[11px] font-medium text-[var(--docs-primary)] hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(false);
                        }}
                      >
                        Release notes →
                      </Link>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </div>
  );
}
