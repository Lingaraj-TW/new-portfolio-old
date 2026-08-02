"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SignedStorageLink } from "@/components/shared/SignedStorageLink";
import {
  FeedbackDocActionsView,
  type FeedbackDocActionsViewProps,
} from "@/components/profeed/FeedbackDocActionsView";

const SECRETS_KEY = "prodoc_feedback_secrets";

function readSecrets(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(SECRETS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function forgetSecret(id: string) {
  const next = { ...readSecrets() };
  delete next[id];
  window.localStorage.setItem(SECRETS_KEY, JSON.stringify(next));
}

export type PortalAttachment = {
  id: string;
  file_name: string;
  storage_path: string;
  kind: string;
};

export type PortalRow = {
  id: string;
  page_path: string;
  section_anchor: string | null;
  body: string;
  rating: number | null;
  star_rating: number | null;
  tagged_author: string | null;
  tagged_team: string | null;
  highlights: unknown;
  status: string;
  created_at: string;
  feedback_attachments: PortalAttachment[] | null;
};

function formatHelpful(rating: number | null) {
  if (rating === 1) return "Helpful";
  if (rating === -1) return "Not helpful";
  return "—";
}

export function PortalFeedbackList({
  rows,
  docActionsById = {},
}: {
  rows: PortalRow[];
  docActionsById?: Record<string, FeedbackDocActionsViewProps>;
}) {
  const [secrets, setSecrets] = useState<Record<string, string>>({});

  useEffect(() => {
    const t = window.setTimeout(() => setSecrets(readSecrets()), 0);
    return () => window.clearTimeout(t);
  }, []);

  const refreshSecrets = () => setSecrets(readSecrets());

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const secret = secrets[row.id];
        return (
          <article
            key={row.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {new Date(row.created_at).toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {row.page_path}
                </p>
                <Link
                  href={`/profeed/feedback/${row.id}`}
                  className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
                >
                  View detail
                </Link>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80 dark:bg-muted">
                {row.status}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Section
                </dt>
                <dd className="mt-1 font-mono text-xs text-foreground/80">
                  {row.section_anchor ? `#${row.section_anchor}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Stars / helpful
                </dt>
                <dd className="mt-1 text-foreground/80">
                  {row.star_rating ? `${row.star_rating}★` : "—"} ·{" "}
                  {formatHelpful(row.rating)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tagged author
                </dt>
                <dd className="mt-1 text-foreground/80">
                  {row.tagged_author || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tagged team
                </dt>
                <dd className="mt-1 text-foreground/80">
                  {row.tagged_team || "—"}
                </dd>
              </div>
            </dl>

            {docActionsById[row.id] ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Documentation
                </p>
                <div className="mt-2">
                  <FeedbackDocActionsView
                    {...docActionsById[row.id]}
                    compact
                  />
                </div>
              </div>
            ) : null}

            {row.body ? (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {row.body}
              </p>
            ) : null}

            {Array.isArray(row.highlights) && row.highlights.length ? (
              <div className="mt-4 rounded-xl border border-border bg-muted p-3 text-xs">
                <p className="font-semibold text-foreground/90">
                  Highlights & pins
                </p>
                <ul className="mt-2 space-y-2 text-foreground/80">
                  {row.highlights.map((h, idx) => (
                    <li key={idx}>
                      <span className="font-medium">
                        {typeof h === "object" && h && "kind" in h
                          ? String((h as { kind?: string }).kind)
                          : "note"}
                      </span>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-card p-2 text-[11px] dark:bg-background">
                        {JSON.stringify(h, null, 2)}
                      </pre>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {row.feedback_attachments && row.feedback_attachments.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Attachments
                </p>
                <ul className="mt-2 space-y-2">
                  {row.feedback_attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-foreground/90">
                        {a.file_name}{" "}
                        <span className="font-normal text-muted-foreground">
                          ({a.kind})
                        </span>
                      </span>
                      <div className="flex items-center gap-3">
                        <SignedStorageLink path={a.storage_path} label="Open" />
                        {secret ? (
                          <button
                            type="button"
                            className="text-rose-600 hover:underline"
                            onClick={async () => {
                              const res = await fetch(
                                `/api/feedback/attachments/${a.id}`,
                                {
                                  method: "DELETE",
                                  headers: { "x-edit-secret": secret },
                                },
                              );
                              if (res.ok) window.location.reload();
                            }}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {secret ? (
              <ManageBlock
                row={row}
                secret={secret}
                onDeleted={() => {
                  forgetSecret(row.id);
                  refreshSecrets();
                }}
              />
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Manage links are stored on the device that submitted this
                feedback.
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

function ManageBlock({
  row,
  secret,
  onDeleted,
}: {
  row: PortalRow;
  secret: string;
  onDeleted: () => void;
}) {
  const [body, setBody] = useState(row.body);
  const [stars, setStars] = useState<number | null>(row.star_rating);
  const [rating, setRating] = useState<number | null>(row.rating);
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 text-sm dark:border-indigo-900/50 dark:bg-indigo-950/30">
      <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">
        Manage on this device
      </p>
      <label className="mt-3 block text-xs font-medium text-foreground/80">
        Message
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm dark:bg-card dark:text-foreground"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Stars</p>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStars(n)}
                className={`h-8 w-8 rounded-md border text-xs font-semibold ${
                  stars === n
                    ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                    : "border-border bg-card dark:border-border dark:bg-card"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">
            Helpful
          </p>
          <div className="mt-1 flex gap-1">
            <button
              type="button"
              onClick={() => setRating(1)}
              className={`rounded-md border px-2 py-1 text-xs ${
                rating === 1
                  ? "border-purple-500 bg-purple-50"
                  : "border-border bg-card"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setRating(-1)}
              className={`rounded-md border px-2 py-1 text-xs ${
                rating === -1
                  ? "border-rose-500 bg-rose-50"
                  : "border-border bg-card"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
      {msg ? <p className="mt-2 text-xs text-rose-600">{msg}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            setPending(true);
            setMsg(null);
            const res = await fetch(`/api/feedback/${row.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-edit-secret": secret,
              },
              body: JSON.stringify({
                body,
                star_rating: stars,
                rating,
              }),
            });
            const j = (await res.json().catch(() => null)) as {
              error?: string;
            } | null;
            setPending(false);
            if (!res.ok) {
              setMsg(j?.error || "Could not save.");
              return;
            }
            window.location.reload();
          }}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
        >
          Save changes
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            if (!window.confirm("Delete this feedback permanently?")) return;
            setPending(true);
            setMsg(null);
            const res = await fetch(`/api/feedback/${row.id}`, {
              method: "DELETE",
              headers: { "x-edit-secret": secret },
            });
            setPending(false);
            if (!res.ok) {
              const j = (await res.json().catch(() => null)) as {
                error?: string;
              } | null;
              setMsg(j?.error || "Could not delete.");
              return;
            }
            onDeleted();
            window.location.reload();
          }}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/40"
        >
          Delete feedback
        </button>
      </div>
    </div>
  );
}
