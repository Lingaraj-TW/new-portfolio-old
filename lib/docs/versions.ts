/**
 * ProDocs documentation versioning — Docusaurus-style URL strategy.
 * Latest (26.1): /prodoc/{slug}
 * Archive (26.0): /prodoc/26.0/{slug}
 */

export type DocsVersion = {
  id: string;
  label: string;
  /** URL path segment; omitted for latest */
  pathPrefix: string | null;
  isLatest: boolean;
  released: string;
  summary: string;
  releaseNotesSlug?: string;
};

export const DOCS_VERSIONS: DocsVersion[] = [
  {
    id: "26.1",
    label: "26.1",
    pathPrefix: null,
    isLatest: true,
    released: "June 2026",
    summary: "Current release — Products IA, design system, ProFeed widget",
    releaseNotesSlug: "documentation-samples/release-notes-v5-4-0",
  },
  {
    id: "26.0",
    label: "26.0",
    pathPrefix: "26.0",
    isLatest: false,
    released: "March 2026",
    summary: "Previous stable — core platform overview and samples hub",
    releaseNotesSlug: "documentation-samples/release-notes-v5-4-0",
  },
];

export const DOCS_LATEST_VERSION = DOCS_VERSIONS.find((v) => v.isLatest)!;

export function getDocsVersion(id: string): DocsVersion | undefined {
  return DOCS_VERSIONS.find((v) => v.id === id);
}

export function getVersionByPathPrefix(prefix: string | null): DocsVersion {
  if (!prefix) return DOCS_LATEST_VERSION;
  return (
    DOCS_VERSIONS.find((v) => v.pathPrefix === prefix) ?? DOCS_LATEST_VERSION
  );
}

/** Split URL slug segments into version + doc slug. */
export function parseVersionedDocSlug(slugParts: string[]): {
  version: DocsVersion;
  docSlug: string;
} {
  if (!slugParts.length) {
    return { version: DOCS_LATEST_VERSION, docSlug: "" };
  }

  const first = slugParts[0];
  const archived = DOCS_VERSIONS.find(
    (v) => v.pathPrefix && v.pathPrefix === first,
  );

  if (archived) {
    return {
      version: archived,
      docSlug: slugParts.slice(1).join("/"),
    };
  }

  return {
    version: DOCS_LATEST_VERSION,
    docSlug: slugParts.join("/"),
  };
}

/** Detect version from public pathname (/prodoc/... or /docs/...). */
export function parseVersionFromPathname(pathname: string): {
  version: DocsVersion;
  docSlug: string;
} {
  const normalized = pathname
    .replace(/^\/docs\/?/, "")
    .replace(/^\/prodoc\/?/, "");
  if (!normalized) {
    return { version: DOCS_LATEST_VERSION, docSlug: "" };
  }
  return parseVersionedDocSlug(normalized.split("/").filter(Boolean));
}

export function docSlugWithVersionPrefix(
  docSlug: string,
  version: DocsVersion,
): string {
  if (!docSlug) return version.pathPrefix ?? "";
  if (version.isLatest || !version.pathPrefix) return docSlug;
  return `${version.pathPrefix}/${docSlug}`;
}
