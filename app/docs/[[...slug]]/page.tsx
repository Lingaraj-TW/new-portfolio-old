import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DocPageMeta } from "@/components/docs/DocPageMeta";
import { DocTableOfContents } from "@/components/docs/DocTableOfContents";
import { DocsFooter } from "@/components/docs/DocsFooter";
import { EditThisPage } from "@/components/docs/EditThisPage";
import { compileDocMdx, estimateReadingMinutes } from "@/lib/mdx/compile-doc";
import {
  defaultDocSlug,
  getDocMeta,
  isSafeDocSlug,
  listDocSlugs,
  readDocSource,
} from "@/lib/docs/paths";
import {
  DOCS_LATEST_VERSION,
  parseVersionedDocSlug,
} from "@/lib/docs/versions";
import { docsBootstrapPath } from "@/lib/prodoc-urls";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  const slugs = listDocSlugs();
  const params: { slug: string[] }[] = [];

  for (const slug of slugs) {
    const parts = slug.split("/");
    params.push({ slug: parts });
    params.push({ slug: ["26.0", ...parts] });
  }

  return params;
}

async function docTitleForSlug(
  slug: string,
  versionLabel?: string,
): Promise<string> {
  if (!slug || !isSafeDocSlug(slug)) return "Documentation";
  const source = readDocSource(slug);
  if (!source) return "Documentation";
  const { frontmatter } = await compileDocMdx(source);
  const fm = frontmatter as { title?: string };
  const docTitle = (fm.title ?? slug).trim();
  if (versionLabel && versionLabel !== DOCS_LATEST_VERSION.label) {
    return `ProDocs ${versionLabel} — ${docTitle}`;
  }
  return `ProDoc — ${docTitle}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: parts } = await params;

  if (!parts || parts.length === 0) {
    const def = defaultDocSlug();
    if (!def) return { title: "ProDoc — Documentation" };
    return { title: await docTitleForSlug(def) };
  }

  const { version, docSlug } = parseVersionedDocSlug(parts);

  if (!docSlug) {
    const def = defaultDocSlug();
    if (!def) return { title: "ProDoc — Documentation" };
    return { title: await docTitleForSlug(def, version.label) };
  }

  if (!isSafeDocSlug(docSlug)) {
    return { title: "ProDoc — Documentation" };
  }
  return {
    title: await docTitleForSlug(
      docSlug,
      version.isLatest ? undefined : version.label,
    ),
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug: parts } = await params;

  if (!parts || parts.length === 0) {
    const def = defaultDocSlug();
    if (!def) notFound();
    redirect(docsBootstrapPath(def));
  }

  const { version, docSlug } = parseVersionedDocSlug(parts);

  if (!docSlug) {
    const def = defaultDocSlug();
    if (!def) notFound();
    redirect(docsBootstrapPath(def, version.id));
  }

  if (!isSafeDocSlug(docSlug)) notFound();

  const source = readDocSource(docSlug);
  if (!source) notFound();

  const meta = getDocMeta(docSlug);
  const { content, frontmatter } = await compileDocMdx(source);
  const fm = frontmatter as {
    title?: string;
    description?: string;
    authors?: string[];
    tags?: string[];
    last_updated?: string;
  };

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10 lg:px-10">
      <article
        id="doc-root"
        className="docs-prose min-w-0 flex-1 prose max-w-none prose-headings:scroll-mt-28 prose-a:font-medium prose-a:text-[var(--docs-primary)] prose-a:no-underline hover:prose-a:underline"
      >
        <DocPageMeta
          authors={fm.authors ?? meta?.authors}
          tags={fm.tags ?? meta?.tags}
          category={meta?.category}
          readingMinutes={estimateReadingMinutes(source)}
          lastUpdated={fm.last_updated ?? meta?.last_updated}
          versionLabel={version.isLatest ? undefined : version.label}
          versionReleased={version.isLatest ? undefined : version.released}
        />
        {fm.description ? (
          <p className="not-prose -mt-2 text-sm text-[var(--docs-muted-fg)]">
            {fm.description}
          </p>
        ) : null}
        {content}
        <EditThisPage slug={docSlug} versionId={version.id} />
        <DocsFooter />
      </article>
      <aside className="hidden w-52 shrink-0 xl:block xl:w-56">
        <div className="sticky top-[calc(var(--docs-navbar-height)+1.5rem)]">
          <DocTableOfContents />
        </div>
      </aside>
    </div>
  );
}
