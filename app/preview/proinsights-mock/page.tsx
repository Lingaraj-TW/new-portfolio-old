import type { Metadata } from "next";

import { ProInsightsCharts } from "@/components/proinsights/ProInsightsCharts";
import {
  PROINSIGHTS_MOCK_DAILY,
  PROINSIGHTS_MOCK_STARS,
  PROINSIGHTS_MOCK_STATUS,
  PROINSIGHTS_MOCK_TOP_AUTHORS,
  PROINSIGHTS_MOCK_TOP_PAGES,
  PROINSIGHTS_MOCK_TOP_TEAMS,
} from "@/lib/proinsights-demo-data";

export const metadata: Metadata = {
  title: "ProInsights — Preview mock (non-indexed)",
  robots: { index: false, follow: false },
};

const TOTAL = 51;
const AVG_STARS = 4.12;
const HELPPCT = 0.72;

export default function ProInsightsMockPreviewPage() {
  return (
    <div className="min-h-full bg-muted text-foreground dark:bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-baseline gap-4 px-6 py-4">
          <span className="text-sm font-semibold tracking-tight">
            ProInsights
          </span>
          <span className="text-xs text-muted-foreground">ProFeed</span>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">ProInsights</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Analytics overview for documentation feedback captured in ProFeed.
          (MVP aggregates the newest items.)
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total feedback
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {TOTAL}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Last 1000 (or fewer)
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Average stars
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {AVG_STARS.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">38 rated</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Helpfulness
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {Math.round(HELPPCT * 100)}%
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              29 helpful · 11 not helpful
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Attachments
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">12</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Files with feedback
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(
            [
              { label: "Open", value: 14 },
              { label: "Triaged", value: 9 },
              { label: "Closed", value: 28 },
            ] as const
          ).map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        <ProInsightsCharts
          status={[...PROINSIGHTS_MOCK_STATUS]}
          daily={PROINSIGHTS_MOCK_DAILY}
          topPages={PROINSIGHTS_MOCK_TOP_PAGES}
          topTeams={PROINSIGHTS_MOCK_TOP_TEAMS}
          topAuthors={PROINSIGHTS_MOCK_TOP_AUTHORS}
          stars={[...PROINSIGHTS_MOCK_STARS]}
        />
      </div>
    </div>
  );
}
