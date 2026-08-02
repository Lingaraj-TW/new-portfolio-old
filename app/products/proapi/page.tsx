import type { Metadata } from "next";
import Link from "next/link";

import { LiveDemoChip } from "@/components/products/LiveDemoChip";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import {
  BuiltForTags,
  FeatureGrid,
  MetricsBar,
  MockWindowChrome,
  ProductHero,
} from "@/components/products/product-demo-blocks";
import { proapiContent } from "@/content/products/proapi";

export const metadata: Metadata = proapiContent.metadata;

export default function ProAPIProductPage() {
  return (
    <MarketingPageShell>
      <div className="flex flex-col items-center gap-2">
        <LiveDemoChip />
        <ProductHero
          title={proapiContent.hero.title}
          tagline={proapiContent.hero.tagline}
          problem={proapiContent.hero.problem ?? ""}
        />
      </div>

      <FeatureGrid items={proapiContent.features} />

      <MockWindowChrome title="proapi / reference / events · concept UI">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <aside className="rounded-xl border border-border bg-card p-3 text-xs">
            <p className="font-semibold text-muted-foreground">Endpoints</p>
            <ul className="mt-3 space-y-2 font-mono text-[10px] text-foreground/85">
              <li className="text-accent">POST /v1/events</li>
              <li>GET /v1/events/:id</li>
              <li>GET /v1/workspaces</li>
              <li>POST /oauth/token</li>
            </ul>
          </aside>
          <article className="rounded-xl border border-border bg-card p-5 text-sm">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                POST
              </span>
              <code className="font-mono text-xs text-foreground">/v1/events</code>
            </div>
            <p className="mt-3 text-muted-foreground">
              Create an event in your workspace. Requires{" "}
              <code className="rounded bg-muted px-1 text-xs">events:write</code> scope.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  cURL
                </p>
                <button
                  type="button"
                  className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent"
                >
                  Copy
                </button>
              </div>
              <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-foreground/90">
                {`curl -X POST https://api.example.com/v1/events \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"type":"signup"}'`}
              </pre>
            </div>
            <p className="mt-4 text-xs text-accent">Try it → Send request</p>
          </article>
        </div>
      </MockWindowChrome>

      <MetricsBar metrics={proapiContent.metrics} />

      <BuiltForTags tags={proapiContent.builtForTags} />

      {proapiContent.liveDemo ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          <Link
            href="/proapi"
            className="font-medium text-accent underline underline-offset-4"
          >
            {proapiContent.liveDemo.label}
          </Link>
          {" — enter the interactive developer portal."}
        </p>
      ) : null}
    </MarketingPageShell>
  );
}
