import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AddPostForm } from "@/components/admin/AddPostForm";
import { AdminPostRow } from "@/components/admin/AdminPostRow";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { isAdminSession } from "@/lib/admin/session-server";
import { listAllPostsAdmin } from "@/lib/feed/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin — Manage feed posts",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-muted-foreground">
        Configure Supabase in <code className="font-mono">.env.local</code> and
        run migration <code className="font-mono">005_profeed_posts.sql</code>.
      </p>
    );
  }

  if (!(await isAdminSession())) {
    redirect("/admin/login?next=/admin/dashboard");
  }

  let posts: Awaited<ReturnType<typeof listAllPostsAdmin>> = [];
  let loadError: string | null = null;
  try {
    posts = await listAllPostsAdmin();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load posts.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Admin — Manage feed posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hidden route — not linked from the public portfolio. Posts appear on{" "}
            <Link href="/profeed" className="text-accent hover:underline">
              /feed
            </Link>
            .
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
        <Suspense fallback={null}>
          <AddPostForm />
        </Suspense>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            All posts ({posts.length})
          </h2>
          {loadError ? (
            <p className="text-sm text-rose-600">{loadError}</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No posts yet. Create one using the form.
            </p>
          ) : (
            posts.map((post) => <AdminPostRow key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
