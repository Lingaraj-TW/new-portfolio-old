import { SignedStorageLink } from "@/components/SignedStorageLink";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { FeedbackRowWithAttachments } from "@/lib/types/feedback";

import { FeedbackStatusForm } from "./statusForm";

export const dynamic = "force-dynamic";

function formatHelpful(rating: number | null) {
  if (rating === 1) return "Helpful";
  if (rating === -1) return "Not helpful";
  return "—";
}

function highlightsCount(highlights: unknown) {
  return Array.isArray(highlights) ? highlights.length : 0;
}

export default async function ProFeedHomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Supabase is not configured. Add keys to <code className="font-mono">.env.local</code>{" "}
        and restart the dev server.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.app_metadata?.role;

  if (!user) {
    redirect("/profeed/login");
  }

  if (role !== "admin" && role !== "customer") {
    redirect("/profeed/login?error=not_admin");
  }

  const canTriage = role === "admin";

  const { data, error } = await supabase
    .from("feedback")
    .select(
      `id, page_path, section_anchor, body, rating, star_rating, tagged_author, tagged_team, highlights, status, visitor_session, created_at,
       feedback_attachments ( id, file_name, storage_path, kind, mime_type )`,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100">
        <p className="font-medium">Could not load feedback</p>
        <p className="mt-1 text-xs opacity-90">{error.message}</p>
        <p className="mt-3 text-xs">
          If you see errors about missing columns, run{" "}
          <span className="font-mono">002_portfolio_feedback.sql</span> in Supabase.
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as FeedbackRowWithAttachments[];

  if (rows.length === 0) {
    return (
      <div>
        <h1 className="text-lg font-semibold tracking-tight">ProFeed</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          No rows yet. Submit feedback from a ProDoc documentation page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight">ProFeed</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Newest first. Includes stars, tags, highlights, and attachments when enabled.
        {!canTriage ? " (Read-only — sign in as admin to triage.)" : null}
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-[960px] w-full divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Helpful</th>
              <th className="px-4 py-3">Stars</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">HL</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                  {row.page_path}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {row.section_anchor || "—"}
                </td>
                <td className="px-4 py-3 text-xs">{formatHelpful(row.rating)}</td>
                <td className="px-4 py-3 text-xs">
                  {row.star_rating ? `${row.star_rating}★` : "—"}
                </td>
                <td className="max-w-[140px] px-4 py-3 text-xs text-zinc-700 dark:text-zinc-200">
                  <div className="space-y-1">
                    <div>
                      <span className="text-zinc-500">A:</span> {row.tagged_author || "—"}
                    </div>
                    <div>
                      <span className="text-zinc-500">T:</span> {row.tagged_team || "—"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">{highlightsCount(row.highlights)}</td>
                <td className="max-w-xs px-4 py-3 text-xs text-zinc-700 dark:text-zinc-200">
                  {row.body ? (
                    <span className="line-clamp-4 whitespace-pre-wrap">{row.body}</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="min-w-[160px] px-4 py-3 text-xs">
                  {row.feedback_attachments && row.feedback_attachments.length ? (
                    <ul className="space-y-2">
                      {row.feedback_attachments.map((a) => (
                        <li key={a.id}>
                          <SignedStorageLink path={a.storage_path} label={a.file_name} />
                          <span className="ml-1 text-[10px] text-zinc-500">({a.kind})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {canTriage ? (
                    <FeedbackStatusForm id={row.id} status={row.status} />
                  ) : (
                    <span className="text-xs text-zinc-700 dark:text-zinc-200">
                      {row.status || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

