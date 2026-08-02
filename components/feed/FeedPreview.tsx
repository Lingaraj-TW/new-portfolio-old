import Link from "next/link";

import { PostCard } from "@/components/feed/PostCard";
import { listPublishedPosts } from "@/lib/feed/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function FeedPreview({ limit = 3 }: { limit?: number }) {
  if (!isSupabaseConfigured()) return null;

  const posts = await listPublishedPosts(limit);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="profeed-feed-heading" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            ProFeed
          </p>
          <h2
            id="profeed-feed-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Latest from the feed
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Writing updates, doc insights, and portfolio notes — no login required.
          </p>
        </div>
        <Link
          href="/profeed"
          className="text-sm font-medium text-accent hover:underline"
        >
          View all posts →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} compact />
        ))}
      </div>
    </section>
  );
}
