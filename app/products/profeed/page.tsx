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
import { profeedContent } from "@/content/products/profeed";

export const metadata: Metadata = profeedContent.metadata;

export default function ProFeedProductPage() {
  return (
    <MarketingPageShell>
      <div className="flex flex-col items-center gap-2">
        <LiveDemoChip />
        <ProductHero
          title={profeedContent.hero.title}
          tagline={profeedContent.hero.tagline}
          problem={profeedContent.hero.problem ?? ""}
        />
      </div>

      <FeatureGrid items={profeedContent.features} />

      <MockWindowChrome title="profeed / triage · concept UI">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="min-w-[640px] w-full text-left text-xs">
            <thead className="bg-muted text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Page</th>
                <th className="px-3 py-2">Signal</th>
                <th className="px-3 py-2">Owners</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="whitespace-nowrap px-3 py-2">Today 09:14</td>
                <td className="px-3 py-2 font-mono text-[10px]">
                  /apis/reference#create-job
                </td>
                <td className="px-3 py-2">★★★★☆ · Highlight on request body</td>
                <td className="px-3 py-2">
                  <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-accent">
                    Docs
                  </span>{" "}
                  <span className="rounded-md bg-muted px-1.5 py-0.5">
                    API
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-200">
                    open
                  </span>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-2">Yesterday</td>
                <td className="px-3 py-2 font-mono text-[10px]">
                  /guides/auth/oauth
                </td>
                <td className="px-3 py-2">Not helpful · stale screenshot</td>
                <td className="px-3 py-2">
                  <span className="rounded-md bg-muted px-1.5 py-0.5">
                    Design
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-purple-200">
                    triaged
                  </span>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-3 py-2">Mon</td>
                <td className="px-3 py-2 font-mono text-[10px]">
                  /changelog/2025-04
                </td>
                <td className="px-3 py-2">Voice note + attachment</td>
                <td className="px-3 py-2">
                  <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-accent">
                    PM
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-slate-500/25 px-2 py-0.5">
                    closed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </MockWindowChrome>

      <MetricsBar metrics={profeedContent.metrics} />

      <BuiltForTags tags={profeedContent.builtForTags} />

      {profeedContent.liveDemo ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Open the live demo:{" "}
          <Link
            href={profeedContent.liveDemo.href}
            className="font-medium text-accent underline underline-offset-4"
          >
            {profeedContent.liveDemo.label}
          </Link>
          .
        </p>
      ) : null}
    </MarketingPageShell>
  );
}
