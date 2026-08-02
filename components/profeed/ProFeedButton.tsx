"use client";

import { forwardRef, type Ref } from "react";

type Props = {
  onClick: () => void;
  className?: string;
};

/**
 * Primary floating CTA for ProFeed on doc pages.
 */
export const ProFeedButton = forwardRef<HTMLButtonElement, Props>(
  function ProFeedButton(
    { onClick, className = "" },
    ref: Ref<HTMLButtonElement>,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={[
          "ml-auto flex items-center gap-2 rounded-full border border-accent/30 bg-accent px-4 py-2.5 text-sm font-semibold",
          "text-accent-foreground shadow-[0_10px_36px_rgba(14,124,140,0.28)]",
          "transition hover:scale-[1.02] hover:border-accent/45 hover:bg-accent/90",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className="inline-flex h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]"
          aria-hidden
        />
        ProFeed
      </button>
    );
  },
);
