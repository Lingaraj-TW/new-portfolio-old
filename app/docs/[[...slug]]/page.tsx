import { notFound, redirect } from "next/navigation";

import { compileDocMdx } from "@/lib/mdx/compile-doc";
import {
  defaultDocSlug,
  isSafeDocSlug,
  listDocSlugs,
  readDocSource,
} from "@/lib/docs/paths";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return listDocSlugs().map((slug) => ({ slug: [slug] }));
}

export default async function DocPage({ params }: PageProps) {
  const { slug: parts } = await params;

  if (!parts || parts.length === 0) {
    const def = defaultDocSlug();
    if (!def) notFound();
    redirect(`/docs/${def}`);
  }

  if (parts.length !== 1) notFound();

  const slug = parts[0];
  if (!slug || !isSafeDocSlug(slug)) notFound();

  const source = readDocSource(slug);
  if (!source) notFound();

  const { content, frontmatter } = await compileDocMdx(source);
  const fm = frontmatter as { title?: string; description?: string };

  return (
    <article
      id="doc-root"
      className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-a:font-medium"
    >
      {fm.description ? (
        <p className="not-prose -mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {fm.description}
        </p>
      ) : null}
      {content}
    </article>
  );
}
