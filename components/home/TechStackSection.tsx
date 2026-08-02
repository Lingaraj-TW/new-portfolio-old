import { TechStackMarqueeGroup } from "@/components/home/tech-stack/TechStackMarqueeGroup";
import type { MarqueePillData } from "@/components/home/tech-stack/MarqueePill";
import { techStackSection } from "@/content/skills";

/** Row 3 — AI & writing tools (not in skills content file). */
const AI_WRITING_MARQUEE = {
  title: "AI & Writing Tools",
  description:
    "AI-assisted drafting, editing, and documentation workflows with modern copilots and writing assistants.",
  tools: [
    { id: "claude-ai", name: "Claude AI" },
    { id: "chatgpt", name: "ChatGPT" },
    { id: "grammarly", name: "Grammarly" },
    { id: "notion-ai", name: "Notion AI" },
    { id: "cursor", name: "Cursor" },
    { id: "github-copilot", name: "GitHub Copilot" },
  ] satisfies MarqueePillData[],
};

function toMarqueePill(tool: { id: string; name: string }): MarqueePillData {
  return { id: tool.id, name: tool.name };
}

function getCategory(categoryId: string) {
  return techStackSection.categories.find((c) => c.id === categoryId);
}

export function TechStackSection() {
  const docsPlatforms = getCategory("docs-platforms");
  const apiDev = getCategory("api-dev");
  const markup = getCategory("markup");
  const designVisual = getCategory("design-visual");

  const documentationPlatforms =
    docsPlatforms?.tools.map(toMarqueePill) ?? [];
  const apiDeveloperTools: MarqueePillData[] = [
    ...(apiDev?.tools.map(toMarqueePill) ?? []),
    { id: "git", name: "Git" },
  ];
  const docsAsCodeMarkup = markup?.tools.map(toMarqueePill) ?? [];
  const designVisualTools = designVisual?.tools.map(toMarqueePill) ?? [];

  return (
    <section
      id={techStackSection.id}
      className="scroll-mt-24 max-w-[100vw] overflow-x-hidden"
      aria-labelledby="tech-stack-heading"
    >
      <div className="home-panel relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl dark:bg-accent/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-secondary-accent/8 blur-3xl"
          aria-hidden
        />

        <header className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {techStackSection.eyebrow}
          </p>
          <h2
            id="tech-stack-heading"
            className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {techStackSection.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {techStackSection.subtitle}
          </p>
        </header>

        <div className="relative mt-8 flex flex-col gap-6 sm:mt-10 sm:gap-8">
          {docsPlatforms ? (
            <TechStackMarqueeGroup
              title={docsPlatforms.title}
              description={docsPlatforms.description}
              tools={documentationPlatforms}
              rowIndex={0}
            />
          ) : null}

          {apiDev ? (
            <TechStackMarqueeGroup
              title={apiDev.title}
              description={apiDev.description}
              tools={apiDeveloperTools}
              rowIndex={1}
            />
          ) : null}

          {markup ? (
            <TechStackMarqueeGroup
              title={markup.title}
              description={markup.description}
              tools={docsAsCodeMarkup}
              rowIndex={2}
            />
          ) : null}

          <TechStackMarqueeGroup
            title={AI_WRITING_MARQUEE.title}
            description={AI_WRITING_MARQUEE.description}
            tools={AI_WRITING_MARQUEE.tools}
            rowIndex={3}
          />

          {designVisual ? (
            <TechStackMarqueeGroup
              title={designVisual.title}
              description={designVisual.description}
              tools={designVisualTools}
              rowIndex={4}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
