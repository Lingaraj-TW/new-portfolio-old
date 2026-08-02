import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedPostBySlug } from "@/lib/feed/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FeedPostPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) notFound();

  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href="/feed"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← ProFeed
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.created_at}>{date}</time>
          {post.categories?.name ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.categories.name}</span>
            </>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        ) : null}

        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground/80"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="prose prose-slate mt-10 max-w-none dark:prose-invert prose-p:leading-relaxed">
          {post.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
