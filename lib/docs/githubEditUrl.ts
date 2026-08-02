/** GitHub repo for docs-as-code edits (owner/repo, lowercase). */
export function getGithubDocsRepo(): string | null {
  const v = process.env.NEXT_PUBLIC_GITHUB_DOCS_REPO?.trim();
  return v || null;
}

export function getGithubDocsBranch(): string {
  return process.env.NEXT_PUBLIC_GITHUB_DOCS_BRANCH?.trim() || "main";
}

/** e.g. https://github.com/lingaraj-tw/prodoc/edit/main/content/docs/foo.mdx */
export function githubEditUrl(repoRelativePath: string): string | null {
  const repo = getGithubDocsRepo();
  if (!repo || !repoRelativePath.trim()) return null;

  const branch = getGithubDocsBranch();
  const filePath = repoRelativePath.replace(/^\/+/, "");
  return `https://github.com/${repo}/edit/${branch}/${filePath}`;
}
