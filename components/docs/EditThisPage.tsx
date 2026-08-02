import Link from "next/link";

import { docPageHref } from "@/lib/prodoc-urls";

type Props = {
  slug: string;
  versionId?: string;
};

const REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_DOCS_URL ??
  "https://github.com/lingarajm/prodoc-v2";

export function EditThisPage({ slug, versionId }: Props) {
  const editPath = slug.includes("/")
    ? `content/docs/${slug}.mdx`
    : `content/docs/${slug}/index.mdx`;
  const href = `${REPO_URL}/edit/main/${editPath}`;

  return (
    <div className="not-prose mt-10 flex items-center justify-between border-t border-[var(--docs-border)] pt-4 text-sm">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--docs-primary)] hover:underline"
      >
        Edit this page
      </Link>
      <Link
        href={docPageHref("reference/faq", versionId)}
        className="text-[var(--docs-muted-fg)] hover:text-[var(--docs-fg)]"
      >
        FAQ
      </Link>
    </div>
  );
}
