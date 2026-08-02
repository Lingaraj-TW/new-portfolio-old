export const siteBrand = {
  name: "Linga Raj M",
  subtitle: "Documentation Platform Strategist",
};

export const hero = {
  eyebrow:
    "Documentation Platform Strategist | Senior Technical Writer • Chennai, India",
  headline: "Documentation Ecosystems for Modern SaaS Teams",
  subtitle:
    "I design documentation platforms, AI-powered knowledge experiences, developer portals, feedback systems, and analytics-driven content ecosystems that improve product adoption and customer success.",
  primaryCta: {
    label: "View Platform",
    href: "/platform",
  },
  secondaryCta: {
    label: "Explore Products",
    href: "/products",
  },
  capabilityPills: [
    "Documentation Platforms",
    "AI Documentation",
    "Developer Experience",
    "Documentation Analytics",
    "Feedback Operations",
    "SaaS Product Docs",
  ],
};

export const ecosystemSection = {
  heading: "The Documentation Intelligence Platform",
};

export const portfolioSection = {
  eyebrow: "Platform",
  title: "Documentation ecosystem for",
  titleAccent: "modern SaaS teams",
  description:
    "Five connected applications — authoring, AI assistance, feedback, analytics, and developer portals — built to improve product adoption, developer experience, and customer success.",
};

export const achievementsSection = {
  heading: "Key achievements",
  description:
    "Documentation architecture, knowledge programs, and AI workflow automation — outcomes that scale documentation like a product.",
};

export const visibleTagCount = 5;

export const featuredProducts = [
  {
    title: "ProDoc",
    shortDescription:
      "Modern docs-as-code platform — MDX guides, API references, search, and content health indicators.",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "MDX",
      "Docs-as-Code",
      "Versioned docs",
      "Search",
    ],
    liveDemoHref: "/products/prodoc",
    previewImage: "/portfolio/prodoc.png",
  },
  {
    title: "ProAssist",
    shortDescription:
      "AI-powered documentation assistant — citation-based answers, smart search, and follow-up suggestions.",
    tags: [
      "Gemini AI",
      "RAG",
      "Semantic search",
      "Citations",
      "Chat UI",
      "Next.js API",
    ],
    liveDemoHref: "/products/proassist",
    previewImage: "/portfolio/prodoc.png",
  },
  {
    title: "ProFeed",
    shortDescription:
      "Documentation feedback platform — triage workflows, status tracking, admin inbox, and customer portal.",
    tags: [
      "Next.js 16",
      "TypeScript",
      "Supabase",
      "Row Level Security",
      "REST APIs",
      "Triage workflows",
    ],
    liveDemoHref: "/products/profeed",
    previewImage: "/portfolio/profeed.png",
  },
  {
    title: "ProInsights",
    shortDescription:
      "Documentation analytics — usage trends, search success, feedback volume, and content health scores.",
    tags: [
      "Next.js 16",
      "Recharts",
      "TypeScript",
      "Supabase",
      "Analytics views",
      "Content health",
    ],
    liveDemoHref: "/products/proinsights",
    previewImage: "/portfolio/proinsights.png",
  },
  {
    title: "ProAPI",
    shortDescription:
      "Developer portal — API reference, OpenAPI support, SDK examples, and interactive try-it requests.",
    tags: [
      "OpenAPI",
      "API reference",
      "SDK examples",
      "Developer portal",
      "Code snippets",
      "Authentication guides",
    ],
    liveDemoHref: "/products/proapi",
    previewImage: "/portfolio/prodoc.png",
  },
];

export const highlights = [
  {
    icon: "award" as const,
    title: "Independent documentation ownership",
    body: "Served as sole Technical Writer at Evora and Grab A Grub, independently leading planning, content strategy, authoring, publishing, and maintenance with minimal supervision.",
    featured: true,
  },
  {
    icon: "trendingUp" as const,
    title: "Knowledge base from scratch",
    body: "Designed and built a customer-facing Document360 knowledge base for EvoSuite — information architecture, taxonomy, navigation, templates, and documentation governance.",
  },
  {
    icon: "bot" as const,
    title: "Developer docs & AI-assisted workflows",
    body: "Delivered API documentation, implementation guides, and troubleshooting content that improved customer self-service; introduced reusable templates and AI-assisted authoring for consistency.",
  },
] as const;

/** What I deliver — pillars and hiring CTA (toolkit lives in #skills). */
export const closingSection = {
  eyebrow: "What I build",
  title: "Documentation ecosystems that improve adoption and DX",
  description:
    "I build documentation platforms engineers trust and customers actually use — with AI assistance, feedback loops, and analytics that close the improvement cycle.",
  pillars: [
    {
      icon: "fileCode" as const,
      title: "Documentation platforms",
      body: "Docs-as-Code pipelines, MDX authoring, API references, and developer portals aligned with release trains.",
    },
    {
      icon: "sparkles" as const,
      title: "AI-powered knowledge systems",
      body: "Citation-based assistants, smart search, and content gap detection — not generic AI filler.",
    },
    {
      icon: "loop" as const,
      title: "Feedback-driven improvement",
      body: "Reader signals, triage workflows, and analytics loops — the ProDoc ecosystem demo on this site.",
    },
  ],
  cta: {
    headline: "Let's build documentation that scales with your product",
    subline: "Open to full-time, contract, and freelance roles — remote or on-site in India.",
    actions: [
      { label: "View platform", href: "/platform", variant: "secondary" as const },
      {
        label: "Download resume",
        href: "/downloads/Linga_Raj_M_Resume.pdf",
        variant: "secondary" as const,
        download: true,
      },
      { label: "Contact me", href: "#contact", variant: "primary" as const },
    ],
  },
};

export const proDocHeroOnHome = {
  demoHref: "/products/prodoc#concept-demo",
};
