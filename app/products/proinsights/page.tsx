import type { Metadata } from "next";
import Link from "next/link";

import { LiveDemoChip } from "@/components/products/LiveDemoChip";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import {
  BuiltForTags,
  FeatureGrid,
  MetricsBar,
  ProductHero,
} from "@/components/products/product-demo-blocks";
import { ProInsightsCharts } from "@/components/proinsights/ProInsightsCharts";
import {
  proinsightsContent,
  proinsightsMockStats,
} from "@/content/products/proinsights";
import {
  PROINSIGHTS_MOCK_DAILY,
  PROINSIGHTS_MOCK_STARS,
  PROINSIGHTS_MOCK_STATUS,
  PROINSIGHTS_MOCK_TOP_AUTHORS,
  PROINSIGHTS_MOCK_TOP_PAGES,
  PROINSIGHTS_MOCK_TOP_TEAMS,
} from "@/lib/proinsights-demo-data";

export const metadata: Metadata = proinsightsContent.metadata;

export default function ProInsightsProductPage() {
  const stats = proinsightsMockStats;

  return (
    <MarketingPageShell>
      <div className="flex flex-col items-center gap-2">
        <LiveDemoChip />
        <ProductHero
          title={proinsightsContent.hero.title}
          tagline={proinsightsContent.hero.tagline}
          problem={proinsightsContent.hero.problem ?? ""}
        />
      </div>

      <FeatureGrid items={proinsightsContent.features} />

      <div className="mt-12 rounded-2xl border border-border bg-card p-4 shadow-inner shadow-black/20">
        <h2 className="text-center text-sm font-semibold text-foreground">
          {stats.dashboardTitle}
        </h2>
        <p className="mx-auto mt-1 max-w-2xl text-center text-xs text-muted-foreground">
          {stats.dashboardSubtitle}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total feedback
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {stats.totalFeedback}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Sample window (concept)
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Average stars
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {stats.averageStars.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.ratedCount} rated
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Helpfulness
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {Math.round(stats.helpfulPercent * 100)}%
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.helpfulCount} helpful · {stats.notHelpfulCount} not helpful
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Attachments
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {stats.attachments}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Files with feedback
            </p>
          </div>
        </div>

        <div className="mt-6">
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

      <MetricsBar metrics={proinsightsContent.metrics} />

      <BuiltForTags tags={proinsightsContent.builtForTags} />

      {proinsightsContent.liveDemo ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Sign in to the live dashboard:{" "}
          <Link
            href={proinsightsContent.liveDemo.href}
            className="font-medium text-accent underline underline-offset-4"
          >
            {proinsightsContent.liveDemo.label}
          </Link>
          .
        </p>
      ) : null}
    </MarketingPageShell>
  );
}
