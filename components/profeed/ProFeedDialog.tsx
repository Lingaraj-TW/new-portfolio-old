"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { HighlightEntry } from "@/lib/types/feedback";

import { AttachmentsField } from "./AttachmentsField";
import { CaptureAnnotateModal } from "./CaptureAnnotateModal";
import { MessageEditor, type MessageEditorHandle } from "./MessageEditor";
import { MultiSelectTeams, MultiSelectWriters } from "./MultiSelectChips";
import { VoiceInputButton } from "./VoiceInputButton";
import { cn } from "@/lib/cn";

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

function forgetSecret(id: string) {
  const next = { ...readSecrets() };
  delete next[id];
  window.localStorage.setItem(SECRETS_KEY, JSON.stringify(next));
}

type PageSubmission = {
  id: string;
  secret: string;
  page_path: string;
  section_anchor: string | null;
  body: string;
  rating: number | null;
  star_rating: number | null;
  status: string;
  created_at: string;
};

function pathsMatch(a: string, b: string) {
  if (a === b) return true;
  const normalize = (p: string) =>
    p.replace(/^\/docs/, "/prodoc").replace(/\/$/, "") || "/prodoc";
  return normalize(a) === normalize(b);
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

function closestHeadingId(
  node: Node | null,
  root: Element | null,
): string | undefined {
  if (!node || !root) return undefined;
  let n: Node | null = node;
  for (let i = 0; i < 8 && n; i++) {
    if (n instanceof HTMLElement) {
      const tag = n.tagName?.toLowerCase();
      if (tag && /^h[1-4]$/.test(tag) && n.id) return n.id;
    }
    n = n.parentNode;
    if (n === root) break;
  }
  return undefined;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProFeedDialog({ open, onOpenChange }: Props) {
  const pathname = usePathname();
  const editorRef = useRef<MessageEditorHandle>(null);

  const [section, setSection] = useState<string | null>(null);
  const [sectionManual, setSectionManual] = useState<string>("");
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [stars, setStars] = useState<number | null>(null);
  const [rating, setRating] = useState<1 | -1 | 0 | null>(null);
  const [messageHtml, setMessageHtml] = useState("<p></p>");
  const [taggedAuthors, setTaggedAuthors] = useState<string[]>([]);
  const [taggedTeams, setTaggedTeams] = useState<string[]>([]);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [highlights, setHighlights] = useState<HighlightEntry[]>([]);
  const [captureText, setCaptureText] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<"new" | "yours">("new");
  const [pageSubmissions, setPageSubmissions] = useState<PageSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const loadPageSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    try {
      const secrets = readSecrets();
      const pairs = Object.entries(secrets);
      if (!pairs.length) {
        setPageSubmissions([]);
        return;
      }
      const loaded: PageSubmission[] = [];
      await Promise.all(
        pairs.map(async ([id, secret]) => {
          const res = await fetch(`/api/feedback/${id}`, {
            headers: { "x-edit-secret": secret },
          });
          if (!res.ok) {
            if (res.status === 403 || res.status === 404) forgetSecret(id);
            return;
          }
          const data = (await res.json()) as {
            ok?: boolean;
            feedback?: Omit<PageSubmission, "id" | "secret">;
          };
          const row = data.feedback;
          if (!row || !pathsMatch(row.page_path, pathname ?? "")) return;
          loaded.push({ id, secret, ...row });
        }),
      );
      loaded.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setPageSubmissions(loaded);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    void loadPageSubmissions();
  }, [open, loadPageSubmissions]);

  useEffect(() => {
    const sync = () => setSection(sectionFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const id = window.requestAnimationFrame(() => {
      const root = document.getElementById("doc-root");
      if (!root) {
        if (!cancelled) setHeadings([]);
        return;
      }
      const hs = [...root.querySelectorAll("h1[id],h2[id],h3[id],h4[id]")].map(
        (el) => ({
          id: (el as HTMLElement).id,
          text: (el.textContent || "").trim() || (el as HTMLElement).id,
        }),
      );
      if (!cancelled) setHeadings(hs);
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [pathname, open]);

  useEffect(() => {
    if (!captureText) return;
    const onMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text) return;
      const root = document.getElementById("doc-root");
      const anchor = closestHeadingId(sel?.anchorNode ?? null, root);
      setHighlights((h) => [
        ...h,
        {
          kind: "text",
          quote: text.slice(0, 2000),
          note: "",
          anchorId: anchor,
        },
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
      let anchor: string | undefined;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) anchor = closestHeadingId(el, root);
      setHighlights((h) => [
        ...h,
        {
          kind: "pin",
          xPct: Math.min(100, Math.max(0, xPct)),
          yPct: Math.min(100, Math.max(0, yPct)),
          note: "",
          anchorId: anchor,
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
    setMessageHtml("<p></p>");
    setTaggedAuthors([]);
    setTaggedTeams([]);
    setVoiceTranscript("");
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

  const onVoicePhrase = useCallback((text: string) => {
    setVoiceTranscript((v) => (v ? `${v}\n${text}` : text));
    editorRef.current?.insertText(text);
  }, []);

  const submit = useCallback(async () => {
    if (stars === null) {
      setErrorText("Please rate page quality (1–5 stars).");
      return;
    }
    if (rating === null) {
      setErrorText("Please choose helpful, not helpful, or neutral.");
      return;
    }
    setState("submitting");
    setErrorText(null);
    try {
      const html = editorRef.current?.getHtml() ?? messageHtml;
      const fd = new FormData();
      fd.append("page_path", pathname);
      fd.append("section_anchor", effectiveSection || "");
      fd.append("body", html);
      fd.append("body_format", "html");
      fd.append("visitor_session", getOrCreateVisitorId());
      fd.append("highlights", JSON.stringify(highlights));
      fd.append("tagged_authors", JSON.stringify(taggedAuthors));
      fd.append("tagged_teams", JSON.stringify(taggedTeams));
      fd.append("voice_transcript", voiceTranscript);
      fd.append("rating", String(rating));
      fd.append("star_rating", String(stars));
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/feedback", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        id?: string;
        editSecret?: string;
      } | null;
      if (!res.ok) {
        setState("error");
        setErrorText(data?.error || "Could not send feedback.");
        return;
      }
      if (data?.id && data?.editSecret) {
        mergeSecret(data.id, data.editSecret);
      }
      setState("success");
      void loadPageSubmissions();
      setRating(null);
      setStars(null);
      setMessageHtml("<p></p>");
      setHighlights([]);
      setFiles([]);
      setVoiceTranscript("");
    } catch {
      setState("error");
      setErrorText("Network error. Try again.");
    }
  }, [
    effectiveSection,
    files,
    highlights,
    messageHtml,
    pathname,
    rating,
    stars,
    taggedAuthors,
    taggedTeams,
    voiceTranscript,
    loadPageSubmissions,
  ]);

  const blockCloseForPageInteraction = pinMode || captureText;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
        <Dialog.Portal>
          {/*
 pointer-events: none so clicks reach #doc-root for "Drop a pin" / "Highlight text".
 Without this, the overlay (and modal=true body lock) block the page entirely.
 style wins over Radix's default overlay pointerEvents: auto.
 */}
          <Dialog.Overlay
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out"
            style={{ pointerEvents: "none" }}
          />
          <Dialog.Content
            className={cn(
              "fixed right-4 top-4 z-50 flex max-h-[calc(100vh-2rem)] w-[min(100%-2rem,440px)] flex-col rounded-2xl border border-border/90",
              "bg-white/95 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-md",
              "dark:border-border/90 dark:bg-card/95",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
            )}
            onPointerDownOutside={(e) => {
              if (blockCloseForPageInteraction) e.preventDefault();
            }}
            onInteractOutside={(e) => {
              if (blockCloseForPageInteraction) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (pinMode) {
                e.preventDefault();
                setPinMode(false);
                return;
              }
              if (captureText) {
                e.preventDefault();
                setCaptureText(false);
                return;
              }
            }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/80 px-4 py-3 dark:border-border">
              <div className="min-w-0 flex-1 pr-2">
                <Dialog.Title className="text-sm font-semibold tracking-tight text-foreground">
                  ProFeed
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-muted-foreground">
                  Documentation feedback: stars, helpfulness, tags, optional
                  screenshot or highlights, and attachments.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="shrink-0 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                  onClick={() => resetForm()}
                >
                  Close
                </button>
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-4 flex gap-1 rounded-lg border border-border/80 bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setPanelMode("new")}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition",
                    panelMode === "new"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  New feedback
                </button>
                <button
                  type="button"
                  onClick={() => setPanelMode("yours")}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition",
                    panelMode === "yours"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Your feedback
                  {pageSubmissions.length ? (
                    <span className="ml-1 text-[10px] text-[var(--docs-primary)]">
                      ({pageSubmissions.length})
                    </span>
                  ) : null}
                </button>
              </div>

              {panelMode === "yours" ? (
                <PageSubmissionsPanel
                  loading={loadingSubmissions}
                  submissions={pageSubmissions}
                  onRefresh={loadPageSubmissions}
                  onStartNew={() => setPanelMode("new")}
                />
              ) : (
                <>
              <p className="text-[11px] text-muted-foreground">
                Section:{" "}
                <span className="font-mono text-foreground/75">
                  {sectionLabel}
                </span>
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Page quality <span className="text-rose-600">*</span>
                  </p>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStars(n)}
                        className={cn(
                          "h-10 w-10 rounded-xl border text-sm font-semibold transition hover:scale-105",
                          stars === n
                            ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm dark:bg-amber-950/40 dark:text-amber-100"
                            : "border-border bg-card text-foreground/80 dark:bg-card dark:text-foreground",
                        )}
                        aria-label={`${n} stars`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Helpfulness <span className="text-rose-600">*</span>
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { v: 1 as const, label: "Helpful", emoji: "👍" },
                        { v: -1 as const, label: "Not helpful", emoji: "👎" },
                        { v: 0 as const, label: "Neutral", emoji: "😐" },
                      ] as const
                    ).map(({ v, label, emoji }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRating(v)}
                        className={cn(
                          "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-[11px] font-medium transition",
                          rating === v
                            ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                            : "border-border bg-card text-foreground/90 dark:bg-card dark:text-foreground",
                        )}
                      >
                        <span className="text-lg" aria-hidden>
                          {emoji}
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-xs font-medium text-muted-foreground">
                  Target section
                  <select
                    value={sectionManual || section || ""}
                    onChange={(e) => applySectionAnchor(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-foreground dark:bg-card dark:text-foreground"
                  >
                    <option value="">Whole page (no anchor)</option>
                    {headings.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.text}
                      </option>
                    ))}
                  </select>
                </label>

                <MultiSelectWriters
                  value={taggedAuthors}
                  onChange={setTaggedAuthors}
                />
                <MultiSelectTeams
                  value={taggedTeams}
                  onChange={setTaggedTeams}
                />

                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Optional: capture a snapshot or point to text and locations
                    on the page behind this panel.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCaptureModalOpen(true)}
                    className="w-full rounded-xl border border-indigo-500/40 bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-900 dark:text-indigo-100"
                  >
                    Screen capture &amp; annotate
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPinMode(false);
                        setCaptureText((v) => !v);
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        captureText
                          ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                          : "border-border bg-card dark:border-border dark:bg-card",
                      )}
                    >
                      {captureText ? "Selecting text…" : "Highlight text"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCaptureText(false);
                        setPinMode((v) => !v);
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        pinMode
                          ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                          : "border-border bg-card dark:border-border dark:bg-card",
                      )}
                    >
                      {pinMode ? "Click the page…" : "Drop a pin"}
                    </button>
                  </div>
                </div>

                {highlights.length ? (
                  <ul className="space-y-2 rounded-xl border border-border/80 bg-muted/50 p-3 text-xs dark:border-border dark:bg-muted/40">
                    {highlights.map((h, idx) => (
                      <li
                        key={`${idx}-${h.kind}`}
                        className="flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground/80">
                            {h.kind === "text" ? "Text" : "Pin"}
                            {h.anchorId ? (
                              <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                                #{h.anchorId}
                              </span>
                            ) : null}
                          </span>
                          <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                            {h.kind === "text"
                              ? h.quote
                              : `${h.xPct.toFixed(1)}%, ${h.yPct.toFixed(1)}%`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHighlight(idx)}
                          className="shrink-0 text-[11px] text-rose-600"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <AttachmentsField files={files} onFilesChange={setFiles} />

                <MessageEditor
                  ref={editorRef}
                  value={messageHtml}
                  onChangeHtml={setMessageHtml}
                  disabled={state === "submitting"}
                />

                <VoiceInputButton
                  onTranscript={onVoicePhrase}
                  disabled={state === "submitting"}
                />
                {voiceTranscript ? (
                  <p className="text-[11px] text-muted-foreground">
                    Voice transcript (also stored on the row):{" "}
                    <span className="font-mono text-foreground/75">
                      {voiceTranscript.slice(0, 200)}
                      {voiceTranscript.length > 200 ? "…" : ""}
                    </span>
                  </p>
                ) : null}

                {errorText ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    {errorText}
                  </p>
                ) : null}
                {state === "success" ? (
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Thanks — feedback saved.{" "}
                    <button
                      type="button"
                      className="font-medium underline"
                      onClick={() => {
                        setPanelMode("yours");
                        void loadPageSubmissions();
                      }}
                    >
                      Update it in Your feedback
                    </button>
                    .
                  </p>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted dark:hover:bg-muted"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={state === "submitting"}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
                  >
                    {state === "submitting" ? "Sending…" : "Send feedback"}
                  </button>
                </div>
              </div>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <CaptureAnnotateModal
        open={captureModalOpen}
        onOpenChange={setCaptureModalOpen}
        onExport={(f) => setFiles((prev) => [...prev, f].slice(0, 12))}
      />
    </>
  );
}

function PageSubmissionsPanel({
  loading,
  submissions,
  onRefresh,
  onStartNew,
}: {
  loading: boolean;
  submissions: PageSubmission[];
  onRefresh: () => Promise<void>;
  onStartNew: () => void;
}) {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading your feedback on this page…
      </p>
    );
  }

  if (!submissions.length) {
    return (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          No editable feedback for this page on this device. Submit new feedback
          from the <strong className="text-foreground">New feedback</strong>{" "}
          tab — you can update it here afterward.
        </p>
        <button
          type="button"
          onClick={onStartNew}
          className="rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground hover:bg-accent/90"
        >
          Submit feedback
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-muted-foreground">
        Update or delete feedback you submitted on this page. Changes sync to
        ProFeed triage.
      </p>
      {submissions.map((row) => (
        <PageSubmissionEditor key={row.id} row={row} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function PageSubmissionEditor({
  row,
  onRefresh,
}: {
  row: PageSubmission;
  onRefresh: () => Promise<void>;
}) {
  const [body, setBody] = useState(row.body);
  const [stars, setStars] = useState<number | null>(row.star_rating);
  const [rating, setRating] = useState<number | null>(row.rating);
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {new Date(row.created_at).toLocaleString()}
        </p>
        <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-medium text-foreground/80">
          {row.status}
        </span>
      </div>
      {row.section_anchor ? (
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          #{row.section_anchor}
        </p>
      ) : null}
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Message
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
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
                className={cn(
                  "h-8 w-8 rounded-md border text-xs font-semibold",
                  stars === n
                    ? "border-amber-500 bg-amber-50 text-amber-900"
                    : "border-border bg-card",
                )}
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
            {(
              [
                { v: 1, label: "👍" },
                { v: -1, label: "👎" },
                { v: 0, label: "😐" },
              ] as const
            ).map(({ v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  rating === v
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-border bg-card",
                )}
              >
                {label}
              </button>
            ))}
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
                "x-edit-secret": row.secret,
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
            await onRefresh();
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
              headers: { "x-edit-secret": row.secret },
            });
            setPending(false);
            if (!res.ok) {
              const j = (await res.json().catch(() => null)) as {
                error?: string;
              } | null;
              setMsg(j?.error || "Could not delete.");
              return;
            }
            forgetSecret(row.id);
            await onRefresh();
          }}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
