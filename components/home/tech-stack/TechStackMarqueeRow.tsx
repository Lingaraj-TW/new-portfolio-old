import { MarqueePill, type MarqueePillData } from "@/components/home/tech-stack/MarqueePill";
import { cn } from "@/lib/cn";

/** Per-row scroll speed (row index 0–4). */
const ROW_ANIMATION_DURATIONS = ["35s", "28s", "40s", "30s", "38s"] as const;

const FADE_MASK = {
  maskImage:
    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
} as const;

type TechStackMarqueeRowProps = {
  tools: MarqueePillData[];
  /** Category row index (0–4): even → left, odd → right */
  rowIndex: number;
};

export function TechStackMarqueeRow({ tools, rowIndex }: TechStackMarqueeRowProps) {
  const loop = [...tools, ...tools];
  const scrollLeft = rowIndex % 2 === 0;
  const duration =
    ROW_ANIMATION_DURATIONS[rowIndex] ?? ROW_ANIMATION_DURATIONS[0];

  return (
    <div
      className="marquee-track overflow-hidden bg-gradient-to-r from-transparent via-white/30 py-3 dark:via-white/[0.03]"
      style={FADE_MASK}
    >
      <div
        className={cn(
          "flex w-max gap-3",
          scrollLeft ? "marquee-left" : "marquee-right",
        )}
        style={{ animationDuration: duration }}
      >
        {loop.map((tool, index) => (
          <MarqueePill key={`${tool.id}-${index}`} tool={tool} />
        ))}
      </div>
    </div>
  );
}
