export const platformPage = {
  metadata: {
    title: "The Documentation Intelligence Platform",
    description:
      "Create documentation, help users discover it, answer questions with AI, collect feedback, and improve with analytics.",
  },
  hero: {
    eyebrow: "Documentation Intelligence Platform",
    title: "The Documentation Intelligence Platform",
    subtitle:
      "A connected workflow for SaaS teams — from docs-as-code authoring to AI assistance, feedback loops, and content analytics.",
  },
  workflow: {
    heading: "How the platform works",
    steps: [
      { label: "Create Documentation", product: "ProDoc" },
      { label: "Discover Content", product: "ProDoc" },
      { label: "Ask AI", product: "ProAssist" },
      { label: "Submit Feedback", product: "ProFeed" },
      { label: "Analyze Insights", product: "ProInsights" },
      { label: "Improve Documentation", product: "ProDoc" },
    ],
  },
  products: [
    {
      name: "ProDoc",
      tagline: "Modern docs-as-code platform for product and developer documentation.",
      href: "/products/prodoc",
      role: "Authoring hub",
    },
    {
      name: "ProAssist",
      tagline: "AI-powered documentation assistant.",
      href: "/products/proassist",
      role: "Instant answers",
    },
    {
      name: "ProFeed",
      tagline: "Documentation feedback and customer insight platform.",
      href: "/products/profeed",
      role: "Reader signals",
    },
    {
      name: "ProInsights",
      tagline: "Documentation analytics and content performance.",
      href: "/products/proinsights",
      role: "Content intelligence",
    },
    {
      name: "ProAPI",
      tagline: "Developer portal and API documentation.",
      href: "/products/proapi",
      role: "Developer experience",
    },
  ],
  branchNote: {
    title: "Developer portal branch",
    body: "ProAPI runs alongside the core loop — API references, OpenAPI, SDK examples, and interactive requests for engineering teams.",
  },
  cta: {
    primary: { label: "Explore products", href: "/products" },
    secondary: { label: "Live documentation", href: "__PRODOC_ENTRY__" },
  },
};
