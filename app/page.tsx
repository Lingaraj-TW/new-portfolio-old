import Link from "next/link";

const PRODOC_URL = process.env.NEXT_PUBLIC_PRODOC_URL || "http://localhost:3001";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
] as const;

const skills = [
  { title: "Writing & strategy", items: "Information architecture, content strategy, UX writing, Diátaxis, style guides (Google / Microsoft)." },
  { title: "Technical documentation", items: "User manuals, installation & configuration guides, release notes, API docs, implementation guides." },
  { title: "Docs-as-code", items: "Git, GitHub/GitLab, Markdown, Docusaurus, YAML, JSON, CI-friendly doc workflows." },
  { title: "Tools & standards", items: "Confluence, Document360, Jira, Azure DevOps, Postman, Swagger, FrameMaker, Arbortext." },
  { title: "Domain expertise", items: "Healthcare (HealthTech), enterprise SaaS, mobile apps, implementation & support ecosystems." },
];

const experience = [
  {
    role: "Senior Technical Writer",
    org: "Cognizant",
    period: "Oct 2024 – Present",
    location: "Chennai, India",
    bullets: [
      "Lead documentation strategy for cross-functional teams supporting TriZetto healthcare products.",
      "API web services, installation guides, internal SOPs, and release content aligned with compliance needs.",
    ],
  },
  {
    role: "Technical Writer",
    org: "Evora IT Solutions Pvt. Ltd",
    period: "Jun 2022 – Oct 2024",
    location: "Bangalore, India",
    bullets: [
      "Customer-facing documentation in Document360 for EvoSuite; Agile delivery with Jira.",
      "Product testing input and content alignment with engineering and support.",
    ],
  },
  {
    role: "Technical Writer",
    org: "Grab A Grub Services Pvt. Ltd",
    period: "Aug 2021 – Jun 2022",
    location: "Bangalore, India",
    bullets: [
      "Documentation for mobile and on-premise web applications.",
      "Cloud knowledge base to centralize technical resources.",
    ],
  },
  {
    role: "Technical Writer",
    org: "Cades Studec Technologies India Pvt. Ltd",
    period: "Mar 2018 – Aug 2021",
    location: "Bangalore, India",
    bullets: [
      "Full documentation lifecycle: user manuals from engineering outputs.",
      "FrameMaker, Arbortext, and structured authoring for consistent long-form deliverables.",
    ],
  },
];

const toolkitChips = [
  "Docs-as-Code · MDX · Docusaurus",
  "API references · OpenAPI/Swagger · Postman",
  "Knowledge bases · Document360 · Confluence",
  "Release notes · SOPs · implementation guides",
  "Multimedia · Camtasia · Snagit · interactive demos",
];

const highlights = [
  {
    title: "Healthcare documentation leadership",
    body: "Senior Technical Writer at Cognizant, leading documentation for TriZetto healthcare products—API services, installation guides, and regulatory-ready release notes across cross-functional teams.",
  },
  {
    title: "Knowledge programs that scale",
    body: "Centralized knowledge bases (Document360, Confluence migrations) and governance that improve self-service and consistency for enterprise and SaaS audiences.",
  },
  {
    title: "Agile collaboration",
    body: "Partnering with engineering, QA, UX, and product in Agile delivery—Jira, Azure DevOps, GitHub, and tight feedback loops with SMEs.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-950 dark:from-black dark:via-zinc-950 dark:to-black dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/85 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/85">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <a href="#" className="text-sm font-semibold tracking-tight">
            Linga Raj M · Technical Writer
          </a>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <span className="hidden text-zinc-300 sm:inline dark:text-zinc-600" aria-hidden>
              |
            </span>
            <a
              href={PRODOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
            >
              ProDoc
            </a>
            <Link
              href="/profeed"
              className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ProFeed
            </Link>
            <Link
              href="/proinsights"
              className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ProInsights
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Senior Technical Writer · Chennai, India
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              I turn complex software into clear, adoption-ready documentation.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Eight years designing documentation for healthcare, enterprise SaaS, and mobile
              products—manuals, API references, knowledge bases, and Docs-as-code experiences
              that reduce support load and speed up onboarding.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                View portfolio & samples
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                About me
              </a>
            </div>
          </div>
          <aside className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-lg shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Quick facts
            </p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              <li>Location: Chennai · Open to remote (IST-friendly)</li>
              <li>Phone: +91 90038 63614</li>
              <li>Email: lingaraj501@gmail.com</li>
              <li>Languages: English, Tamil, Kannada</li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              This site showcases <strong className="text-zinc-700 dark:text-zinc-300">ProDoc</strong>
              —documentation treated as a product—with embedded feedback, portal views, and
              admin triage similar to a production docs platform.
            </p>
          </aside>
        </section>

        <section className="scroll-mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Products
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            This portfolio is packaged as a scalable docs platform concept. ProDoc is the
            documentation site; ProFeed captures and triages customer feedback; ProInsights
            turns that feedback into actionable analytics.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                ProDoc
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                User guides, API documentation (Swagger/OpenAPI), developer docs, and SDK
                samples—hosted as a dedicated documentation site.
              </p>
              <div className="mt-4">
                <a
                  href={PRODOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  Open ProDoc
                </a>
              </div>
            </article>
            <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                ProFeed
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                A feedback operations dashboard to review, tag, and triage documentation
                feedback under Supabase RLS.
              </p>
              <div className="mt-4">
                <Link
                  href="/profeed"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Open ProFeed
                </Link>
              </div>
            </article>
            <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                ProInsights
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                An analytics dashboard showing trends across ratings, tags, hotspots, and
                workflow status for documentation feedback.
              </p>
              <div className="mt-4">
                <Link
                  href="/proinsights"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Open ProInsights
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section id="about" className="scroll-mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            About me
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                I am a senior technical writer with about eight years of experience designing
                high-fidelity content for complex software—healthcare platforms, enterprise SaaS,
                and mobile products. I focus on scalable information architecture, Docs-as-code
                workflows, and content that connects product strategy to customer success.
              </p>
              <blockquote className="mt-6 border-l-2 border-zinc-300 pl-4 text-sm italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
                “Clear documentation connects product strategy to customer success.”
              </blockquote>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                What I care about
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                <li>Audience-first structure (task, reference, and conceptual content where it helps).</li>
                <li>Measurable outcomes: fewer escalations, faster first success, cleaner releases.</li>
                <li>Close work with engineering, QA, and support so docs stay accurate as the product ships.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="skills" className="scroll-mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Core proficiencies
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {skills.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {block.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {block.items}
                </p>
              </article>
            ))}
          </div>
          <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Toolkit chips
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {toolkitChips.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section id="experience" className="scroll-mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Experience
          </h2>
          <ol className="mt-8 space-y-8 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            {experience.map((job) => (
              <li key={`${job.org}-${job.period}`} className="relative">
                <span
                  className="absolute -left-[calc(0.25rem+1px)] top-1.5 h-2 w-2 -translate-x-[calc(50%+0.5px)] rounded-full bg-zinc-400 dark:bg-zinc-500"
                  aria-hidden
                />
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {job.period} · {job.location}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {job.role}
                </h3>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{job.org}</p>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="portfolio" className="scroll-mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Portfolio & projects
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Featured case studies and writing samples also live on my standalone portfolio site.
            Below, explore live MDX samples on this demo—including stars, helpful votes, highlights,
            and triage views powered by Supabase.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={PRODOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Documentation (ProDoc)
            </a>
            <a
              href="https://lingaraj-tw.github.io/Technical-Writing-Portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              External portfolio site
            </a>
            <Link
              href="/profeed/portal/login"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              ProFeed portal
            </Link>
            <Link
              href="/profeed/login"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              ProFeed triage
            </Link>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-zinc-900 px-8 py-10 text-zinc-50 dark:border-zinc-800"
        >
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Contact
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">
            Say hello for documentation strategy, contract technical writing, or full-time roles.
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            <li>
              <span className="text-zinc-500">Portfolio: </span>
              <a
                href="https://lingaraj-tw.github.io/Technical-Writing-Portfolio/"
                className="font-medium text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                lingaraj-tw.github.io/Technical-Writing-Portfolio
              </a>
            </li>
            <li>
              <span className="text-zinc-500">LinkedIn: </span>
              <a
                href="https://www.linkedin.com/in/lingarajm/"
                className="font-medium text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/lingarajm
              </a>
            </li>
            <li>
              <span className="text-zinc-500">Email: </span>
              <a
                href="mailto:lingaraj501@gmail.com"
                className="font-medium text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white"
              >
                lingaraj501@gmail.com
              </a>
            </li>
            <li>
              <span className="text-zinc-500">GitHub: </span>
              <a
                href="https://github.com/Lingaraj-TW"
                className="font-medium text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/Lingaraj-TW
              </a>
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white px-8 py-10 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Interactive proof
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Try the customer-grade feedback loop on any sample page.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Stars, helpful votes, text highlights, pins, tagged authors, and secure uploads—
                mirrored by a customer portal and an admin triage board powered by Supabase RLS.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/profeed/portal/login"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Portal login
              </Link>
              <a
                href={PRODOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Open ProDoc
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} Linga Raj M — Technical Writer · ProDoc demo
      </footer>
    </div>
  );
}
