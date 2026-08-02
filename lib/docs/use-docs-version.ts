"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import {
  DOCS_LATEST_VERSION,
  type DocsVersion,
  parseVersionFromPathname,
} from "@/lib/docs/versions";
import { docPageHref } from "@/lib/prodoc-urls";

export function useDocsVersion(): {
  version: DocsVersion;
  docSlug: string;
  docHref: (slug: string) => string;
} {
  const pathname = usePathname();

  return useMemo(() => {
    const { version, docSlug } = parseVersionFromPathname(pathname ?? "");
    return {
      version,
      docSlug,
      docHref: (slug: string) => docPageHref(slug, version.id),
    };
  }, [pathname]);
}

export { DOCS_LATEST_VERSION };
