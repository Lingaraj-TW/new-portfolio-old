import Link from "next/link";

import { PostCard } from "@/components/feed/PostCard";
import { listPublishedPosts } from "@/lib/feed/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function PublicFeedView() {
  const posts = isSupabaseConfigured() ? await listPublishedPosts(50) : [];

  return (
    <>
      <p className="text-sm leading-relaxed text-muted-foreground">
        A professional content feed embedded in my portfolio. Updates on
        documentation work, product writing, and docs-as-code experiments.
        No login required.
      </p>

      {!isSupabaseConfigured() ? (
        <p className="mt-8 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Supabase is not configured. Add{" "}
          <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="font-mono text-xs">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to <code className="font-mono text-xs">.env.local</code>, then run
          migration <code className="font-mono text-xs">005_profeed_posts.sql</code>.
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No posts yet. Add content from the hidden admin dashboard at{" "}
          <code className="font-mono text-xs">/admin/login</code>.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <p className="mt-10 text-xs text-muted-foreground">
        Doc feedback triage for the ProDocs demo lives at{" "}
        <Link href="/profeed/inbox" className="text-accent hover:underline">
          /profeed/inbox
        </Link>{" "}
        (optional admin sign-in for status updates).
      </p>
    </>
  );
}
