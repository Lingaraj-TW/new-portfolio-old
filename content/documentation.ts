/**
 * Documentation Hub content — categories, curated article lists, and
 * developer-portal deep links. Doc slugs are resolved against real MDX
 * frontmatter server-side (missing docs are dropped, like the portal sidebar),
 * so this file stays a plain data module that any component can import.
 */

export type DocHubIconKey =
  | "Rocket"
  | "BookOpen"
  | "GraduationCap"
  | "Lightbulb"
  | "Library"
  | "Wrench"
  | "HelpCircle"
  | "Database"
  | "History"
  | "Compass"
  | "FileText"
  | "Code2"
  | "KeyRound"
  | "Braces"
  | "Boxes"
  | "TerminalSquare"
  | "PlayCircle"
  | "ScrollText";

export type DocHubCategory = {
  slug: string;
  title: string;
  description: string;
  iconKey: DocHubIconKey;
  /** Slug into the docs portal (rendered via docPageHref). */
  docSlug?: string;
  /** Direct route href — used instead of docSlug (e.g. ProAPI portal). */
  href?: string;
};

/** Curated article reference — title/description resolved from frontmatter. */
export type DocHubArticleRef = {
  docSlug: string;
  /** Optional label override when frontmatter title is too long for a list. */
  label?: string;
};

export type DocHubDevLink = {
  title: string;
  description: string;
  iconKey: DocHubIconKey;
  href?: string;
  /** Slug into the docs portal when the page is MDX rather than a route. */
  docSlug?: string;
};

export const documentationHub = {
  metadata: {
    title: "Documentation Hub",
    description:
      "The single entry point to the ProDoc platform documentation — getting started, user guides, tutorials, concepts, reference, troubleshooting, and the ProAPI developer portal.",
  },
  hero: {
    eyebrow: "Documentation Hub",
    title: "Everything you need, documented",
    description:
      "One place to explore the ProDoc platform documentation — production-style guides, tutorials, concepts, API references, and release notes, all authored docs-as-code.",
    searchPlaceholder: "Search documentation…",
  },
  quickLinks: [
    { label: "Getting Started", docSlug: "getting-started/intro" },
    { label: "Writing Samples", docSlug: "documentation-samples" },
    { label: "API Reference", href: "/proapi/api-reference" },
    { label: "Release Notes", docSlug: "changelog" },
  ] as { label: string; docSlug?: string; href?: string }[],
  categoriesHeading: {
    eyebrow: "Browse by category",
    title: "Documentation categories",
    description:
      "Structured the way a production documentation portal is — by audience and task, not by feature.",
  },
  categories: [
    {
      slug: "getting-started",
      title: "Getting Started",
      description: "Platform introduction, first project, and quick start.",
      iconKey: "Rocket",
      docSlug: "getting-started/intro",
    },
    {
      slug: "user-guides",
      title: "User Guides",
      description:
        "Production-style installation, implementation, and how-to guides.",
      iconKey: "BookOpen",
      docSlug: "documentation-samples",
    },
    {
      slug: "tutorials",
      title: "Tutorials",
      description:
        "Hands-on walkthroughs — from setup to the full documentation loop.",
      iconKey: "GraduationCap",
      docSlug: "tutorials/setup-prodoc",
    },
    {
      slug: "concepts",
      title: "Concepts",
      description:
        "Docs-as-code, feedback-driven docs, and the intelligence loop.",
      iconKey: "Lightbulb",
      docSlug: "concepts/docs-as-code",
    },
    {
      slug: "developer-guide",
      title: "Developer Guide",
      description:
        "Authentication, REST APIs, SDKs, and the interactive playground.",
      iconKey: "Code2",
      href: "/proapi/getting-started",
    },
    {
      slug: "reference",
      title: "Reference",
      description: "FAQ, glossary, and platform reference material.",
      iconKey: "Library",
      docSlug: "reference/faq",
    },
    {
      slug: "troubleshooting",
      title: "Troubleshooting",
      description: "Diagnose and resolve common platform issues.",
      iconKey: "Wrench",
      docSlug: "troubleshooting/overview",
    },
    {
      slug: "knowledge-base",
      title: "Knowledge Base",
      description: "Support articles answering real customer questions.",
      iconKey: "Database",
      docSlug: "knowledge-base",
    },
    {
      slug: "release-notes",
      title: "Release Notes",
      description: "What shipped, what changed, and what is deprecated.",
      iconKey: "History",
      docSlug: "changelog",
    },
    {
      slug: "platform-overview",
      title: "Platform Overview",
      description: "How the five products connect into one ecosystem.",
      iconKey: "Compass",
      docSlug: "platform-overview/ecosystem-overview",
    },
    {
      slug: "best-practices",
      title: "Best Practices",
      description: "API standards, governance, and versioning strategy.",
      iconKey: "Braces",
      docSlug: "proapi/api-standards",
    },
    {
      slug: "glossary",
      title: "Glossary",
      description: "Shared terminology across products and documentation.",
      iconKey: "ScrollText",
      docSlug: "glossary",
    },
  ] as DocHubCategory[],
  featuredHeading: {
    eyebrow: "Start here",
    title: "Featured guides",
  },
  featuredGuides: [
    { docSlug: "getting-started/intro" },
    { docSlug: "prodoc/authoring-and-publishing" },
    { docSlug: "documentation-samples/installation-guide" },
    { docSlug: "profeed/feedback-lifecycle" },
  ] as DocHubArticleRef[],
  recentlyUpdatedHeading: "Recently updated",
  recentlyUpdated: [
    { docSlug: "documentation-samples/release-notes-v5-4-0" },
    { docSlug: "documentation-samples/customer-payment-api" },
    { docSlug: "proinsights/documentation-health-score" },
    { docSlug: "tutorials/end-to-end-loop" },
    { docSlug: "changelog" },
  ] as DocHubArticleRef[],
  popularHeading: "Popular articles",
  popular: [
    { docSlug: "documentation-samples/how-to-submit-grievance" },
    { docSlug: "documentation-samples/payment-troubleshooting" },
    { docSlug: "documentation-samples/claim-still-pending-kb" },
    { docSlug: "proassist/citation-based-answers" },
    { docSlug: "concepts/documentation-intelligence-loop" },
  ] as DocHubArticleRef[],
  developer: {
    eyebrow: "Developer portal",
    title: "Developer documentation",
    description:
      "API documentation lives in ProAPI — a dedicated developer portal with an OpenAPI-driven reference, code samples, SDKs, and an interactive playground. Every card below deep-links into it.",
    portalHref: "/proapi",
    portalLabel: "Open ProAPI",
    links: [
      {
        title: "Getting Started",
        description: "Base URLs, environments, and your first request.",
        href: "/proapi/getting-started",
        iconKey: "Rocket",
      },
      {
        title: "Authentication & API Keys",
        description: "OAuth 2.0, API keys, scopes, and token lifecycle.",
        href: "/proapi/authentication",
        iconKey: "KeyRound",
      },
      {
        title: "REST API Reference",
        description: "OpenAPI-driven endpoint reference with live examples.",
        href: "/proapi/api-reference",
        iconKey: "Braces",
      },
      {
        title: "Guides",
        description: "Rate limits, pagination, filtering, errors, webhooks.",
        href: "/proapi/guides",
        iconKey: "BookOpen",
      },
      {
        title: "SDKs & Postman",
        description: "Client libraries, CLI, and a ready Postman collection.",
        href: "/proapi/sdks",
        iconKey: "Boxes",
      },
      {
        title: "API Playground",
        description: "Try requests against mock endpoints in the browser.",
        href: "/proapi/playground",
        iconKey: "PlayCircle",
      },
      {
        title: "API Changelog",
        description: "Versioned API changes, deprecations, and migrations.",
        href: "/proapi/changelog",
        iconKey: "History",
      },
      {
        title: "API Standards",
        description: "Design standards and governance behind the API surface.",
        docSlug: "proapi/api-standards",
        iconKey: "TerminalSquare",
      },
    ] as DocHubDevLink[],
  },
  health: {
    eyebrow: "Documentation intelligence",
    title: "Documentation health",
    description:
      "ProInsights scores every page on freshness, coverage, and feedback signals — this is the loop that keeps the docs honest.",
    scoreLabel: "Platform health score",
    score: "92",
    metrics: [
      { label: "Freshness", value: "96%", hint: "Pages updated this release" },
      { label: "Coverage", value: "88%", hint: "Features with documentation" },
      { label: "Feedback signal", value: "4.6/5", hint: "ProFeed helpfulness" },
    ],
    linkLabel: "How the health score works",
    docSlug: "proinsights/documentation-health-score",
  },
  statsHeading: "Content statistics",
} as const;
