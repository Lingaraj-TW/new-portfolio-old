import Link from "next/link";

import { isExternalDocHref } from "@/lib/prodoc-urls";

export type FeedbackDocActionsViewProps = {
  liveHref: string | null;
  editUrl: string | null;
  canEditDocs: boolean;
  docExists: boolean;
  repoPath?: string | null;
  compact?: boolean;
  showSourcePath?: boolean;
};

const btnBase =
  "inline-flex items-center justify-center rounded-lg border text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]";
const btnPrimary =
  "border-accent/40 bg-accent px-3 py-1.5 text-accent-foreground hover:bg-accent/90";
const btnSecondary =
  "border-border bg-card px-3 py-1.5 text-foreground hover:bg-muted/80";
const btnDisabled =
  "cursor-not-allowed border-border bg-muted/50 px-3 py-1.5 text-muted-foreground opacity-70";

function LiveDocLink({
  href,
  compact,
}: {
  href: string;
  compact?: boolean;
}) {
  const className = `${btnBase} ${btnSecondary} ${compact ? "px-2 py-1" : ""}`;
  if (isExternalDocHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        View live doc
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      View live doc
    </Link>
  );
}

export function FeedbackDocActionsView({
  liveHref,
  editUrl,
  canEditDocs,
  docExists,
  repoPath,
  compact = false,
  showSourcePath = false,
}: FeedbackDocActionsViewProps) {
  const editEnabled = canEditDocs && Boolean(editUrl);

  if (!liveHref && !editUrl && !docExists) {
    return (
      <span className="text-xs text-muted-foreground">
        No linked doc page
      </span>
    );
  }

  return (
    <div
      className={
        compact
          ? "flex flex-wrap items-center gap-1.5"
          : "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
      }
    >
      {docExists && liveHref ? (
        <LiveDocLink href={liveHref} compact={compact} />
      ) : (
        <span
          className={`${btnBase} ${btnDisabled} ${compact ? "px-2 py-1" : ""}`}
          title="MDX source file not found in this repo"
        >
          View live doc
        </span>
      )}

      {editUrl ? (
        editEnabled ? (
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} ${btnPrimary} ${compact ? "px-2 py-1" : ""}`}
          >
            Edit on GitHub
          </a>
        ) : (
          <span
            className={`${btnBase} ${btnDisabled} ${compact ? "px-2 py-1" : ""}`}
            title="Documentation team (admin) only"
          >
            Edit on GitHub
          </span>
        )
      ) : (
        <span
          className={`${btnBase} ${btnDisabled} ${compact ? "px-2 py-1" : ""}`}
          title={
            canEditDocs
              ? "Set NEXT_PUBLIC_GITHUB_DOCS_REPO to enable GitHub edit links"
              : "Documentation team (admin) only"
          }
        >
          Edit on GitHub
        </span>
      )}

      {showSourcePath && canEditDocs && repoPath ? (
        <code className="text-[10px] text-muted-foreground">{repoPath}</code>
      ) : null}
    </div>
  );
}
