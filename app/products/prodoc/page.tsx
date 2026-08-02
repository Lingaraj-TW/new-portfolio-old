import type { Metadata } from "next";
import Link from "next/link";

import { LiveDemoChip } from "@/components/products/LiveDemoChip";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ProDocHero } from "@/components/products/prodoc/ProDocHero";
import {
  BuiltForTags,
  FeatureGrid,
  FlowSteps,
  MetricsBar,
  MockWindowChrome,
} from "@/components/products/product-demo-blocks";
import { prodocContent } from "@/content/products/prodoc";
import {
  getProdocEntryHref,
  getEcosystemEntryHref,
  isExternalDocHref,
} from "@/lib/prodoc-urls";

export const metadata: Metadata = prodocContent.metadata;

export default function ProDocProductPage() {
  const doc = getProdocEntryHref();
  const ecosystemEntry = getEcosystemEntryHref();
  const liveDemoHref =
    prodocContent.liveDemo?.href === "__PRODOC_ENTRY__"
      ? getProdocEntryHref()
      : prodocContent.liveDemo?.href ?? doc;

  return (
    <MarketingPageShell>
      <div className="flex flex-col gap-10">
        <LiveDemoChip className="self-center" />
        <ProDocHero demoAnchorId="concept-demo" ecosystemHref={ecosystemEntry} />
      </div>

      <FeatureGrid items={prodocContent.features} />

      <div id="concept-demo" className="scroll-mt-24">
        <MockWindowChrome title="prodoc / guides / onboarding · concept UI">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-xl border border-border bg-card p-3 text-xs">
            <p className="font-semibold text-muted-foreground">Navigate</p>
            <ul className="mt-3 space-y-2 text-foreground/85">
              <li className="text-accent">Getting started</li>
              <li>Platform overview</li>
              <li>API reference</li>
              <li>SDKs</li>
              <li>Changelog</li>
            </ul>
          </aside>
          <article className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">
              Guide
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Ship your first integration in under an hour
            </h2>
            <p className="mt-3">
              Call the <code className="rounded bg-muted px-1">/v1/events</code>{" "}
              endpoint with your workspace key…
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3 font-mono text-[11px] text-foreground/90">
              curl -H &quot;Authorization: Bearer $KEY&quot; \ <br />
              &nbsp;&nbsp;-d &apos;&#123;&quot;type&quot;:&quot;signup&quot;&#125;&apos; \ <br />
              &nbsp;&nbsp;https://api.example.com/v1/events
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Reader tools: ★ rate · Was this helpful? · Highlight to comment
              (feeds ProFeed)
            </p>
          </article>
        </div>
      </MockWindowChrome>
      </div>

      <MetricsBar metrics={prodocContent.metrics} />

      {prodocContent.flowSteps ? (
        <div className="mt-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {prodocContent.flowStepsHeading ?? "How it runs"}
          </p>
          <FlowSteps steps={prodocContent.flowSteps} />
        </div>
      ) : null}

      <BuiltForTags tags={prodocContent.builtForTags} />

      {prodocContent.governanceFeatures ? (
        <div id="governance" className="mt-16 scroll-mt-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Governance & Operations
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
              Style, review, and docs-as-code operations
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Voice governance, editorial QA, and release pipelines — integrated into ProDoc
              rather than standalone tools.
            </p>
          </div>
          <FeatureGrid items={prodocContent.governanceFeatures} />
        </div>
      ) : null}

      {prodocContent.liveDemo ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Open the working documentation site:{" "}
          {isExternalDocHref(liveDemoHref) ? (
            <a
              href={liveDemoHref}
              className="font-medium text-accent underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {prodocContent.liveDemo.label}
            </a>
          ) : (
            <Link
              href={liveDemoHref}
              className="font-medium text-accent underline underline-offset-4"
            >
              {prodocContent.liveDemo.label}
            </Link>
          )}
          .
        </p>
      ) : null}
    </MarketingPageShell>
  );
}
