import Link from "next/link";
import { notFound } from "next/navigation";

import { SignedStorageLink } from "@/components/shared/SignedStorageLink";
import { FeedbackDocActions } from "@/components/profeed/FeedbackDocActions";
import { getFeedbackById } from "@/lib/feedback/queries";
import { stripHtmlToText } from "@/lib/profeed/stripHtml";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { FeedbackRowWithAttachments } from "@/lib/types/feedback";

import { FeedbackStatusForm } from "@/components/profeed/FeedbackStatusForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatHelpful(rating: number | null) {
  if (rating === 1) return "Helpful";
  if (rating === -1) return "Not helpful";
  if (rating === 0) return "Neutral";
  return "—";
}

function backHref(sp: Record<string, string | string[] | undefined>) {
  const q = new URLSearchParams();
  for (const key of ["page", "team", "writer", "star", "status"] as const) {
    const v = sp[key];
    if (typeof v === "string" && v) q.set(key, v);
  }
  const s = q.toString();
  return s ? `/profeed/inbox?${s}` : "/profeed/inbox";
}

export default async function FeedbackDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-muted-foreground">
        Supabase is not configured. Add keys to{" "}
        <code className="font-mono">.env.local</code> and restart the dev
        server.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.app_metadata?.role as string | undefined;

  const canTriage = role === "admin";
  const canEditDocs = role === "admin";
  const hasServiceForPublicFileLinks = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const canOpenFileLinks = Boolean(
    (user && (role === "admin" || role === "customer")) ||
      (!user && hasServiceForPublicFileLinks),
  );

  const { row, error: loadError } = await getFeedbackById(supabase, id);

  if (loadError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100">
        <p className="font-medium">Could not load feedback</p>
        <p className="mt-1 text-xs opacity-90">{loadError}</p>
      </div>
    );
  }

  if (!row) notFound();

  const authors = row.tagged_authors?.length
    ? row.tagged_authors
    : row.tagged_author
      ? [row.tagged_author]
      : [];
  const teams = row.tagged_teams?.length
    ? row.tagged_teams
    : row.tagged_team
      ? [row.tagged_team]
      : [];
  const messageText = stripHtmlToText(row.body, 10000);

  return (
    <div>
      <Link
        href={backHref(sp)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Back to ProFeed
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Feedback detail
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
        {canTriage ? (
          <FeedbackStatusForm id={row.id} status={row.status} />
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80">
            {row.status}
          </span>
        )}
      </div>

      {user && !canEditDocs ? (
        <p className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          You can view feedback. Document edits require documentation team
          (admin) access.
        </p>
      ) : null}

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Documentation actions
        </p>
        <div className="mt-3">
          <FeedbackDocActions
            pagePath={row.page_path}
            sectionAnchor={row.section_anchor}
            canEditDocs={canEditDocs}
            showSourcePath={canEditDocs}
          />
        </div>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Page
          </dt>
          <dd className="mt-1 font-mono text-xs text-foreground/90">
            {row.page_path}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Section anchor
          </dt>
          <dd className="mt-1 font-mono text-xs text-foreground/90">
            {row.section_anchor ? `#${row.section_anchor}` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Helpful / stars
          </dt>
          <dd className="mt-1 text-foreground/90">
            {formatHelpful(row.rating)}
            {row.star_rating ? ` · ${row.star_rating}★` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Writers
          </dt>
          <dd className="mt-1 text-foreground/90">
            {authors.length ? authors.join(", ") : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Teams
          </dt>
          <dd className="mt-1 text-foreground/90">
            {teams.length ? teams.join(", ") : "—"}
          </dd>
        </div>
      </dl>

      {messageText ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Message
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {messageText}
          </p>
        </div>
      ) : null}

      {row.voice_transcript ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Voice transcript
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {row.voice_transcript}
          </p>
        </div>
      ) : null}

      {Array.isArray(row.highlights) && row.highlights.length ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Highlights and pins
          </p>
          <ul className="mt-3 space-y-3 text-sm">
            {row.highlights.map((h, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-border bg-muted/50 p-3"
              >
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-foreground/85">
                  {JSON.stringify(h, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {row.feedback_attachments && row.feedback_attachments.length ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Attachments
          </p>
          <ul className="mt-3 space-y-2">
            {row.feedback_attachments.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground/90">
                  {a.file_name}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({a.kind})
                  </span>
                </span>
                {canOpenFileLinks ? (
                  <SignedStorageLink path={a.storage_path} label="Open" />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Sign in or configure service role for downloads
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
