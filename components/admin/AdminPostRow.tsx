"use client";

import Link from "next/link";
import { useActionState } from "react";

import { deletePost, togglePostPublished, updatePost } from "@/lib/feed/actions";
import type { FeedPost } from "@/lib/types/feed";

export function AdminPostRow({ post }: { post: FeedPost }) {
  const [deleteState, deleteAction, deletePending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      try {
        await deletePost(formData);
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : "Delete failed.",
        };
      }
    },
    { error: null },
  );

  const [toggleState, toggleAction, togglePending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      try {
        await togglePostPublished(formData);
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : "Toggle failed.",
        };
      }
    },
    { error: null },
  );

  const [updateState, updateAction, updatePending] = useActionState(
    async (_prev: { error: string | null; ok: boolean }, formData: FormData) => {
      try {
        await updatePost(formData);
        return { error: null, ok: true };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : "Update failed.",
          ok: false,
        };
      }
    },
    { error: null, ok: false },
  );

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{post.title}</h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            /feed/{post.slug}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {post.published ? "Published" : "Draft"} ·{" "}
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.published ? (
            <Link
              href={`/feed/${post.slug}`}
              className="text-xs font-medium text-accent hover:underline"
              target="_blank"
            >
              View live
            </Link>
          ) : null}
          <form action={toggleAction}>
            <input type="hidden" name="id" value={post.id} />
            <input
              type="hidden"
              name="published"
              value={String(post.published)}
            />
            <button
              type="submit"
              disabled={togglePending}
              className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
            >
              {post.published ? "Unpublish" : "Publish"}
            </button>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900 dark:text-rose-300"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {(deleteState.error || toggleState.error) && (
        <p className="mt-2 text-xs text-rose-600">
          {deleteState.error || toggleState.error}
        </p>
      )}

      <form action={updateAction} className="mt-4 space-y-3 border-t border-border pt-4">
        <input type="hidden" name="id" value={post.id} />
        <label className="block text-xs font-medium text-foreground/80">
          Title
          <input
            name="title"
            defaultValue={post.title}
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-foreground/80">
          Slug
          <input
            name="slug"
            defaultValue={post.slug}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
          />
        </label>
        <label className="block text-xs font-medium text-foreground/80">
          Excerpt
          <textarea
            name="excerpt"
            defaultValue={post.excerpt}
            rows={2}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-foreground/80">
          Body
          <textarea
            name="body"
            defaultValue={post.body}
            required
            rows={5}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="published"
            type="checkbox"
            defaultChecked={post.published}
          />
          Published
        </label>
        {updateState.error ? (
          <p className="text-xs text-rose-600">{updateState.error}</p>
        ) : updateState.ok ? (
          <p className="text-xs text-emerald-600">Saved.</p>
        ) : null}
        <button
          type="submit"
          disabled={updatePending}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
        >
          {updatePending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </article>
  );
}
