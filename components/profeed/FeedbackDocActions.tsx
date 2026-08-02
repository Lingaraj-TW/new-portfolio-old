import { githubEditUrl } from "@/lib/docs/githubEditUrl";
import { resolveDocSourceFromPagePath } from "@/lib/docs/pagePathToDoc";

import {
  FeedbackDocActionsView,
  type FeedbackDocActionsViewProps,
} from "./FeedbackDocActionsView";

type FeedbackDocActionsProps = {
  pagePath: string;
  sectionAnchor?: string | null;
  canEditDocs: boolean;
  compact?: boolean;
  showSourcePath?: boolean;
};

export function buildFeedbackDocActionsProps(
  pagePath: string,
  sectionAnchor: string | null | undefined,
  canEditDocs: boolean,
): FeedbackDocActionsViewProps {
  const source = resolveDocSourceFromPagePath(pagePath, sectionAnchor);
  const editUrl =
    source?.exists && source.repoPath ? githubEditUrl(source.repoPath) : null;

  return {
    liveHref: source?.liveHref ?? null,
    editUrl,
    canEditDocs,
    docExists: Boolean(source?.exists),
    repoPath: source?.repoPath ?? null,
  };
}

export function FeedbackDocActions({
  pagePath,
  sectionAnchor,
  canEditDocs,
  compact = false,
  showSourcePath = false,
}: FeedbackDocActionsProps) {
  const props = buildFeedbackDocActionsProps(
    pagePath,
    sectionAnchor,
    canEditDocs,
  );

  return (
    <FeedbackDocActionsView
      {...props}
      compact={compact}
      showSourcePath={showSourcePath}
    />
  );
}
