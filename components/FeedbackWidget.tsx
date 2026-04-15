"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import type { HighlightEntry } from "@/lib/types/feedback";

type SubmitState = "idle" | "submitting" | "success" | "error";

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

function mergeSecret(id: string, secret: string) {
  const next = { ...readSecrets(), [id]: secret };
  window.localStorage.setItem(SECRETS_KEY, JSON.stringify(next));
}

function getOrCreateVisitorId(): string {
  const key = "prodoc_visitor_id";
  try {
    let id = window.localStorage.getItem(key);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function sectionFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "").trim();
  return hash || null;
}

function docSlugFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/docs\/([^/]+)$/);
  return m?.[1] ?? null;
}

type DocMeta = {
  title: string;
  authors?: string[];
  team?: string;
};

export function FeedbackWidget() {
  const pathname = usePathname();
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [sectionManual, setSectionManual] = useState<string>("");
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [rating, setRating] = useState<1 | -1 | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [taggedAuthor, setTaggedAuthor] = useState("");
  const [taggedTeam, setTaggedTeam] = useState("");
  const [meta, setMeta] = useState<DocMeta | null>(null);
  const [highlights, setHighlights] = useState<HighlightEntry[]>([]);
  const [captureText, setCaptureText] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const slug = useMemo(() => docSlugFromPath(pathname), [pathname]);

  useEffect(() => {
    const sync = () => setSection(sectionFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      const clearMeta = window.setTimeout(() => {
        if (!cancelled) setMeta(null);
      }, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(clearMeta);
      };
    }
    void fetch(`/api/docs/${slug}/meta`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j) setMeta(j as DocMeta);
      })
      .catch(() => {
        if (!cancelled) setMeta(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    const id = window.requestAnimationFrame(() => {
      const root = document.getElementById("doc-root");
      if (!root) {
        if (!cancelled) setHeadings([]);
        return;
      }
      const hs = [...root.querySelectorAll("h2[id], h3[id]")].map((el) => ({
        id: el.id,
        text: (el.textContent || "").trim() || el.id,
      }));
      if (!cancelled) setHeadings(hs);
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [pathname]);

  useEffect(() => {
    if (!captureText) return;
    const onMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text) return;
      setHighlights((h) => [
        ...h,
        { kind: "text", quote: text.slice(0, 2000), note: "" },
      ]);
      setCaptureText(false);
      sel?.removeAllRanges?.();
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [captureText]);

  useEffect(() => {
    if (!pinMode) return;
    const root = document.getElementById("doc-root");
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node) || !root.contains(e.target)) return;
      const rect = root.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      setHighlights((h) => [
        ...h,
        {
          kind: "pin",
          xPct: Math.min(100, Math.max(0, xPct)),
          yPct: Math.min(100, Math.max(0, yPct)),
          note: "",
        },
      ]);
      setPinMode(false);
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [pinMode]);

  const sectionLabel = useMemo(() => {
    const anchor = sectionManual || section;
    if (anchor) return `#${anchor}`;
    return "Whole page";
  }, [section, sectionManual]);

  const effectiveSection = sectionManual || section;

  const applySectionAnchor = useCallback((anchor: string) => {
    const next = anchor.trim().replace(/^#/, "");
    setSectionManual(next);
    if (typeof window !== "undefined") {
      window.location.hash = next ? `#${next}` : "";
    }
  }, []);

  const resetForm = useCallback(() => {
    setRating(null);
    setStars(null);
    setMessage("");
    setHighlights([]);
    setFiles([]);
    setState("idle");
    setErrorText(null);
    setCaptureText(false);
    setPinMode(false);
  }, []);

  const removeHighlight = useCallback((idx: number) => {
    setHighlights((h) => h.filter((_, i) => i !== idx));
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((f) => f.filter((_, i) => i !== idx));
  }, []);

  const submit = useCallback(async () => {
    if (rating === null && stars === null) {
      setErrorText("Choose helpful / not helpful and/or a star rating.");
      return;
    }
    setState("submitting");
    setErrorText(null);
    try {
      const fd = new FormData();
      fd.append("page_path", pathname);
      fd.append("section_anchor", effectiveSection || "");
      fd.append("body", message.trim());
      fd.append("visitor_session", getOrCreateVisitorId());
      fd.append("highlights", JSON.stringify(highlights));
      fd.append("tagged_author", taggedAuthor.trim());
      fd.append("tagged_team", taggedTeam.trim());
      if (rating !== null) fd.append("rating", String(rating));
      if (stars !== null) fd.append("star_rating", String(stars));
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/feedback", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as
        | {
            ok?: boolean;
            error?: string;
            id?: string;
            editSecret?: string;
          }
        | null;
      if (!res.ok) {
        setState("error");
        setErrorText(data?.error || "Could not send feedback.");
        return;
      }
      if (data?.id && data?.editSecret) {
        mergeSecret(data.id, data.editSecret);
      }
      setState("success");
      setRating(null);
      setStars(null);
      setMessage("");
      setHighlights([]);
      setFiles([]);
    } catch {
      setState("error");
      setErrorText("Network error. Try again.");
    }
  }, [effectiveSection, files, highlights, message, pathname, rating, stars, taggedAuthor, taggedTeam]);

  if (!pathname.startsWith("/docs")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 sm:p-6">
      <div className="pointer-events-auto w-full max-w-lg">
        {open ? (
          <div
            className="max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            role="region"
            aria-labelledby={panelId}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id={panelId}
                  className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                >
                  Customer feedback
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Section:{" "}
                  <span className="font-mono text-zinc-700 dark:text-zinc-200">
                    {sectionLabel}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Page quality (stars)
                </p>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStars(n)}
                      className={`h-9 w-9 rounded-lg border text-sm font-semibold ${
                        stars === n
                          ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                      }`}
                      aria-label={`${n} stars`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Helpfulness
                </p>
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRating(1)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                      rating === 1
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                        : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    }`}
                  >
                    Helpful
                  </button>
                  <button
                    type="button"
                    onClick={() => setRating(-1)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                      rating === -1
                        ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                        : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    }`}
                  >
                    Not helpful
                  </button>
                </div>
              </div>
            </div>

            <label className="mt-3 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Target section
              <select
                value={sectionManual || section || ""}
                onChange={(e) => applySectionAnchor(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
              >
                <option value="">Whole page (no anchor)</option>
                {headings.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.text}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Tag author
                <select
                  value={taggedAuthor}
                  onChange={(e) => setTaggedAuthor(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  <option value="">Not specified</option>
                  {(meta?.authors || ["Linga Raj M"]).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Tag team
                <select
                  value={taggedTeam}
                  onChange={(e) => setTaggedTeam(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  <option value="">Not specified</option>
                  {[meta?.team, "Docs", "Engineering", "Product", "Design"]
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((t) => (
                      <option key={t as string} value={t as string}>
                        {t as string}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setPinMode(false);
                  setCaptureText((v) => !v);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  captureText
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                    : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200"
                }`}
              >
                {captureText ? "Selecting text…" : "Highlight selected text"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCaptureText(false);
                  setPinMode((v) => !v);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  pinMode
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                    : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200"
                }`}
              >
                {pinMode ? "Click the page…" : "Drop a pin on the page"}
              </button>
            </div>

            {highlights.length ? (
              <ul className="mt-3 space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-950">
                {highlights.map((h, idx) => (
                  <li
                    key={`${idx}-${h.kind}`}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                        {h.kind === "text" ? "Text" : "Pin"}
                      </span>
                      <p className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">
                        {h.kind === "text"
                          ? h.quote
                          : `${h.xPct.toFixed(1)}%, ${h.yPct.toFixed(1)}%`}
                      </p>
                      <input
                        value={h.note || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setHighlights((list) =>
                            list.map((item, i) => {
                              if (i !== idx) return item;
                              if (item.kind === "text") {
                                return { kind: "text", quote: item.quote, note: v };
                              }
                              return {
                                kind: "pin",
                                xPct: item.xPct,
                                yPct: item.yPct,
                                note: v,
                              };
                            }),
                          );
                        }}
                        className="mt-1 w-full rounded border border-zinc-200 bg-white px-2 py-1 text-[11px] dark:border-zinc-700 dark:bg-zinc-900"
                        placeholder="Optional note"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="shrink-0 rounded-md px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <label className="mt-3 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Files & screenshots
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,text/plain"
                onChange={(e) => {
                  const list = e.target.files ? [...e.target.files] : [];
                  setFiles((f) => [...f, ...list].slice(0, 8));
                  e.target.value = "";
                }}
                className="mt-1 block w-full text-xs text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white dark:text-zinc-300 dark:file:bg-zinc-100 dark:file:text-zinc-900"
              />
            </label>
            {files.length ? (
              <ul className="mt-2 space-y-1 text-xs text-zinc-700 dark:text-zinc-200">
                {files.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} className="flex items-center justify-between gap-2">
                    <span className="truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="shrink-0 text-rose-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <label className="mt-3 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
                placeholder="Context, severity, or what should change…"
              />
            </label>

            {errorText ? (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{errorText}</p>
            ) : null}
            {state === "success" ? (
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                Thanks — feedback saved. You can manage it later from the customer portal
                on this device (edit link is stored locally).
              </p>
            ) : null}

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={state === "submitting"}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {state === "submitting" ? "Sending…" : "Send feedback"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-auto rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Feedback
          </button>
        )}
      </div>
    </div>
  );
}
