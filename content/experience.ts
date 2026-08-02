export type ExperienceMetric = {
  value: string;
  label: string;
};

export type ExperienceEntry = {
  org: string;
  orgContext?: string;
  role: string;
  roleDetail?: string;
  employmentType: string;
  period: string;
  location: string;
  bullets: string[];
  tags?: string[];
  metrics?: ExperienceMetric[];
  current?: boolean;
};

export const experiencePage = {
  metadata: {
    title: "Experience",
    description:
      "Technical writing across healthcare SaaS, SAP ERP, e-commerce, and enterprise B2B — developer documentation, API references, Docs-as-Code, and knowledge management.",
  },
  heading: "Experience",
  homeIntro:
    "Eight-plus years leading end-to-end documentation for enterprise software — independently owning planning, authoring, reviews, and publishing across Healthcare and SAP ERP products, with a focus on developer documentation, API references, and Docs-as-Code.",
  educationHeading: "Education",
};

export const experience: ExperienceEntry[] = [
  {
    org: "Cognizant",
    orgContext: "TriZetto QNXT · Healthcare SaaS",
    role: "Senior Technical Writer",
    roleDetail: "Senior Associate",
    employmentType: "Full-time",
    period: "Oct 2024 – Present",
    location: "Chennai, India",
    current: true,
    tags: [
      "Developer Documentation",
      "API Documentation",
      "Swagger / OpenAPI",
      "Postman",
      "Implementation Guides",
      "Release Notes",
      "Azure DevOps",
      "Confluence",
    ],
    bullets: [
      "Independently own the end-to-end documentation lifecycle for TriZetto QNXT releases — planning, authoring, SME reviews, publishing, and post-release maintenance aligned to product milestones.",
      "Develop REST API documentation with Swagger/OpenAPI and Postman, covering endpoints, request/response models, authentication, and integration workflows for enterprise healthcare deployments.",
      "Partner with product managers, engineers, QA, and SMEs through Agile sprint and release planning; mentor writers on standards, style guides, and peer review practices.",
    ],
  },
  {
    org: "Evora IT Solutions",
    orgContext: "EvoSuite · SAP ERP SaaS",
    role: "Technical Writer",
    employmentType: "Full-time",
    period: "Jun 2022 – Oct 2024",
    location: "Bengaluru, India",
    tags: [
      "Sole Technical Writer",
      "Document360",
      "Knowledge Base",
      "Installation Guides",
      "Configuration Guides",
      "Release Notes",
      "Localization (DE/ES)",
      "Jira · Confluence",
    ],
    bullets: [
      "Served as sole Technical Writer for EvoSuite, owning the complete documentation lifecycle from planning and information gathering through publishing and maintenance.",
      "Designed and launched a customer-facing knowledge base in Document360 — information architecture, navigation, taxonomy, templates, and documentation standards from scratch.",
      "Delivered installation, configuration, administrator, and troubleshooting guides aligned to Agile releases; produced English source documentation for German and Spanish localization.",
    ],
  },
  {
    org: "Grab A Grub Services",
    role: "Technical Writer",
    employmentType: "Full-time",
    period: "Aug 2021 – Jun 2022",
    location: "Bengaluru, India",
    tags: [
      "Sole Technical Writer",
      "User Guides",
      "Knowledge Base",
      "PRDs & BRDs",
      "Release Notes",
      "Mobile & Web Apps",
    ],
    bullets: [
      "Served as sole Technical Writer for web and mobile products, owning documentation from SME requirement gathering through publishing and ongoing maintenance.",
      "Partnered with product managers, business analysts, engineers, QA, and UX on feature discussions, UI reviews, and sprint activities to ship release-ready documentation.",
      "Created user guides, functional specifications, knowledge base articles, PRDs, BRDs, and process documentation for internal teams and end users.",
    ],
  },
  {
    org: "CADES Studec Technologies",
    role: "Technical Writer",
    employmentType: "Full-time",
    period: "Mar 2018 – Aug 2021",
    location: "Bengaluru, India",
    tags: [
      "XML / DITA",
      "Structured Authoring",
      "Arbortext Editor",
      "MadCap Flare",
      "Technical Manuals",
      "DDLC",
    ],
    bullets: [
      "Managed the complete Document Development Lifecycle (DDLC) with XML/DITA structured authoring and single-source publishing across multiple output formats.",
      "Created and maintained technical manuals and procedural documentation with engineering SMEs, meeting customer, regulatory, and quality requirements.",
      "Used Arbortext Editor and MadCap Flare for structured publications while maintaining content reuse, consistency, and version control through review and QA cycles.",
    ],
  },
];

export const education = {
  degree: "Bachelor of Engineering (B.E.)",
  school: "Adhiyamaan College of Engineering · Hosur",
  period: "2013–2017 · CGPA 8.0",
};
