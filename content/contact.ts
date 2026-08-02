/** Portfolio card — set NEXT_PUBLIC_SITE_URL after Vercel deploy (e.g. https://prodoc.vercel.app). */
export function getPortfolioContactLink(): { value: string; href: string } {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim();

  const href = raw
    ? raw.startsWith("http")
      ? raw.replace(/\/$/, "")
      : `https://${raw.replace(/\/$/, "")}`
    : "https://your-name.vercel.app";

  return {
    href,
    value: href.replace(/^https?:\/\//, ""),
  };
}

/** Rotating opportunity types in the contact section hero. */
export const contactOpportunityRoles = [
  "Technical Writing",
  "API Documentation",
  "Docs-as-Code",
] as const;

export const contactSubjectOptions = [
  { value: "full-time", label: "Full-time Role" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
] as const;

export type ContactSubjectValue = (typeof contactSubjectOptions)[number]["value"];

export const contactSocialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lingarajm/",
    icon: "linkedin" as const,
  },
  {
    label: "GitHub",
    href: "https://github.com/lingaraj-tw/prodoc",
    icon: "github" as const,
  },
] as const;

export const contactPage = {
  metadata: {
    title: "Contact",
    description:
      "Get in touch for documentation strategy, contract technical writing, or full-time roles.",
  },
  heading: "Contact",
  intro:
    "Say hello for documentation strategy, contract technical writing, or full-time roles.",
  connectLead: "Let's connect for",
  directContactLabel: "Direct Contact",
  madeInIndia: "Made with ♥ in India",
  links: [
    {
      icon: "phone" as const,
      label: "Phone",
      value: "+91 90038 63614",
      href: "tel:+919003863614",
      external: false,
    },
    {
      icon: "mail" as const,
      label: "Email",
      value: "lingaraj.m.tw@gmail.com",
      href: "mailto:lingaraj.m.tw@gmail.com",
      external: false,
    },
    {
      icon: "globe" as const,
      label: "Portfolio",
      value: "your-name.vercel.app",
      href: "https://your-name.vercel.app",
      external: true,
    },
    {
      icon: "linkedin" as const,
      label: "LinkedIn",
      value: "linkedin.com/in/lingarajm",
      href: "https://www.linkedin.com/in/lingarajm/",
      external: true,
    },
  ],
};

export const quickFacts = {
  title: "Quick Facts",
  footerNote:
    "This site showcases ProDoc — a documentation ecosystem concept by Linga Raj M, built to demonstrate documentation infrastructure thinking at a product scale.",
  footerHighlight: "ProDoc",
  rows: [
    {
      label: "Availability",
      values: [
        { text: "Chennai · Bangalore · Hyderabad (On-site)", muted: false },
        { text: "Remote · India & International", muted: true },
      ],
    },
    {
      label: "Languages",
      values: [{ text: "English · Tamil", muted: true }],
    },
    {
      label: "Domains",
      values: [
        {
          text: "Healthcare SaaS · SAP Enterprise Resource Planning (ERP) · Enterprise B2B · E-commerce Applications",
          muted: true,
        },
      ],
    },
    {
      label: "AI Tools",
      accent: true,
      values: [
        {
          text: "ChatGPT · Claude AI · Grammarly Business · Notion AI",
          muted: true,
        },
        {
          text: "Cursor · GitHub Copilot · Copilot Studio Agents",
          muted: true,
        },
      ],
    },
    {
      label: "Formats",
      values: [
        {
          text: "Docs-as-Code · XML · DITA · Markdown · OpenAPI · JSON · YAML",
          muted: true,
        },
      ],
    },
  ],
};

export const footer = {
  brand: {
    description:
      "Documentation infrastructure for SaaS and enterprise product teams.",
  },
  navigate: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Documentation", href: "/documentation" },
    { label: "Contact", href: "/#contact" },
  ],
  connect: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/lingarajm/",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/lingaraj-tw/prodoc",
      external: true,
    },
    { label: "Email", href: "mailto:lingaraj.m.tw@gmail.com" },
    { label: "Phone", href: "tel:+919003863614" },
  ],
  builtWith: {
    philosophy: "Built with Docs-as-Code philosophy",
    powered: "Powered by real documentation workflows",
  },
  prodoc: {
    highlight: quickFacts.footerHighlight,
    note: quickFacts.footerNote,
    demoHref: "/products/prodoc",
    demoLabel: "ProDoc demo",
  },
  /** @deprecated Use footer.builtWith — kept for simple consumers */
  tagline:
    "Built with Docs-as-Code philosophy · Powered by real documentation workflows",
  copyright: "Linga Raj M — Senior Technical Writer",
};
