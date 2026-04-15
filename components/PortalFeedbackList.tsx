"use client";

import { useEffect, useState } from "react";

import { SignedStorageLink } from "@/components/SignedStorageLink";

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

export function PortalFeedbackList({ rows }: { rows: PortalRow[] }) {
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
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(row.created_at).toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-50">
                  {row.page_path}
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {row.status}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Section
                </dt>
                <dd className="mt-1 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                  {row.section_anchor ? `#${row.section_anchor}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Stars / helpful
                </dt>
                <dd className="mt-1 text-zinc-800 dark:text-zinc-200">
                  {row.star_rating ? `${row.star_rating}★` : "—"} ·{" "}
                  {formatHelpful(row.rating)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tagged author
                </dt>
                <dd className="mt-1 text-zinc-800 dark:text-zinc-200">
                  {row.tagged_author || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tagged team
                </dt>
                <dd className="mt-1 text-zinc-800 dark:text-zinc-200">
                  {row.tagged_team || "—"}
                </dd>
              </div>
            </dl>

            {row.body ? (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {row.body}
              </p>
            ) : null}

            {Array.isArray(row.highlights) && row.highlights.length ? (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  Highlights & pins
                </p>
                <ul className="mt-2 space-y-2 text-zinc-700 dark:text-zinc-200">
                  {row.highlights.map((h, idx) => (
                    <li key={idx}>
                      <span className="font-medium">
                        {typeof h === "object" && h && "kind" in h
                          ? String((h as { kind?: string }).kind)
                          : "note"}
                      </span>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-white p-2 text-[11px] dark:bg-black">
                        {JSON.stringify(h, null, 2)}
                      </pre>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {row.feedback_attachments && row.feedback_attachments.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Attachments
                </p>
                <ul className="mt-2 space-y-2">
                  {row.feedback_attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">
                        {a.file_name}{" "}
                        <span className="font-normal text-zinc-500">({a.kind})</span>
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
              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                Manage links are stored on the device that submitted this feedback.
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
      <label className="mt-3 block text-xs font-medium text-zinc-700 dark:text-zinc-200">
        Message
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            Stars
          </p>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStars(n)}
                className={`h-8 w-8 rounded-md border text-xs font-semibold ${
                  stars === n
                    ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                    : "border-zinc-200 bg-white dark:border-zinc-600 dark:bg-zinc-950"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            Helpful
          </p>
          <div className="mt-1 flex gap-1">
            <button
              type="button"
              onClick={() => setRating(1)}
              className={`rounded-md border px-2 py-1 text-xs ${
                rating === 1 ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setRating(-1)}
              className={`rounded-md border px-2 py-1 text-xs ${
                rating === -1 ? "border-rose-500 bg-rose-50" : "border-zinc-200 bg-white"
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
            const j = (await res.json().catch(() => null)) as { error?: string } | null;
            setPending(false);
            if (!res.ok) {
              setMsg(j?.error || "Could not save.");
              return;
            }
            window.location.reload();
          }}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
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
              const j = (await res.json().catch(() => null)) as { error?: string } | null;
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
