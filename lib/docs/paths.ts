import fs from "node:fs";
import path from "node:path";

import "server-only";

import { VFile } from "vfile";
import { matter } from "vfile-matter";

import { SIDEBAR_INDEX_SLUGS } from "@/lib/docs/sidebar";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

const SLUG_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSafeDocSlug(slug: string): boolean {
  if (!slug || slug === "index") return false;
  return slug.split("/").every((part) => SLUG_SEGMENT.test(part));
}

function toPosixPath(p: string): string {
  return p.replace(/\\/g, "/");
}

function walkMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walkMdxFiles(full));
      continue;
    }
    if (ent.isFile() && ent.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

export function listDocSlugs(): string[] {
  const files = walkMdxFiles(DOCS_DIR);
  const slugs = files
    .map((fullPath) => {
      const rel = path.relative(DOCS_DIR, fullPath);
      const relPosix = toPosixPath(rel);
      return relPosix.replace(/\.mdx$/, "");
    })
    .filter((slug) => isSafeDocSlug(slug))
    .map(canonicalizeDocSlug);
  return [...new Set(slugs)].sort((a, b) => a.localeCompare(b));
}

export function getDocFilePath(slug: string): string | null {
  if (!isSafeDocSlug(slug)) return null;
  const filePath = path.join(DOCS_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) return filePath;
  const indexPath = path.join(DOCS_DIR, slug, "index.mdx");
  return fs.existsSync(indexPath) ? indexPath : null;
}

function canonicalizeDocSlug(slug: string): string {
  if (slug.endsWith("/index")) {
    const parent = slug.slice(0, -"/index".length);
    if (parent) return parent;
  }
  return slug;
}

export function readDocSource(slug: string): string | null {
  const filePath = getDocFilePath(slug);
  if (!filePath) return null;
  return fs.readFileSync(filePath, "utf8");
}

export type DocFrontmatter = {
  title: string;
  description?: string;
  authors?: string[];
  team?: string;
  nav_order?: number;
  tags?: string[];
  last_updated?: string;
  category?: string;
};

const NAV_GROUP_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "platform-overview": "Platform Overview",
  prodoc: "ProDoc",
  "documentation-samples": "Documentation Samples",
  profeed: "ProFeed",
  proassist: "ProAssist",
  proapi: "ProAPI",
  proinsights: "ProInsights",
  samples: "Writing Samples",
  tutorials: "Tutorials",
  apis: "APIs",
  concepts: "Concepts",
  troubleshooting: "Troubleshooting",
  updates: "Updates",
  insights: "Insights",
};

export function getDocMeta(slug: string): DocFrontmatter | null {
  const source = readDocSource(slug);
  if (!source) return null;
  const vfile = new VFile(source);
  matter(vfile, { strip: true });
  const m = vfile.data.matter as
    | {
        title?: string;
        description?: string;
        authors?: string[];
        team?: string;
        nav_order?: number;
        tags?: string[];
        last_updated?: string;
        category?: string;
      }
    | undefined;
  const title = m?.title?.trim() || slug;
  const authors = Array.isArray(m?.authors)
    ? m.authors
        .filter((a): a is string => typeof a === "string")
        .map((a) => a.trim())
    : undefined;
  const tags = Array.isArray(m?.tags)
    ? m.tags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim())
    : undefined;
  const team = typeof m?.team === "string" ? m.team.trim() : undefined;
  const description =
    typeof m?.description === "string" ? m.description.trim() : undefined;
  const last_updated =
    typeof m?.last_updated === "string" ? m.last_updated.trim() : undefined;
  const category =
    typeof m?.category === "string" ? m.category.trim() : undefined;
  const nav_order = typeof m?.nav_order === "number" ? m.nav_order : 0;
  return {
    title,
    description,
    authors,
    team,
    nav_order,
    tags,
    last_updated,
    category,
  };
}

export function listDocSearchIndex(): {
  slug: string;
  title: string;
  description?: string;
}[] {
  return listDocSlugs()
    .filter((slug) => SIDEBAR_INDEX_SLUGS.has(slug))
    .map((slug) => {
      const meta = getDocMeta(slug);
      return {
        slug,
        title: meta?.title ?? slug,
        description: meta?.description,
      };
    });
}

export function getDocTitle(slug: string): string {
  return getDocMeta(slug)?.title ?? slug;
}

export function listNavDocs(): {
  slug: string;
  title: string;
  nav_order: number;
}[] {
  return listDocSlugs()
    .map((slug) => {
      const meta = getDocMeta(slug);
      return {
        slug,
        title: meta?.title ?? slug,
        nav_order: meta?.nav_order ?? 0,
      };
    })
    .sort((a, b) =>
      a.nav_order !== b.nav_order
        ? a.nav_order - b.nav_order
        : a.title.localeCompare(b.title),
    );
}

export function defaultDocSlug(): string | null {
  const slugs = listDocSlugs();
  if (slugs.includes("getting-started/intro")) {
    return "getting-started/intro";
  }
  if (slugs.includes("platform-overview/ecosystem-overview")) {
    return "platform-overview/ecosystem-overview";
  }
  return slugs[0] ?? null;
}

export type NavLeaf = {
  type: "doc";
  slug: string;
  title: string;
  nav_order: number;
};
export type NavGroup = {
  type: "group";
  prefix: string;
  title: string;
  items: NavLeaf[];
};

function titleCaseFromSlugPart(part: string): string {
  return part
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export function listNavGroups(): NavGroup[] {
  const docs = listNavDocs();
  const map = new Map<string, NavLeaf[]>();

  for (const d of docs) {
    const [first] = d.slug.split("/");
    const prefix = first || "";
    const leaf: NavLeaf = { type: "doc", ...d };
    const arr = map.get(prefix);
    if (arr) arr.push(leaf);
    else map.set(prefix, [leaf]);
  }

  const groups: NavGroup[] = [...map.entries()].map(([prefix, items]) => ({
    type: "group",
    prefix,
    title: NAV_GROUP_LABELS[prefix] ?? (prefix ? titleCaseFromSlugPart(prefix) : "Pages"),
    items: items.sort((a, b) =>
      a.nav_order !== b.nav_order
        ? a.nav_order - b.nav_order
        : a.title.localeCompare(b.title),
    ),
  }));

  const preferred = [
    "getting-started",
    "platform-overview",
    "prodoc",
    "documentation-samples",
    "profeed",
    "proassist",
    "proapi",
    "proinsights",
    "samples",
    "tutorials",
    "apis",
    "concepts",
    "troubleshooting",
    "updates",
    "insights",
    "",
  ];

  const rank = (prefix: string) => {
    const idx = preferred.indexOf(prefix);
    return idx === -1 ? preferred.length : idx;
  };

  return groups.sort((a, b) => {
    const ra = rank(a.prefix);
    const rb = rank(b.prefix);
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title);
  });
}
