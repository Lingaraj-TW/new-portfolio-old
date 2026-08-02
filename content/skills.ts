export type TechIconKey =
  // Documentation Platforms
  | "confluence"
  | "document360"
  | "madcap-flare"
  | "docusaurus"
  | "robohelp"
  | "arbortext"
  | "ms-word"
  // API & Developer Tools
  | "swagger"
  | "postman"
  | "github"
  | "jira"
  | "azure-devops"
  | "vscode"
  // Docs-as-Code & Markup (workflow)
  | "docs-as-code"
  | "xml"
  | "dita"
  | "markdown"
  | "openapi"
  // Design & Visual Tools
  | "snagit"
  | "camtasia"
  | "canva"
  | "photoshop"
  | "miro"
  | "ms-visio"
  // Markup & Data Languages
  | "html5"
  | "css3"
  | "json"
  | "yaml"
  // Methodologies
  | "diataxis"
  | "information-architecture"
  | "agile"
  | "editorial"
  | "governance";

export type TechStackBadge = "most-used" | "primary" | "daily-driver";

export type TechTool = {
  id: string;
  name: string;
  icon: TechIconKey;
  label?: string;
  badge?: TechStackBadge;
  /** Larger bento tile */
  featured?: boolean;
  proficiency?: 1 | 2 | 3 | 4 | 5;
};

export type TechStackCategory = {
  id: string;
  title: string;
  description: string;
  tools: TechTool[];
  /** Bento column span on large screens */
  bento: "wide" | "standard";
};

export const techStackSection = {
  id: "skills",
  eyebrow: "Skills & Tech Stack",
  title: "Expertise across the documentation stack",
  subtitle:
    "Tools, platforms, workflows, and documentation ecosystems I use to build scalable content operations.",
  categories: [
    {
      id: "docs-platforms",
      title: "Documentation Platforms",
      description: "Enterprise CMS, help authoring, and product knowledge bases.",
      bento: "wide",
      tools: [
        {
          id: "confluence",
          name: "Confluence",
          icon: "confluence",
          label: "Enterprise",
          badge: "most-used",
          featured: true,
          proficiency: 5,
        },
        {
          id: "document360",
          name: "Document360",
          icon: "document360",
          label: "SaaS KB",
          proficiency: 5,
        },
        {
          id: "docusaurus",
          name: "Docusaurus",
          icon: "docusaurus",
          label: "Docs site",
          badge: "primary",
          featured: true,
          proficiency: 5,
        },
        {
          id: "madcap-flare",
          name: "MadCap Flare",
          icon: "madcap-flare",
          label: "HAT",
          proficiency: 4,
        },
        {
          id: "robohelp",
          name: "Adobe RoboHelp",
          icon: "robohelp",
          label: "HAT",
          proficiency: 4,
        },
        {
          id: "ms-word",
          name: "Microsoft 365",
          icon: "ms-word",
          label: "Productivity Suite",
          proficiency: 5,
        },
        {
          id: "arbortext",
          name: "Arbortext Editor",
          icon: "arbortext",
          label: "Structured",
          proficiency: 3,
        },
      ],
    },
    {
      id: "api-dev",
      title: "API & Developer Tools",
      description: "Spec-driven docs, testing, and version-controlled delivery.",
      bento: "standard",
      tools: [
        {
          id: "swagger",
          name: "Swagger / OpenAPI",
          icon: "swagger",
          label: "OpenAPI",
          badge: "most-used",
          featured: true,
          proficiency: 5,
        },
        {
          id: "postman",
          name: "Postman",
          icon: "postman",
          label: "API QA",
          proficiency: 5,
        },
        {
          id: "github",
          name: "GitHub",
          icon: "github",
          label: "Docs-as-Code",
          badge: "daily-driver",
          featured: true,
          proficiency: 5,
        },
        {
          id: "jira",
          name: "Jira",
          icon: "jira",
          label: "Agile Tracking",
          badge: "daily-driver",
          proficiency: 5,
        },
        {
          id: "azure-devops",
          name: "Azure DevOps",
          icon: "azure-devops",
          label: "CI/CD Docs",
          proficiency: 4,
        },
        {
          id: "vscode",
          name: "VS Code",
          icon: "vscode",
          label: "Code Editor",
          proficiency: 5,
        },
      ],
    },
    {
      id: "markup",
      title: "Docs-as-Code & Markup",
      description: "Structured content, standards, and developer-friendly authoring.",
      bento: "standard",
      tools: [
        {
          id: "docs-as-code",
          name: "Docs-as-Code",
          icon: "docs-as-code",
          label: "Workflow",
          badge: "primary",
          featured: true,
          proficiency: 5,
        },
        {
          id: "markdown",
          name: "Markdown",
          icon: "markdown",
          badge: "primary",
          proficiency: 5,
        },
        {
          id: "openapi",
          name: "OpenAPI",
          icon: "openapi",
          label: "Spec",
          proficiency: 5,
        },
        {
          id: "xml",
          name: "XML",
          icon: "xml",
          proficiency: 5,
        },
        {
          id: "dita",
          name: "DITA",
          icon: "dita",
          label: "Structured",
          proficiency: 4,
        },
      ],
    },
    {
      id: "design-visual",
      title: "Design & Visual Tools",
      description: "Screenshots, video documentation, diagrams, and visual assets.",
      bento: "wide",
      tools: [
        {
          id: "snagit",
          name: "Snagit",
          icon: "snagit",
          label: "Screenshots",
          badge: "most-used",
          featured: true,
          proficiency: 5,
        },
        {
          id: "canva",
          name: "Canva Pro",
          icon: "canva",
          label: "Design",
          badge: "most-used",
          featured: true,
          proficiency: 5,
        },
        {
          id: "camtasia",
          name: "Camtasia",
          icon: "camtasia",
          label: "Video Docs",
          proficiency: 4,
        },
        {
          id: "miro",
          name: "Miro",
          icon: "miro",
          label: "Diagrams",
          proficiency: 4,
        },
        {
          id: "ms-visio",
          name: "MS Visio",
          icon: "ms-visio",
          label: "Flowcharts",
          proficiency: 4,
        },
        {
          id: "photoshop",
          name: "Adobe Photoshop",
          icon: "photoshop",
          label: "Visual",
          proficiency: 4,
        },
      ],
    },
    {
      id: "markup-languages",
      title: "Markup & Data Languages",
      description: "Hands-on proficiency with the languages behind structured documentation.",
      bento: "standard",
      tools: [
        {
          id: "xml-lang",
          name: "XML",
          icon: "xml",
          label: "Structured",
          proficiency: 5,
        },
        {
          id: "markdown-lang",
          name: "Markdown",
          icon: "markdown",
          label: "Docs-as-Code",
          badge: "primary",
          proficiency: 5,
        },
        {
          id: "html5",
          name: "HTML5",
          icon: "html5",
          label: "Web Docs",
          proficiency: 4,
        },
        {
          id: "json",
          name: "JSON",
          icon: "json",
          label: "Data",
          proficiency: 4,
        },
        {
          id: "yaml",
          name: "YAML",
          icon: "yaml",
          label: "Config",
          proficiency: 4,
        },
        {
          id: "css3",
          name: "CSS3",
          icon: "css3",
          label: "Styling",
          proficiency: 3,
        },
      ],
    },
    {
      id: "methodologies",
      title: "Methodologies & Governance",
      description: "Frameworks for clarity, delivery rhythm, and content quality.",
      bento: "standard",
      tools: [
        {
          id: "diataxis",
          name: "Diátaxis",
          icon: "diataxis",
          label: "Framework",
          featured: true,
          proficiency: 5,
        },
        {
          id: "information-architecture",
          name: "Information Architecture",
          icon: "information-architecture",
          proficiency: 5,
        },
        {
          id: "agile",
          name: "Agile / Scrum",
          icon: "agile",
          label: "Delivery",
          proficiency: 5,
        },
        {
          id: "editorial",
          name: "Editorial Review",
          icon: "editorial",
          proficiency: 5,
        },
        {
          id: "governance",
          name: "Content Governance",
          icon: "governance",
          proficiency: 5,
        },
      ],
    },
  ] satisfies TechStackCategory[],
};

export const techStackBadges: Record<
  TechStackBadge,
  { label: string; className: string }
> = {
  "most-used": { label: "Most used", className: "tech-stack-badge--accent" },
  primary: { label: "Primary", className: "tech-stack-badge--soft" },
  "daily-driver": { label: "Daily driver", className: "tech-stack-badge--soft" },
};

/** Redirect target for legacy /skills route */
export const skillsPage = {
  metadata: {
    title: "Skills & Tech Stack",
    description: techStackSection.subtitle,
  },
};
