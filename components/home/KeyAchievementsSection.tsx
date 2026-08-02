import { Award, Bot, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { achievementsSection, highlights } from "@/content/homepage";

const achievementIcons: Record<(typeof highlights)[number]["icon"], LucideIcon> = {
  award: Award,
  trendingUp: TrendingUp,
  bot: Bot,
};

export function KeyAchievementsSection() {
  return (
    <div
      id="achievements"
      className="scroll-mt-24 min-w-0"
      aria-labelledby="achievements-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {achievementsSection.heading}
      </p>
      <h2
        id="achievements-heading"
        className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        Impact at a glance
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {achievementsSection.description}
      </p>

      <ul className="mt-5 grid gap-3.5 sm:gap-4 md:grid-cols-2 md:gap-4 lg:flex lg:flex-col lg:gap-4">
        {highlights.map((item) => {
          const Icon = achievementIcons[item.icon];
          const featured = "featured" in item && item.featured === true;

          return (
            <li
              key={item.title}
              className={cn(featured && "md:col-span-2 lg:col-span-1")}
            >
              <article
                className={cn(
                  "credibility-glass-card group flex h-full gap-4 p-5 transition duration-200 hover:-translate-y-px sm:p-6",
                  featured &&
                    "relative overflow-hidden border-accent/25 hover:border-accent/40 hover:shadow-[0_0_0_1px_var(--accent-glow),var(--shadow-panel-sm)]",
                )}
              >
                {featured ? (
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                    featured
                      ? "border-accent/30 bg-gradient-to-br from-accent/15 to-secondary-accent/10"
                      : "border-accent/20 bg-accent/[0.07] dark:bg-accent/10",
                  )}
                  aria-hidden
                >
                  <Icon className="h-[18px] w-[18px] text-accent" strokeWidth={1.75} />
                </span>
                <div className="relative min-w-0 flex-1">
                  <h3 className="text-[0.95rem] font-semibold leading-snug tracking-tight text-foreground sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
