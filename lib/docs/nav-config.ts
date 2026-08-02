import type { ProductId } from "@/lib/docs/sidebar";

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

export { DOCS_VERSIONS, DOCS_LATEST_VERSION } from "@/lib/docs/versions";

export function categoryContainsSlug(
  category: ResolvedSidebarCategory,
  slug: string,
): boolean {
  for (const item of category.items) {
    if (item.type === "doc") {
      if (item.slug === slug) return true;
    } else if (categoryContainsSlug(item, slug)) {
      return true;
    }
  }
  return false;
}

export function shouldExpandCategory(
  category: ResolvedSidebarCategory,
  currentSlug: string,
): boolean {
  if (categoryContainsSlug(category, currentSlug)) return true;
  return !category.collapsed;
}
