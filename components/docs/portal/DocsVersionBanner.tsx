"use client";

import Link from "next/link";

import { useDocsVersion } from "@/lib/docs/use-docs-version";
import { DOCS_LATEST_VERSION } from "@/lib/docs/versions";
import { docPageHref } from "@/lib/prodoc-urls";

export function DocsVersionBanner() {
  const { version, docSlug } = useDocsVersion();

  if (version.isLatest) return null;

  return (
    <div className="pds-version-banner border-b border-[var(--docs-border)] bg-[var(--tag-bg)] px-4 py-2.5 text-center text-sm text-[var(--docs-fg)]">
      <span>
        You are viewing documentation for{" "}
        <strong className="font-semibold text-[var(--docs-primary)]">
          ProDocs {version.label}
        </strong>
        .{" "}
      </span>
      <Link
        href={docPageHref(docSlug || "getting-started/intro", DOCS_LATEST_VERSION.id)}
        className="font-medium text-[var(--docs-primary)] hover:underline"
      >
        Switch to {DOCS_LATEST_VERSION.label} (current)
      </Link>
    </div>
  );
}
