import "server-only";

import { getDocMeta } from "@/lib/docs/paths";
import {
  MAIN_DOCS_SIDEBAR,
  PRODUCT_SIDEBARS,
  SIDEBAR_INDEX_SLUGS,
  type ProductId,
  type SidebarCategory,
  type SidebarDocLink,
  type SidebarNode,
} from "@/lib/docs/sidebar";

export type ResolvedSidebarDoc = {
  type: "doc";
  slug: string;
  title: string;
};

export type ResolvedSidebarCategory = {
  type: "category";
  label: string;
  collapsed: boolean;
  collapsible: boolean;
  items: ResolvedSidebarNode[];
};

export type ResolvedSidebarNode = ResolvedSidebarDoc | ResolvedSidebarCategory;

export type PortalNavData = {
  mainSidebar: ResolvedSidebarCategory[];
  productSidebars: Record<ProductId, ResolvedSidebarDoc[]>;
};

function resolveDoc(node: SidebarDocLink): ResolvedSidebarDoc | null {
  const meta = getDocMeta(node.slug);
  if (!meta) return null;
  return {
    type: "doc",
    slug: node.slug,
    title: node.label ?? meta.title,
  };
}

function resolveNode(node: SidebarNode): ResolvedSidebarNode | null {
  if (node.type === "doc") return resolveDoc(node);

  const items = node.items
    .map(resolveNode)
    .filter((n): n is ResolvedSidebarNode => n !== null);

  if (items.length === 0) return null;

  return {
    type: "category",
    label: node.label,
    collapsed: node.collapsed ?? false,
    collapsible: node.collapsible ?? true,
    items,
  };
}

export function buildPortalNavData(): PortalNavData {
  const mainSidebar = MAIN_DOCS_SIDEBAR.map((section) => resolveNode(section)).filter(
    (n): n is ResolvedSidebarCategory => n !== null && n.type === "category",
  );

  const productSidebars = {} as Record<ProductId, ResolvedSidebarDoc[]>;
  for (const [id, items] of Object.entries(PRODUCT_SIDEBARS) as [
    ProductId,
    SidebarDocLink[],
  ][]) {
    productSidebars[id] = items
      .map(resolveDoc)
      .filter((d): d is ResolvedSidebarDoc => d !== null);
  }

  return { mainSidebar, productSidebars };
}

export function buildPortalSearchIndex(): {
  slug: string;
  title: string;
  description?: string;
}[] {
  return [...SIDEBAR_INDEX_SLUGS]
    .map((slug) => {
      const meta = getDocMeta(slug);
      if (!meta) return null;
      return {
        slug,
        title: meta.title,
        description: meta.description,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}
