"use client";

import { useActionState } from "react";

import { createPost } from "@/lib/feed/actions";

const initial = { error: null as string | null, ok: false };

export function AddPostForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initial, formData: FormData) => {
      try {
        await createPost(formData);
        return { error: null, ok: true };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : "Could not create post.",
          ok: false,
        };
      }
    },
    initial,
  );

  return (
    <form
      action={formAction}
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      <h2 className="text-sm font-semibold text-foreground">Add post</h2>
      <label className="block text-xs font-medium text-foreground/80">
        Title
        <input
          name="title"
          required
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-xs font-medium text-foreground/80">
        Slug (optional)
        <input
          name="slug"
          placeholder="auto-from-title"
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
        />
      </label>
      <label className="block text-xs font-medium text-foreground/80">
        Excerpt
        <textarea
          name="excerpt"
          rows={2}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-xs font-medium text-foreground/80">
        Body
        <textarea
          name="body"
          required
          rows={6}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground/80">
        <input name="published" type="checkbox" defaultChecked />
        Published (visible on public feed)
      </label>
      {state.error ? (
        <p className="text-sm text-rose-600">{state.error}</p>
      ) : state.ok ? (
        <p className="text-sm text-emerald-600">Post created.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create post"}
      </button>
    </form>
  );
}
