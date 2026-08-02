"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { experience, type ExperienceEntry } from "@/content/experience";

const TIMELINE_AXIS_PX = 11;

function TimelineCard({
  job,
  index,
  isActive,
  isPast,
  nodeRef,
}: {
  job: ExperienceEntry;
  index: number;
  isActive: boolean;
  isPast: boolean;
  nodeRef: (el: HTMLDivElement | null) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <li className="relative grid grid-cols-[22px_1fr] gap-4 sm:gap-5">
      <div className="relative flex justify-center pt-7 sm:pt-8">
        <div ref={nodeRef} className="relative z-10 flex justify-center">
          <motion.span
            className={cn(
              "relative block h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300",
              isActive
                ? "border-accent bg-accent shadow-[0_0_0_5px_var(--accent-glow),0_0_14px_rgba(147,51,234,0.35)]"
                : isPast
                  ? "border-accent/70 bg-accent/85"
                  : "border-border-card bg-card",
            )}
            animate={
              reduceMotion || !isActive ? { scale: 1 } : { scale: [1, 1.15, 1.08] }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            {isActive ? (
              <span className="absolute inset-[3px] rounded-full bg-accent-foreground/90" />
            ) : null}
          </motion.span>
        </div>
      </div>

      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        className={cn(
          "credibility-glass-card group relative overflow-hidden p-4 transition-[box-shadow,border-color] duration-300 sm:p-5",
          "hover:border-border-hover hover:shadow-[var(--shadow-panel-sm)]",
          isActive &&
            "border-accent/30 shadow-[0_0_0_1px_var(--accent-glow),var(--shadow-panel-sm)]",
          isPast && !isActive && "border-border-card/90",
        )}
      >
        {isActive ? (
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            aria-hidden
          />
        ) : null}

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-display text-base font-semibold leading-snug tracking-tight text-foreground sm:text-[1.05rem]">
              {job.org}
              {job.orgContext ? (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {job.orgContext}
                </span>
              ) : null}
            </p>
            {job.current ? (
              <span className="shrink-0 rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                Current
              </span>
            ) : null}
          </div>

          <h3 className="mt-1 text-sm font-medium text-foreground/90">
            {job.role}
            {job.roleDetail ? (
              <span className="text-muted-foreground"> · {job.roleDetail}</span>
            ) : null}
          </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.75} aria-hidden />
              <span>
                {job.employmentType} · {job.period}
              </span>
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-accent/70" strokeWidth={1.75} aria-hidden />
              <span>{job.location}</span>
            </p>

            {job.metrics && job.metrics.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {job.metrics.map((metric) => (
                  <li
                    key={metric.label}
                    className="rounded-md border border-border-card/80 bg-muted/40 px-2.5 py-1"
                  >
                    <span className="text-sm font-semibold text-accent">{metric.value}</span>
                    <span className="ml-1.5 text-[11px] text-muted-foreground">{metric.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <ul className="mt-3 space-y-2">
              {job.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 text-sm leading-[1.45] text-muted-foreground"
                >
                  <span
                    className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-accent/50"
                    aria-hidden
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {job.tags && job.tags.length > 0 ? (
              <ul className="experience-doc-tags m-0 list-none p-0">
                {job.tags.map((tag) => (
                  <li
                    key={tag}
                    className="tech-stack-badge tech-stack-badge--accent experience-doc-tag"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
        </div>
      </motion.article>
    </li>
  );
}

export function ExperienceTimeline({ className }: { className?: string }) {
  const [scrollContainer, setScrollContainer] = useState<
    HTMLElement | null | undefined
  >(undefined);

  useEffect(() => {
    setScrollContainer(
      document.querySelector(".page-wrapper") as HTMLElement | null,
    );
  }, []);

  if (scrollContainer === undefined) {
    return <div className={cn("relative mt-7 sm:mt-8 min-h-[12rem]", className)} aria-hidden />;
  }

  return (
    <ExperienceTimelineBody
      key={scrollContainer ? "page-wrapper" : "window"}
      className={className}
      scrollContainer={scrollContainer}
    />
  );
}

function ExperienceTimelineBody({
  className,
  scrollContainer,
}: {
  className?: string;
  scrollContainer: HTMLElement | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(scrollContainer);
  scrollContainerRef.current = scrollContainer;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const reduceMotion = useReducedMotion();

  const setNodeRef = useCallback((index: number) => {
    return (el: HTMLDivElement | null) => {
      nodeRefs.current[index] = el;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    ...(scrollContainer ? { container: scrollContainerRef } : {}),
    offset: ["start 0.82", "end 0.28"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const maxIdx = Math.max(0, experience.length - 1);
    const idx = Math.min(maxIdx, Math.max(0, Math.round(progress * maxIdx)));
    setActiveIndex(idx);
  });

  const updateLineHeight = useCallback(() => {
    const track = trackRef.current;
    const node = nodeRefs.current[activeIndex];
    if (!track || !node) return;

    const trackRect = track.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const centerY = nodeRect.top + nodeRect.height / 2 - trackRect.top;
    setLineHeight(Math.max(12, centerY));
  }, [activeIndex]);

  useEffect(() => {
    updateLineHeight();

    const onScroll = () => updateLineHeight();
    const wrapper = scrollContainer ?? null;
    if (wrapper) {
      wrapper.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onScroll);

    return () => {
      wrapper?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateLineHeight, scrollContainer]);

  return (
    <div ref={containerRef} className={cn("relative mt-7 sm:mt-8", className)}>
      <div
        ref={trackRef}
        className="pointer-events-none absolute bottom-4 top-7 w-px sm:top-8"
        style={{ left: TIMELINE_AXIS_PX }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-border-card/90" />
        {reduceMotion ? (
          <div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-accent to-secondary-accent/60"
            style={{ height: "100%" }}
          />
        ) : (
          <motion.div
            className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-accent via-accent/80 to-secondary-accent/70"
            initial={false}
            animate={{ height: lineHeight }}
            transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.35 }}
          />
        )}
      </div>

      <ol className="relative m-0 list-none space-y-5 p-0 sm:space-y-6">
        {experience.map((job, index) => (
          <TimelineCard
            key={`${job.org}-${job.period}`}
            job={job}
            index={index}
            isActive={index === activeIndex}
            isPast={index < activeIndex}
            nodeRef={setNodeRef(index)}
          />
        ))}
      </ol>
    </div>
  );
}
