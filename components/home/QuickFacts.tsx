import {
  Briefcase,
  CalendarCheck,
  FileText,
  Languages,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { quickFacts } from "@/content/contact";

const QUICK_FACT_ICONS: Record<string, LucideIcon> = {
  Availability: CalendarCheck,
  Languages: Languages,
  Domains: Briefcase,
  "AI Tools": Sparkles,
  Formats: FileText,
};

function QuickFactIcon({
  label,
  accent,
}: {
  label: string;
  accent?: boolean;
}) {
  const Icon = QUICK_FACT_ICONS[label] ?? FileText;
  return (
    <span
      className={`quick-facts-icon-wrap${accent ? " quick-facts-icon-wrap--accent" : ""}`}
      aria-hidden
    >
      <Icon className="quick-facts-icon" strokeWidth={2} />
    </span>
  );
}

function QuickFactLabel({
  label,
  accent,
}: {
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="quick-facts-row__head">
      <QuickFactIcon label={label} accent={accent} />
      <span className="quick-facts-label">{label}</span>
    </div>
  );
}

export function QuickFacts() {
  const footerBody = quickFacts.footerNote.replace(
    `This site showcases ${quickFacts.footerHighlight} — `,
    "",
  );

  return (
    <aside className="quick-facts-card home-panel-inset relative w-full before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/40 before:to-transparent lg:rounded-xl">
      <div className="quick-facts-card__inner">
        <p className="quick-facts-card__title">{quickFacts.title}</p>

        <ul className="quick-facts-list">
          {quickFacts.rows.map((row, index) => (
            <li
              key={row.label}
              className={`quick-facts-row${index < quickFacts.rows.length - 1 ? " quick-facts-row--divided" : ""}`}
            >
              <QuickFactLabel label={row.label} accent={row.accent} />

              <div className="quick-facts-row__body">
                {row.values?.map((value) => (
                  <span
                    key={value.text}
                    className={`quick-facts-value${value.muted ? " quick-facts-value--muted" : ""}`}
                  >
                    {value.text}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <p className="quick-facts-footer">
          This site showcases{" "}
          <strong>{quickFacts.footerHighlight}</strong> — {footerBody}
        </p>
      </div>
    </aside>
  );
}
