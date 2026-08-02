import { BrandIcon } from "@/components/home/tech-stack/BrandIcon";
import { cn } from "@/lib/cn";
import {
  techStackBadges,
  type TechTool,
} from "@/content/skills";

type TechStackSkillCardProps = {
  tool: TechTool;
  delayClass?: string;
};

function ProficiencyDots({ level }: { level: number }) {
  return (
    <span
      className="tech-stack-proficiency"
      aria-label={`Proficiency ${level} of 5`}
      title={`Proficiency ${level}/5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "tech-stack-proficiency-dot",
            i < level && "tech-stack-proficiency-dot--on",
          )}
        />
      ))}
    </span>
  );
}

export function TechStackSkillCard({ tool, delayClass }: TechStackSkillCardProps) {
  const badge = tool.badge ? techStackBadges[tool.badge] : null;

  return (
    <article
      className={cn(
        "tech-stack-card animate-on-scroll group",
        tool.featured && "tech-stack-card--featured",
        delayClass,
      )}
    >
      <div className="tech-stack-card-glow" aria-hidden />
      <div className="tech-stack-card-inner">
        <div className="tech-stack-card-icon-ring">
          <BrandIcon icon={tool.icon} />
        </div>
        <div className="tech-stack-card-copy">
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              {tool.name}
            </h4>
            {badge ? (
              <span className={cn("tech-stack-badge", badge.className)}>
                {badge.label}
              </span>
            ) : null}
          </div>
          {tool.label ? (
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {tool.label}
            </p>
          ) : null}
        </div>
        {tool.proficiency ? (
          <ProficiencyDots level={tool.proficiency} />
        ) : null}
      </div>
    </article>
  );
}
