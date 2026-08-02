import path from "node:path";

import { getDocFilePath, isSafeDocSlug } from "@/lib/docs/paths";
import { docPageHref } from "@/lib/prodoc-urls";

export type DocSourceInfo = {
  slug: string;
  repoPath: string;
  liveHref: string;
  exists: boolean;
};

const DOC_PREFIXES = ["/prodoc/", "/docs/"] as const;

/** Strip `/prodoc/` or `/docs/` prefix and return a doc slug, or null. */
export function pagePathToSlug(pagePath: string): string | null {
  const normalized = pagePath.trim().replace(/\/+$/, "") || "/";
  if (normalized === "/" || normalized === "/prodoc" || normalized === "/docs") {
    return null;
  }

  for (const prefix of DOC_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      const slug = normalized.slice(prefix.length).replace(/^\/+/, "");
      if (!slug || !isSafeDocSlug(slug)) return null;
      return slug;
    }
  }

  return null;
}

/** Repo-relative path e.g. `content/docs/profeed/overview.mdx`. */
export function slugToRepoRelativePath(slug: string): string | null {
  if (!isSafeDocSlug(slug)) return null;
  const abs = getDocFilePath(slug);
  if (!abs) return null;
  return path.relative(process.cwd(), abs).split(path.sep).join("/");
}

export function pagePathToLiveHref(
  pagePath: string,
  sectionAnchor?: string | null,
): string | null {
  const slug = pagePathToSlug(pagePath);
  if (!slug) return null;
  const href = docPageHref(slug);
  const anchor = sectionAnchor?.trim().replace(/^#/, "");
  if (!anchor) return href;
  return `${href}#${anchor}`;
}

/** Resolve feedback `page_path` to MDX source metadata. */
export function resolveDocSourceFromPagePath(
  pagePath: string,
  sectionAnchor?: string | null,
): DocSourceInfo | null {
  const slug = pagePathToSlug(pagePath);
  if (!slug) return null;

  const abs = getDocFilePath(slug);
  const repoPath = abs
    ? path.relative(process.cwd(), abs).split(path.sep).join("/")
    : `content/docs/${slug}.mdx`;

  const liveHref = pagePathToLiveHref(pagePath, sectionAnchor);
  if (!liveHref) return null;

  return {
    slug,
    repoPath,
    liveHref,
    exists: Boolean(abs),
  };
}
