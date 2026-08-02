"use client";

import { useCallback, useState, type ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  caption?: string;
};

export function ZoomImage({ src, alt, caption }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <figure className="not-prose my-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-[var(--docs-border)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full" />
        </button>
        {caption ? (
          <figcaption className="mt-2 text-center text-xs text-[var(--docs-muted-fg)]">
            {caption}
          </figcaption>
        ) : null}
      </figure>
      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-label="Image preview"
          onClick={close}
          onKeyDown={(e) => e.key === "Escape" && close()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

export function DocImage(props: React.ComponentPropsWithoutRef<"img">) {
  const { src, alt, ...rest } = props;
  if (!src || typeof src !== "string") return null;
  return <ZoomImage src={src} alt={alt ?? ""} />;
}
