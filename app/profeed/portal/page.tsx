import { PortalFeedbackList, type PortalRow } from "@/components/PortalFeedbackList";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function ProFeedPortalHomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Supabase is not configured. Add keys to <code className="font-mono">.env.local</code>{" "}
        and restart the dev server.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `id, page_path, section_anchor, body, rating, star_rating, tagged_author, tagged_team, highlights, status, created_at,
       feedback_attachments ( id, file_name, storage_path, kind )`,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100">
        <p className="font-medium">Could not load feedback</p>
        <p className="mt-1 text-xs opacity-90">{error.message}</p>
        <p className="mt-3 text-xs">
          If you just applied migrations, ensure your user has the{" "}
          <span className="font-mono">customer</span> role and that{" "}
          <span className="font-mono">002_portfolio_feedback.sql</span> ran successfully.
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as PortalRow[];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Documentation feedback</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        This MVP shows feedback items submitted across the ProDoc documentation site. You can
        attach files, drop pins, capture text highlights, tag authors and teams, and rate
        pages. When you submitted feedback from the same browser, you can manage that item
        here using the locally stored edit link.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
          No feedback yet. Open ProDoc and use the floating feedback control.
        </p>
      ) : (
        <div className="mt-8">
          <PortalFeedbackList rows={rows} />
        </div>
      )}
    </div>
  );
}

