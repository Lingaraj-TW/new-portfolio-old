import type { ProductNavItem } from "./types";

export const productNavItems: ProductNavItem[] = [
  {
    slug: "prodoc",
    name: "ProDoc",
    subtitle: "Modern docs-as-code platform for product and developer documentation.",
    href: "/products/prodoc",
    iconKey: "FileText",
  },
  {
    slug: "proassist",
    name: "ProAssist",
    subtitle: "AI-powered documentation assistant.",
    href: "/products/proassist",
    iconKey: "Sparkles",
  },
  {
    slug: "profeed",
    name: "ProFeed",
    subtitle: "Documentation feedback and customer insight platform.",
    href: "/products/profeed",
    iconKey: "MessageSquare",
  },
  {
    slug: "proinsights",
    name: "ProInsights",
    subtitle: "Documentation analytics and content performance.",
    href: "/products/proinsights",
    iconKey: "BarChart3",
  },
  {
    slug: "proapi",
    name: "ProAPI",
    subtitle: "Developer portal and API documentation.",
    href: "/products/proapi",
    iconKey: "Code2",
  },
];

export const productsOverview = {
  eyebrow: "Documentation platform",
  title: "Five connected applications",
  description:
    "A focused documentation intelligence platform — authoring, AI assistance, feedback, analytics, and developer portals in one ecosystem.",
};

export { prodocContent } from "./prodoc";
export { proassistContent } from "./proassist";
export { profeedContent } from "./profeed";
export { proinsightsContent } from "./proinsights";
export { proapiContent } from "./proapi";
