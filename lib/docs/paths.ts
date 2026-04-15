import fs from "node:fs";
import path from "node:path";

import { VFile } from "vfile";
import { matter } from "vfile-matter";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

const SLUG_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSafeDocSlug(slug: string): boolean {
  if (!slug || slug === "index") return false;
  return slug.split("/").every((part) => SLUG_SEGMENT.test(part));
}

export function listDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((slug) => isSafeDocSlug(slug))
    .sort((a, b) => a.localeCompare(b));
}

export function getDocFilePath(slug: string): string | null {
  if (!isSafeDocSlug(slug)) return null;
  const filePath = path.join(DOCS_DIR, `${slug}.mdx`);
  return fs.existsSync(filePath) ? filePath : null;
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
      }
    | undefined;
  const title = m?.title?.trim() || slug;
  const authors = Array.isArray(m?.authors)
    ? m.authors.filter((a): a is string => typeof a === "string").map((a) => a.trim())
    : undefined;
  const team = typeof m?.team === "string" ? m.team.trim() : undefined;
  const description =
    typeof m?.description === "string" ? m.description.trim() : undefined;
  const nav_order = typeof m?.nav_order === "number" ? m.nav_order : 0;
  return { title, description, authors, team, nav_order };
}

export function getDocTitle(slug: string): string {
  return getDocMeta(slug)?.title ?? slug;
}

export function listNavDocs(): { slug: string; title: string; nav_order: number }[] {
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
  if (slugs.includes("overview")) return "overview";
  return slugs[0] ?? null;
}
