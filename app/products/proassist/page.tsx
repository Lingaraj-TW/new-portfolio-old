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
import { proassistContent } from "@/content/products/proassist";

export const metadata: Metadata = proassistContent.metadata;

export default function ProAssistProductPage() {
  return (
    <MarketingPageShell>
      <div className="flex flex-col items-center gap-2">
        <LiveDemoChip />
        <ProductHero
          title={proassistContent.hero.title}
          tagline={proassistContent.hero.tagline}
          problem={proassistContent.hero.problem ?? ""}
        />
      </div>

      <FeatureGrid items={proassistContent.features} />

      <MockWindowChrome title="proassist / chat · concept UI">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              User
            </p>
            <p className="mt-2 text-sm text-foreground">
              How do I authenticate API requests with OAuth?
            </p>
          </div>
          <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
              ProAssist
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Use the authorization code flow: redirect users to{" "}
              <code className="rounded bg-muted px-1 text-xs">/oauth/authorize</code>, exchange
              the code at{" "}
              <code className="rounded bg-muted px-1 text-xs">/oauth/token</code>, then pass the
              bearer token in the Authorization header.
            </p>
            <div className="mt-3 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Sources
              </p>
              <p className="text-xs text-accent">→ /guides/auth/oauth</p>
              <p className="text-xs text-accent">→ /apis/reference#authentication</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Show code example", "What scopes are required?", "Token refresh flow"].map(
                (q) => (
                  <span
                    key={q}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {q}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </MockWindowChrome>

      <MetricsBar metrics={proassistContent.metrics} />

      <BuiltForTags tags={proassistContent.builtForTags} />

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Open the live assistant on any page — click the{" "}
        <span className="font-medium text-accent">chat icon</span> in the bottom-right corner.
      </p>
    </MarketingPageShell>
  );
}
