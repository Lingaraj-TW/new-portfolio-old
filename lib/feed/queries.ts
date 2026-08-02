import { createClient } from "@supabase/supabase-js";

import type { FeedPost, FeedTag } from "@/lib/types/feed";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const POST_SELECT = `
  id, title, slug, excerpt, body, category_id, published, created_at, updated_at,
  categories ( id, name, slug ),
  post_tags ( tags ( id, name, slug ) )
`;

function publicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

type RawPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  categories?: FeedPost["categories"] | FeedPost["categories"][];
  post_tags?: { tags: FeedTag | FeedTag[] | null }[];
};

function pickCategory(
  categories: RawPostRow["categories"],
): FeedPost["categories"] {
  if (!categories) return null;
  if (Array.isArray(categories)) return categories[0] ?? null;
  return categories;
}

function normalizePost(row: RawPostRow): FeedPost {
  const tags =
    row.post_tags?.flatMap((pt) => {
      if (!pt.tags) return [];
      return Array.isArray(pt.tags) ? pt.tags : [pt.tags];
    }) ?? [];
  const { post_tags: _, categories, ...rest } = row;
  return { ...rest, categories: pickCategory(categories), tags };
}

function isPostsTableMissing(message: string): boolean {
  return (
    /could not find the table/i.test(message) ||
    /relation "public\.posts" does not exist/i.test(message) ||
    /schema cache/i.test(message)
  );
}

/** Public feed — no auth, published posts only (RLS enforced). */
export async function listPublishedPosts(limit = 50): Promise<FeedPost[]> {
  const supabase = publicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    // Migration 005 not applied yet — treat as empty feed, no dev overlay noise.
    if (!isPostsTableMissing(error.message)) {
      console.warn("[feed] listPublishedPosts:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as RawPostRow[]).map(normalizePost);
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<FeedPost | null> {
  const supabase = publicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    if (!isPostsTableMissing(error.message)) {
      console.warn("[feed] getPublishedPostBySlug:", error.message);
    }
    return null;
  }
  if (!data) return null;
  return normalizePost(data as unknown as RawPostRow);
}
