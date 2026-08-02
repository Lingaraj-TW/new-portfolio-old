import { TechStackMarqueeRow } from "@/components/home/tech-stack/TechStackMarqueeRow";
import type { MarqueePillData } from "@/components/home/tech-stack/MarqueePill";

type TechStackMarqueeGroupProps = {
  title: string;
  description: string;
  tools: MarqueePillData[];
  /** Category row index (0–4) for scroll direction and speed */
  rowIndex: number;
};

export function TechStackMarqueeGroup({
  title,
  description,
  tools,
  rowIndex,
}: TechStackMarqueeGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="tech-stack-marquee-header px-0.5 sm:px-1">
        <h3 className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
      </div>
      <TechStackMarqueeRow tools={tools} rowIndex={rowIndex} />
    </div>
  );
}
