"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

const MAX_FILES = 12;

type Props = {
  files: File[];
  onFilesChange: (next: File[]) => void;
  disabled?: boolean;
};

/**
 * Drag-and-drop + file picker; shows simple previews for images.
 */
export function AttachmentsField({ files, onFilesChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const push = useCallback(
    (incoming: File[]) => {
      onFilesChange([...files, ...incoming].slice(0, MAX_FILES));
    },
    [files, onFilesChange],
  );

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDrag(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) {
      push([...e.dataTransfer.files]);
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">Attachments</p>
      <div
        onDragEnter={() => setDrag(true)}
        onDragLeave={() => setDrag(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition",
          drag
            ? "border-indigo-500/60 bg-indigo-500/5"
            : "border-border/80 bg-muted/50 dark:border-border dark:bg-muted/30",
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="*/*"
          onChange={(e) => {
            const list = e.target.files;
            if (list?.length) push([...list]);
            e.target.value = "";
          }}
        />
        <span className="text-sm text-muted-foreground">
          Drop files or{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            browse
          </span>
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          Images, PDF, Office, audio, video (limits apply on server)
        </span>
      </div>
      {files.length ? (
        <ul className="mt-3 space-y-2">
          {files.map((f, idx) => (
            <li
              key={`${f.name}-${idx}`}
              className="flex items-start gap-3 rounded-lg border border-border/80 bg-card p-2 dark:border-border dark:bg-muted/50"
            >
              {f.type.startsWith("image/") ? (
                <PreviewImage file={f} />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-muted text-lg dark:bg-muted">
                  📎
                </div>
              )}
              <div className="min-w-0 flex-1 text-xs text-foreground/80">
                <p className="truncate font-medium">{f.name}</p>
                <p className="text-muted-foreground">
                  {(f.size / 1024).toFixed(0)} KB · {f.type || "file"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onFilesChange(files.filter((_, i) => i !== idx))}
                className="shrink-0 text-xs text-rose-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PreviewImage({ file }: { file: File }) {
  const [url] = useState(() => URL.createObjectURL(file));
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
  );
}
