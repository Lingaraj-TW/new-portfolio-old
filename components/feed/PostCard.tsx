import Link from "next/link";

import type { FeedPost } from "@/lib/types/feed";

export function PostCard({
  post,
  compact = false,
}: {
  post: FeedPost;
  compact?: boolean;
}) {
  const date = new Date(post.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article
      className={
        compact ? "home-card p-4" : "home-card p-6"
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={post.created_at}>{date}</time>
        {post.categories?.name ? (
          <>
            <span aria-hidden>·</span>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground/80">
              {post.categories.name}
            </span>
          </>
        ) : null}
      </div>

      <h2
        className={
          compact
            ? "mt-2 text-base font-semibold text-foreground"
            : "mt-3 text-xl font-semibold tracking-tight text-foreground"
        }
      >
        <Link href={`/feed/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h2>

      {post.excerpt ? (
        <p
          className={
            compact
              ? "mt-2 line-clamp-2 text-sm text-muted-foreground"
              : "mt-3 text-sm leading-relaxed text-muted-foreground"
          }
        >
          {post.excerpt}
        </p>
      ) : null}

      {post.tags && post.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li
              key={tag.id}
              className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-foreground/75"
            >
              {tag.name}
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        href={`/feed/${post.slug}`}
        className="mt-4 inline-block text-xs font-medium text-accent hover:underline"
      >
        Read more →
      </Link>
    </article>
  );
}
