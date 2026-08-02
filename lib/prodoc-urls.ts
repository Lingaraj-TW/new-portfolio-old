/**
 * When NEXT_PUBLIC_PRODOC_URL is unset, this Next app serves documentation under
 * `/prodoc` (rewritten to `/docs` internally). When set, links point at that host’s `/docs`.
 */

import type { DocsVersion } from "@/lib/docs/versions";
import {
  DOCS_LATEST_VERSION,
  DOCS_VERSIONS,
  docSlugWithVersionPrefix,
  getDocsVersion,
} from "@/lib/docs/versions";

export { DOCS_VERSIONS, DOCS_LATEST_VERSION };
export type { DocsVersion };

export function getProdocPublicBase(): string {
  const v = process.env.NEXT_PUBLIC_PRODOC_URL?.trim();
  return v ? v.replace(/\/$/, "") : "";
}

/** First URL for “open documentation” / Live demo (shows `/prodoc` when same app). */
export function getProdocEntryHref(): string {
  const base = getProdocPublicBase();
  if (!base) return "/prodoc";
  return `${base}/docs`;
}

export function docPageHref(slug: string, versionId?: string): string {
  const base = getProdocPublicBase();
  const version =
    getDocsVersion(versionId ?? DOCS_LATEST_VERSION.id) ?? DOCS_LATEST_VERSION;
  const path = docSlugWithVersionPrefix(slug, version);
  if (!base) return `/prodoc/${path}`;
  return `${base}/docs/${path}`;
}

/** Server redirect when `/docs` or `/prodoc` has no slug segment. */
export function docsBootstrapPath(
  defaultSlug: string,
  versionId?: string,
): string {
  return docPageHref(defaultSlug, versionId);
}

export function isExternalDocHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Writing samples hub — resume, API guide, release notes, and KB article. */
export function getSamplesEntryHref(): string {
  return docPageHref("samples");
}

/** Platform hub — ecosystem overview and workflow. */
export function getPlatformHref(): string {
  return "/platform";
}

/** Ecosystem product documentation entry — intro and product overviews. */
export function getEcosystemEntryHref(): string {
  return getPlatformHref();
}
