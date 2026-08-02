import { GitBranch, TrendingUp, Users, type LucideIcon } from "lucide-react";

import { aboutPage } from "@/content/about";

const careIcons: Record<(typeof aboutPage.careAboutItems)[number]["icon"], LucideIcon> = {
  users: Users,
  trendingUp: TrendingUp,
  gitBranch: GitBranch,
};

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <h2 className="animate-on-scroll text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {aboutPage.heading}
      </h2>

      <div
        className="about-section-grid animate-from-left delay-1 mt-6"
        style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "48px", alignItems: "start" }}
      >
        <div className="about-photo-wrap">
          <div
            className="about-photo-ring"
            style={{
              position: "absolute",
              inset: "-3px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #9333EA, #EC4899)",
              zIndex: 0,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aboutPage.photo.src}
            alt={aboutPage.photo.alt}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "18px",
              objectFit: "cover",
              objectPosition: "center top",
              position: "relative",
              zIndex: 1,
              display: "block",
            }}
          />
        </div>

        <div className="flex flex-col">
            <div className="home-panel p-6">
            <p className="text-base leading-relaxed text-foreground/80">
              {aboutPage.intro}
            </p>
            <blockquote className="mt-6 border-l-2 border-accent pl-4 text-sm italic text-muted-foreground">
              {aboutPage.quote}
            </blockquote>
          </div>

          <div className="mb-6 mt-6 grid grid-cols-3 gap-3">
            {aboutPage.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-lg bg-muted px-3 py-4 text-center"
              >
                <span className="text-2xl font-medium text-accent">{stat.value}</span>
                <span className="mt-1 text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="animate-on-scroll delay-2">
            <h3 className="text-sm font-semibold text-foreground">
              {aboutPage.careAboutHeading}
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {aboutPage.careAboutItems.map((item) => {
                const Icon = careIcons[item.icon];
                return (
                  <li key={item.icon} className="flex items-start gap-4">
                    <span
                      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded bg-accent/10"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4 text-accent" strokeWidth={2} />
                    </span>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
