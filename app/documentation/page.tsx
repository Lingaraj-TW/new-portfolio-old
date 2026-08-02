import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Braces,
  Code2,
  Compass,
  Database,
  FileText,
  GraduationCap,
  HelpCircle,
  History,
  KeyRound,
  Library,
  Lightbulb,
  PlayCircle,
  Rocket,
  ScrollText,
  TerminalSquare,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { DocHubSearch } from "@/components/docs/hub/DocHubSearch";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import {
  documentationHub,
  type DocHubArticleRef,
  type DocHubIconKey,
} from "@/content/documentation";
import { buildPortalSearchIndex } from "@/lib/docs/nav-data.server";
import { getDocMeta, listDocSlugs } from "@/lib/docs/paths";
import { PRODUCT_NAV } from "@/lib/docs/sidebar";
import {
  DOCS_VERSIONS,
  docPageHref,
  getProdocEntryHref,
} from "@/lib/prodoc-urls";

export const metadata: Metadata = {
  title: `${documentationHub.metadata.title} — ProDoc platform`,
  description: documentationHub.metadata.description,
};

const hubIconMap: Record<DocHubIconKey, LucideIcon> = {
  Rocket,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Library,
  Wrench,
  HelpCircle,
  Database,
  History,
  Compass,
  FileText,
  Code2,
  KeyRound,
  Braces,
  Boxes,
  TerminalSquare,
  PlayCircle,
  ScrollText,
};

type ResolvedArticle = {
  href: string;
  title: string;
  description?: string;
  lastUpdated?: string;
};

function resolveArticle(ref: DocHubArticleRef): ResolvedArticle | null {
  const meta = getDocMeta(ref.docSlug);
  if (!meta) return null;
  return {
    href: docPageHref(ref.docSlug),
    title: ref.label ?? meta.title,
    description: meta.description,
    lastUpdated: meta.last_updated,
  };
}

function resolveArticles(refs: readonly DocHubArticleRef[]): ResolvedArticle[] {
  return refs
    .map(resolveArticle)
    .filter((a): a is ResolvedArticle => a !== null);
}

const cardClassName =
  "group rounded-xl border border-border-card bg-card p-5 transition hover:border-border-teal-hover";
const iconChipClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-transform duration-200 group-hover:scale-105";

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ArticleListPanel({
  heading,
  articles,
  showDates,
}: {
  heading: string;
  articles: ResolvedArticle[];
  showDates?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border-card bg-card">
      <p className="border-b border-border-card px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {heading}
      </p>
      <ul>
        {articles.map((article, index) => (
          <li
            key={article.href}
            className={index > 0 ? "border-t border-border-card" : undefined}
          >
            <Link
              href={article.href}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted"
            >
              <span className="w-4 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                  {article.title}
                </span>
                {showDates && article.lastUpdated ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Updated {article.lastUpdated}
                  </span>
                ) : null}
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DocumentationHubPage() {
  const searchEntries = buildPortalSearchIndex().map((entry) => ({
    href: docPageHref(entry.slug),
    title: entry.title,
    description: entry.description,
  }));

  const featuredGuides = resolveArticles(documentationHub.featuredGuides);
  const recentlyUpdated = resolveArticles(documentationHub.recentlyUpdated);
  const popular = resolveArticles(documentationHub.popular);

  const totalDocs = listDocSlugs().length;
  const stats = [
    { label: "Documentation pages", value: `${totalDocs}` },
    { label: "Categories", value: `${documentationHub.categories.length}` },
    { label: "Product doc sets", value: `${PRODUCT_NAV.length}` },
    { label: "Published versions", value: `${DOCS_VERSIONS.length}` },
  ];

  return (
    <MarketingPageShell>
      {/* Hero + search */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          {documentationHub.hero.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {documentationHub.hero.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {documentationHub.hero.description}
        </p>
      </div>

      <div className="mt-8">
        <DocHubSearch
          entries={searchEntries}
          placeholder={documentationHub.hero.searchPlaceholder}
        />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {documentationHub.quickLinks.map((link) => {
            const href =
              "href" in link && link.href
                ? link.href
                : docPageHref(link.docSlug as string);
            return (
              <Link
                key={link.label}
                href={href}
                className="rounded-full border border-border-card bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border-teal-hover hover:text-accent"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <section className="mt-16">
        <SectionHeading
          eyebrow={documentationHub.categoriesHeading.eyebrow}
          title={documentationHub.categoriesHeading.title}
          description={documentationHub.categoriesHeading.description}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentationHub.categories.map((category) => {
            const Icon = hubIconMap[category.iconKey];
            const href =
              category.href ?? docPageHref(category.docSlug as string);
            return (
              <Link key={category.slug} href={href} className={cardClassName}>
                <div className="flex items-start gap-3">
                  <div className={iconChipClassName}>
                    <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured guides */}
      <section className="mt-16">
        <SectionHeading
          eyebrow={documentationHub.featuredHeading.eyebrow}
          title={documentationHub.featuredHeading.title}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {featuredGuides.map((guide) => (
            <Link key={guide.href} href={guide.href} className={cardClassName}>
              <div className="flex items-start gap-3">
                <div className={iconChipClassName}>
                  <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">
                    {guide.title}
                  </h3>
                  {guide.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
                    Read guide
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently updated + popular */}
      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        <ArticleListPanel
          heading={documentationHub.recentlyUpdatedHeading}
          articles={recentlyUpdated}
          showDates
        />
        <ArticleListPanel
          heading={documentationHub.popularHeading}
          articles={popular}
        />
      </section>

      {/* Developer documentation */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={documentationHub.developer.eyebrow}
            title={documentationHub.developer.title}
            description={documentationHub.developer.description}
          />
          <Link
            href={documentationHub.developer.portalHref}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border-card bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-border-teal-hover hover:text-accent"
          >
            {documentationHub.developer.portalLabel}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {documentationHub.developer.links.map((link) => {
            const Icon = hubIconMap[link.iconKey];
            const href =
              link.href ?? docPageHref(link.docSlug as string);
            const inProApi = href.startsWith("/proapi");
            return (
              <Link key={link.title} href={href} className={cardClassName}>
                <div className={iconChipClassName}>
                  <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {link.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
                  {inProApi ? "View in ProAPI" : "Read the docs"}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Health + statistics */}
      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border-card bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {documentationHub.health.eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            {documentationHub.health.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {documentationHub.health.description}
          </p>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-accent">
              {documentationHub.health.score}
            </span>
            <span className="text-sm text-muted-foreground">
              / 100 · {documentationHub.health.scoreLabel}
            </span>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            {documentationHub.health.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg bg-muted px-3 py-2.5"
              >
                <dt className="text-xs text-muted-foreground">{metric.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            href={docPageHref(documentationHub.health.docSlug)}
            className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-accent"
          >
            {documentationHub.health.linkLabel}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        <div className="rounded-xl border border-border-card bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Docs-as-code
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            {documentationHub.statsHeading}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Every page is MDX in version control — counted live at build time,
            published through the same pipeline as the product.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-muted px-3 py-3">
                <dd className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </dd>
                <dt className="mt-0.5 text-xs text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
          <Link
            href={getProdocEntryHref()}
            className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-accent"
          >
            Open the documentation portal
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
