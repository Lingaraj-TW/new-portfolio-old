"use client";

import {
  ArrowUpRight,
  Highlighter,
  Pencil,
  Square,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { captureElementToPngDataUrl } from "@/lib/profeed/captureDocRoot";
import {
  type AnnotationTool,
  applyToolStyle,
  drawHighlighterPath,
  drawShape,
} from "@/lib/profeed/canvasDraw";
import { cn } from "@/lib/cn";
import { mergeImageWithOverlay } from "./annotateCanvas";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onExport: (file: File) => void;
};

const TOOLS: {
  id: AnnotationTool;
  label: string;
  hint: string;
  Icon: typeof Pencil;
}[] = [
  { id: "pen", label: "Pen", hint: "Draw freehand", Icon: Pencil },
  {
    id: "highlighter",
    label: "Highlighter",
    hint: "Transparent yellow, like Snipping Tool",
    Icon: Highlighter,
  },
  { id: "rectangle", label: "Rectangle", hint: "Drag a box", Icon: Square },
  { id: "arrow", label: "Arrow", hint: "Drag an arrow", Icon: ArrowUpRight },
];

/**
 * Snapshot of #doc-root + optional annotation: pen, highlighter, rectangle, arrow.
 */
export function CaptureAnnotateModal({ open, onOpenChange, onExport }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [tool, setTool] = useState<AnnotationTool>("pen");
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scrollShellRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const shapeStart = useRef<{ x: number; y: number } | null>(null);
  const shapeSnapshot = useRef<ImageData | null>(null);
  const highlightPath = useRef<{ x: number; y: number }[] | null>(null);

  const reset = useCallback(() => {
    setDataUrl(null);
    setErr(null);
    setDrawMode(false);
    setTool("pen");
    drawing.current = false;
    last.current = null;
    shapeStart.current = null;
    shapeSnapshot.current = null;
    highlightPath.current = null;
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const capture = async () => {
    setErr(null);
    setBusy(true);
    try {
      const root = document.getElementById("doc-root");
      if (!root) {
        setErr("Could not find #doc-root.");
        return;
      }
      const u = await captureElementToPngDataUrl(root, window.scrollY);
      setDataUrl(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Capture failed.");
    } finally {
      setBusy(false);
    }
  };

  const syncOverlaySize = useCallback(() => {
    const img = imgRef.current;
    const canvas = overlayRef.current;
    if (!img || !canvas) return;
    if (!img.complete) return;
    const w = img.naturalWidth || img.clientWidth;
    const h = img.naturalHeight || img.clientHeight;
    if (!w || !h) return;
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
  }, []);

  const scheduleSyncOverlay = useCallback(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    if (img.decode) {
      void img
        .decode()
        .then(syncOverlaySize)
        .catch(() => syncOverlaySize());
    } else {
      requestAnimationFrame(() => syncOverlaySize());
    }
  }, [syncOverlaySize]);

  useLayoutEffect(() => {
    if (!dataUrl || !drawMode) return;
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      scheduleSyncOverlay();
    } else {
      img.onload = () => scheduleSyncOverlay();
    }
  }, [dataUrl, drawMode, scheduleSyncOverlay]);

  useEffect(() => {
    if (!dataUrl || !drawMode) return;
    const shell = scrollShellRef.current;
    if (!shell || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => syncOverlaySize());
    });
    ro.observe(shell);
    return () => ro.disconnect();
  }, [dataUrl, drawMode, syncOverlaySize]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = overlayRef.current;
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height || !canvas.width || !canvas.height) return null;
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    return { x, y };
  };

  const clearOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapeSnapshot.current = null;
    shapeStart.current = null;
    highlightPath.current = null;
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawMode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pos(e);
    if (!p) return;
    const canvas = overlayRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cw = canvas.width;

    if (tool === "pen") {
      drawing.current = true;
      last.current = p;
      ctx.beginPath();
      applyToolStyle(ctx, tool, cw);
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      return;
    }

    if (tool === "highlighter") {
      highlightPath.current = [p];
      try {
        shapeSnapshot.current = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
      } catch {
        shapeSnapshot.current = null;
      }
      return;
    }

    if (tool === "rectangle" || tool === "arrow") {
      shapeStart.current = p;
      try {
        shapeSnapshot.current = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
      } catch {
        shapeSnapshot.current = null;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawMode) return;
    const canvas = overlayRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const p = pos(e);
    if (!p) return;
    const cw = canvas.width;

    if (tool === "pen") {
      if (!drawing.current || !last.current) return;
      ctx.beginPath();
      applyToolStyle(ctx, tool, cw);
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last.current = p;
      return;
    }

    if (tool === "highlighter" && highlightPath.current) {
      const pts = highlightPath.current;
      const lastPt = pts[pts.length - 1];
      if (Math.hypot(p.x - lastPt.x, p.y - lastPt.y) < 0.35) return;
      pts.push(p);
      const snap = shapeSnapshot.current;
      if (snap) {
        ctx.putImageData(snap, 0, 0);
      }
      drawHighlighterPath(ctx, pts, cw);
      return;
    }

    if ((tool === "rectangle" || tool === "arrow") && shapeStart.current) {
      const snap = shapeSnapshot.current;
      const s = shapeStart.current;
      if (snap) {
        ctx.putImageData(snap, 0, 0);
      }
      drawShape(ctx, tool, cw, s.x, s.y, p.x, p.y);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "pen") {
      drawing.current = false;
      last.current = null;
    }
    if (tool === "highlighter" && highlightPath.current) {
      const canvas = overlayRef.current;
      const ctx = canvas?.getContext("2d");
      const pts = highlightPath.current;
      if (canvas && ctx) {
        if (shapeSnapshot.current) {
          ctx.putImageData(shapeSnapshot.current, 0, 0);
        }
        drawHighlighterPath(ctx, pts, canvas.width);
      }
      highlightPath.current = null;
      shapeSnapshot.current = null;
    }
    if (tool === "rectangle" || tool === "arrow") {
      const p = pos(e);
      if (p && shapeStart.current && shapeSnapshot.current) {
        const canvas = overlayRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
          const s = shapeStart.current;
          ctx.putImageData(shapeSnapshot.current, 0, 0);
          drawShape(ctx, tool, canvas.width, s.x, s.y, p.x, p.y);
        }
      }
      shapeStart.current = null;
      shapeSnapshot.current = null;
    }
  };

  const finish = async () => {
    if (!dataUrl) return;
    try {
      if (drawMode && overlayRef.current) {
        const blob = await mergeImageWithOverlay(dataUrl, overlayRef.current);
        const f = new File([blob], `profeed-capture-${Date.now()}.png`, {
          type: "image/png",
        });
        onExport(f);
      } else {
        const bin = atob(dataUrl.split(",")[1] || "");
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        onExport(
          new File([u8], `profeed-capture-${Date.now()}.png`, {
            type: "image/png",
          }),
        );
      }
      onOpenChange(false);
    } catch (err) {
      setErr(err instanceof Error ? err.message : "Export failed.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[1px]" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[70] flex w-[min(92vw,520px)] max-h-[min(95vh,920px)] -translate-x-1/2 -translate-y-1/2",
            "flex-col overflow-hidden rounded-2xl border border-border/80 bg-muted p-4 shadow-2xl sm:p-5 dark:border-border dark:bg-muted",
            // Taller column so the preview `flex-1` region is larger; tools + actions stay below.
            dataUrl && "h-[min(92dvh,820px)]",
          )}
        >
          <div className="shrink-0">
            <Dialog.Title className="text-sm font-semibold text-foreground">
              Screen capture
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-muted-foreground">
              Add marks with pen, highlighter, rectangle, or arrow, then attach
              to your feedback.
            </Dialog.Description>
            {err ? (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                {err}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              "mt-4 flex min-h-0 flex-col gap-3",
              dataUrl && "min-h-0 flex-1",
            )}
          >
            {!dataUrl ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={capture}
                  className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                >
                  {busy ? "Capturing…" : "Capture page snapshot"}
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="w-full rounded-lg py-1.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground/90 dark:hover:bg-muted dark:hover:text-foreground"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col gap-2.5">
                <div
                  ref={scrollShellRef}
                  className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-muted dark:bg-card"
                >
                  {/*
 Scroll lives here only; toolbar and actions stay visible below
 (no full-dialog scroll). Inner `relative` is only as tall as the
 image.
 */}
                  <div className="relative w-full min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imgRef}
                      src={dataUrl}
                      alt=""
                      className="block w-full"
                      draggable={false}
                    />
                    {drawMode ? (
                      <canvas
                        ref={overlayRef}
                        className="pointer-events-auto absolute left-0 top-0 z-10 h-full w-full touch-none cursor-crosshair"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                      />
                    ) : null}
                  </div>
                </div>
                {drawMode ? (
                  <div
                    className="flex shrink-0 flex-wrap items-center gap-1.5 rounded-xl border border-border/80 bg-card p-1.5 dark:border-border dark:bg-muted/50"
                    role="toolbar"
                    aria-label="Annotation tools"
                  >
                    {TOOLS.map((t) => {
                      const TIcon = t.Icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          title={t.hint}
                          aria-pressed={tool === t.id}
                          onClick={() => setTool(t.id)}
                          className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-lg transition",
                            tool === t.id
                              ? "bg-indigo-600 text-accent-foreground shadow-sm dark:bg-indigo-500"
                              : "text-muted-foreground hover:bg-muted  dark:hover:bg-muted",
                          )}
                        >
                          <TIcon className="h-4 w-4" aria-hidden />
                          <span className="sr-only">{t.label}</span>
                        </button>
                      );
                    })}
                    <span className="mx-0.5 h-5 w-px bg-border dark:bg-border" />
                    <button
                      type="button"
                      title="Clear all annotations"
                      onClick={clearOverlay}
                      className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      <span className="text-xs font-medium">Clear</span>
                    </button>
                  </div>
                ) : null}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawMode((d) => !d);
                      if (drawMode) {
                        clearOverlay();
                        setTool("pen");
                      }
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium dark:border-border"
                  >
                    {drawMode
                      ? "Hide tools"
                      : "Annotate (pen, highlighter, shapes…)"}
                  </button>
                  <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={finish}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-indigo-500"
                    >
                      Add image to feedback
                    </button>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground/90 dark:hover:bg-muted dark:hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
