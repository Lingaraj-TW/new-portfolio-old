import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { platformPage } from "@/content/platform";
import { getProdocEntryHref, isExternalDocHref } from "@/lib/prodoc-urls";

export const metadata: Metadata = platformPage.metadata;

export default function PlatformPage() {
  const docHref =
    platformPage.cta.secondary.href === "__PRODOC_ENTRY__"
      ? getProdocEntryHref()
      : platformPage.cta.secondary.href;

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          {platformPage.hero.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {platformPage.hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {platformPage.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={platformPage.cta.primary.href}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {platformPage.cta.primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {isExternalDocHref(docHref) ? (
            <a
              href={docHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-border-hover"
            >
              {platformPage.cta.secondary.label}
            </a>
          ) : (
            <Link
              href={docHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-border-hover"
            >
              {platformPage.cta.secondary.label}
            </Link>
          )}
        </div>
      </div>

      <section className="mt-16" aria-labelledby="platform-workflow-heading">
        <h2
          id="platform-workflow-heading"
          className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          {platformPage.workflow.heading}
        </h2>
        <div className="mx-auto mt-8 max-w-md">
          {platformPage.workflow.steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center">
              <div className="w-full rounded-xl border border-border-card bg-card px-5 py-4 text-center transition hover:border-border-teal-hover">
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="mt-1 text-xs text-accent">{step.product}</p>
              </div>
              {i < platformPage.workflow.steps.length - 1 ? (
                <ArrowDown className="my-2 h-4 w-4 text-muted-foreground/50" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="platform-products-heading">
        <h2
          id="platform-products-heading"
          className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          Platform products
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {platformPage.products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group rounded-xl border border-border-card bg-card p-5 transition hover:border-border-teal-hover"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-accent">
                {product.role}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{product.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.tagline}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition group-hover:opacity-100">
                Learn more
                <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="mt-12 rounded-xl border border-dashed border-secondary-accent/40 bg-secondary-accent/[0.04] p-6 text-center">
        <h3 className="text-sm font-semibold text-foreground">{platformPage.branchNote.title}</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {platformPage.branchNote.body}
        </p>
        <Link
          href="/products/proapi"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent underline underline-offset-4"
        >
          Explore ProAPI
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </aside>
    </MarketingPageShell>
  );
}
