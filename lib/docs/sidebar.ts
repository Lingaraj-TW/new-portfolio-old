/**
 * ProDocs portal sidebar — main IA + per-product sidebars.
 * Main sidebar: Getting Started, Platform Overview, Samples, Reference.
 * Product docs: navbar Products dropdown → local sidebar per product.
 */

export type ProductId =
  | "prodoc"
  | "profeed"
  | "proassist"
  | "proapi"
  | "proinsights";

export type SidebarDocLink = {
  type: "doc";
  slug: string;
  label?: string;
};

export type SidebarCategory = {
  type: "category";
  label: string;
  collapsed?: boolean;
  collapsible?: boolean;
  items: SidebarNode[];
};

export type SidebarNode = SidebarDocLink | SidebarCategory;

export function collectSidebarSlugs(nodes: SidebarNode[]): string[] {
  const slugs: string[] = [];
  for (const node of nodes) {
    if (node.type === "doc") slugs.push(node.slug);
    else slugs.push(...collectSidebarSlugs(node.items));
  }
  return slugs;
}

export const PRODUCT_NAV: {
  id: ProductId;
  label: string;
  entrySlug: string;
}[] = [
  { id: "prodoc", label: "ProDoc", entrySlug: "prodoc/overview" },
  { id: "profeed", label: "ProFeed", entrySlug: "profeed/overview" },
  { id: "proassist", label: "ProAssist", entrySlug: "proassist/overview" },
  { id: "proapi", label: "ProAPI", entrySlug: "proapi/overview" },
  { id: "proinsights", label: "ProInsights", entrySlug: "proinsights/overview" },
];

/** Flat doc list per product — shown in product-local sidebar. */
export const PRODUCT_SIDEBARS: Record<ProductId, SidebarDocLink[]> = {
  prodoc: [
    { type: "doc", slug: "prodoc/overview", label: "ProDoc Overview" },
    {
      type: "doc",
      slug: "prodoc/authoring-and-publishing",
      label: "Authoring & Publishing",
    },
    {
      type: "doc",
      slug: "prodoc/enable-profeed-feedback",
      label: "Enable ProFeed Feedback",
    },
  ],
  profeed: [
    { type: "doc", slug: "profeed/overview", label: "ProFeed Overview" },
    {
      type: "doc",
      slug: "profeed/feedback-lifecycle",
      label: "Feedback Lifecycle",
    },
    {
      type: "doc",
      slug: "profeed/managing-customer-feedback",
      label: "Managing Feedback",
    },
    {
      type: "doc",
      slug: "profeed/feedback-resolution-process",
      label: "Feedback Resolution Workflow",
    },
  ],
  proassist: [
    { type: "doc", slug: "proassist/overview", label: "ProAssist Overview" },
    {
      type: "doc",
      slug: "proassist/ai-search-experience",
      label: "AI Search Experience",
    },
    {
      type: "doc",
      slug: "proassist/citation-based-answers",
      label: "Citation-Based Answers",
    },
    {
      type: "doc",
      slug: "proassist/smart-suggestions",
      label: "Smart Suggestions",
    },
  ],
  proapi: [
    { type: "doc", slug: "proapi/overview", label: "ProAPI Overview" },
    { type: "doc", slug: "proapi/api-governance", label: "API Governance" },
    { type: "doc", slug: "proapi/api-standards", label: "API Standards" },
    {
      type: "doc",
      slug: "proapi/versioning-strategy",
      label: "Versioning Strategy",
    },
  ],
  proinsights: [
    {
      type: "doc",
      slug: "proinsights/overview",
      label: "ProInsights Overview",
    },
    {
      type: "doc",
      slug: "proinsights/documentation-analytics",
      label: "Documentation Analytics",
    },
    {
      type: "doc",
      slug: "proinsights/search-analytics",
      label: "Search Analytics",
    },
    {
      type: "doc",
      slug: "proinsights/feedback-trends",
      label: "Feedback Trends",
    },
    {
      type: "doc",
      slug: "proinsights/documentation-health-score",
      label: "Documentation Health Score",
    },
  ],
};

/** Main documentation sidebar — no product pages. */
export const MAIN_DOCS_SIDEBAR: SidebarCategory[] = [
  {
    type: "category",
    label: "Getting Started",
    collapsed: false,
    collapsible: true,
    items: [{ type: "doc", slug: "getting-started/intro", label: "Intro" }],
  },
  {
    type: "category",
    label: "Platform Overview",
    collapsed: false,
    collapsible: true,
    items: [
      {
        type: "doc",
        slug: "platform-overview/ecosystem-overview",
        label: "ProDocs Ecosystem Overview",
      },
      {
        type: "doc",
        slug: "platform-overview/positioning",
        label: "Product Positioning",
      },
    ],
  },
  {
    type: "category",
    label: "Documentation Samples",
    collapsed: true,
    collapsible: true,
    items: [
      {
        type: "doc",
        slug: "documentation-samples/index",
        label: "Documentation Samples Hub",
      },
      {
        type: "category",
        label: "Installation & Implementation",
        collapsed: true,
        collapsible: true,
        items: [
          {
            type: "doc",
            slug: "documentation-samples/installation-guide",
            label: "Installing the Insurance Claims Platform",
          },
          {
            type: "doc",
            slug: "documentation-samples/implementation-appeals",
            label: "Implementing Appeals Management Workflow",
          },
          {
            type: "doc",
            slug: "documentation-samples/payment-gateway-configuration",
            label: "Payment Gateway Configuration",
          },
        ],
      },
      {
        type: "category",
        label: "How-To Guides",
        collapsed: true,
        collapsible: true,
        items: [
          {
            type: "doc",
            slug: "documentation-samples/how-to-submit-grievance",
            label: "How to Submit a Grievance Form",
          },
          {
            type: "doc",
            slug: "documentation-samples/allocate-resources",
            label: "How to Allocate Resources to a Project",
          },
          {
            type: "doc",
            slug: "documentation-samples/onboard-new-carrier",
            label: "How to Onboard a New Carrier",
          },
        ],
      },
      {
        type: "category",
        label: "Release & Engineering",
        collapsed: true,
        collapsible: true,
        items: [
          {
            type: "doc",
            slug: "documentation-samples/release-notes-v5-4-0",
            label: "Release Notes v5.4.0",
          },
          {
            type: "doc",
            slug: "documentation-samples/def-2458-duplicate-payment",
            label: "DEF-2458 Duplicate Payment Processing",
          },
          {
            type: "doc",
            slug: "documentation-samples/database-changes-v5-4-0",
            label: "Database Changes v5.4.0",
          },
        ],
      },
      {
        type: "category",
        label: "API & Integration",
        collapsed: true,
        collapsible: true,
        items: [
          {
            type: "doc",
            slug: "documentation-samples/customer-payment-api",
            label: "Customer Payment API Integration",
          },
        ],
      },
      {
        type: "category",
        label: "Support & Troubleshooting",
        collapsed: true,
        collapsible: true,
        items: [
          {
            type: "doc",
            slug: "documentation-samples/claim-still-pending-kb",
            label: "Why Is My Claim Still Pending?",
          },
          {
            type: "doc",
            slug: "documentation-samples/payment-troubleshooting",
            label: "Common Payment Processing Issues",
          },
        ],
      },
      {
        type: "category",
        label: "Training Center",
        collapsed: true,
        collapsible: true,
        items: [
          {
            type: "doc",
            slug: "documentation-samples/submit-first-feedback-video",
            label: "Submit Your First Feedback in 10 Minutes",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    label: "Tutorials",
    collapsed: true,
    collapsible: true,
    items: [
      { type: "doc", slug: "tutorials/setup-prodoc", label: "Set Up ProDoc" },
      {
        type: "doc",
        slug: "tutorials/enable-profeed-feedback",
        label: "Enable ProFeed Feedback",
      },
      {
        type: "doc",
        slug: "tutorials/analyze-with-proinsights",
        label: "Analyze with ProInsights",
      },
      {
        type: "doc",
        slug: "tutorials/improve-docs-using-insights",
        label: "Improve Docs Using Insights",
      },
      {
        type: "doc",
        slug: "tutorials/end-to-end-loop",
        label: "End-to-End Documentation Loop",
      },
    ],
  },
  {
    type: "category",
    label: "Concepts",
    collapsed: true,
    collapsible: true,
    items: [
      { type: "doc", slug: "concepts/docs-as-code", label: "Docs-as-Code" },
      {
        type: "doc",
        slug: "concepts/documentation-intelligence-loop",
        label: "Documentation Intelligence Loop",
      },
      {
        type: "doc",
        slug: "concepts/feedback-driven-docs",
        label: "Feedback-Driven Docs",
      },
    ],
  },
  {
    type: "category",
    label: "Reference",
    collapsed: true,
    collapsible: true,
    items: [
      { type: "doc", slug: "reference/faq", label: "FAQ" },
      { type: "doc", slug: "glossary", label: "Glossary" },
      {
        type: "doc",
        slug: "troubleshooting/overview",
        label: "Troubleshooting",
      },
      { type: "doc", slug: "knowledge-base", label: "Knowledge Base" },
      { type: "doc", slug: "changelog", label: "Release Notes" },
    ],
  },
];

const productSlugs = Object.values(PRODUCT_SIDEBARS).flatMap((items) =>
  items.map((i) => i.slug),
);

export const SIDEBAR_INDEX_SLUGS = new Set([
  ...collectSidebarSlugs(MAIN_DOCS_SIDEBAR),
  ...productSlugs,
]);

/** Detect which product section the current doc belongs to, if any. */
export function detectProductSection(slug: string): ProductId | null {
  for (const product of PRODUCT_NAV) {
    const prefix = `${product.id}/`;
    if (slug === product.entrySlug || slug.startsWith(prefix)) {
      return product.id;
    }
  }
  return null;
}

export { DOCS_VERSIONS, DOCS_LATEST_VERSION } from "@/lib/docs/versions";
