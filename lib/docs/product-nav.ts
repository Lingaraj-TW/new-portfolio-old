import { listNavDocs, type NavLeaf } from "@/lib/docs/paths";

export type DocsProductId =
  | "prodoc"
  | "profeed"
  | "proassist"
  | "proapi"
  | "proinsights";

export type DocsProduct = {
  id: DocsProductId;
  label: string;
  entrySlug: string;
  slugPrefixes: string[];
};

export const DOCS_PRODUCTS: DocsProduct[] = [
  {
    id: "prodoc",
    label: "ProDoc",
    entrySlug: "platform-overview/ecosystem-overview",
    slugPrefixes: [
      "platform-overview",
      "prodoc",
      "documentation-samples",
      "getting-started",
    ],
  },
  {
    id: "profeed",
    label: "ProFeed",
    entrySlug: "profeed/overview",
    slugPrefixes: ["profeed"],
  },
  {
    id: "proassist",
    label: "ProAssist",
    entrySlug: "proassist/overview",
    slugPrefixes: ["proassist"],
  },
  {
    id: "proapi",
    label: "ProAPI",
    entrySlug: "proapi/overview",
    slugPrefixes: ["proapi"],
  },
  {
    id: "proinsights",
    label: "ProInsights",
    entrySlug: "proinsights/overview",
    slugPrefixes: ["proinsights"],
  },
];

/** Slugs excluded from the documentation portal (portfolio / legacy sections). */
export const HIDDEN_DOC_PREFIXES = new Set([
  "samples",
  "tutorials",
  "apis",
  "concepts",
  "troubleshooting",
  "updates",
  "insights",
  "contribute",
]);

export const DOCS_RESOURCE_LINKS = [
  { label: "Knowledge Base", slug: "knowledge-base" },
  { label: "Glossary", slug: "glossary" },
  { label: "Changelog", slug: "changelog" },
  { label: "Blog", slug: "blog" },
] as const;

export const DOCS_VERSIONS = [
  { label: "2.4 (current)", slug: "current" },
  { label: "2.3", slug: "2.3" },
] as const;

export function resolveProductId(pathSlug: string): DocsProductId {
  const first = pathSlug.split("/")[0] ?? "";
  for (const product of DOCS_PRODUCTS) {
    if (product.slugPrefixes.some((p) => pathSlug === p || pathSlug.startsWith(`${p}/`))) {
      return product.id;
    }
  }
  if (["knowledge-base", "glossary", "changelog", "blog"].includes(first)) {
    return "prodoc";
  }
  return "prodoc";
}

export function listProductNavItems(productId: DocsProductId): NavLeaf[] {
  const product = DOCS_PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];

  return listNavDocs()
    .filter((doc) => {
      const first = doc.slug.split("/")[0] ?? "";
      if (HIDDEN_DOC_PREFIXES.has(first)) return false;
      return product.slugPrefixes.some(
        (p) => doc.slug === p || doc.slug.startsWith(`${p}/`),
      );
    })
    .map((doc) => ({ type: "doc" as const, ...doc }));
}

export function isResourceSection(slug: string): boolean {
  const first = slug.split("/")[0] ?? "";
  return ["blog", "glossary", "knowledge-base", "changelog"].includes(first);
}

export function listResourceNavItems(slug: string): NavLeaf[] {
  const first = slug.split("/")[0] ?? "";
  const filter = (predicate: (s: string) => boolean) =>
    listNavDocs()
      .filter((d) => predicate(d.slug))
      .map((d) => ({ type: "doc" as const, ...d }));

  if (first === "blog") {
    return filter((s) => s.startsWith("blog/") || s === "blog");
  }
  if (first === "glossary") {
    return filter((s) => s.startsWith("glossary"));
  }
  if (first === "knowledge-base") {
    return filter((s) => s.startsWith("knowledge-base"));
  }
  if (first === "changelog") {
    return filter((s) => s === "changelog");
  }
  return [];
}
