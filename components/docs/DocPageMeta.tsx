type Props = {
  authors?: string[];
  tags?: string[];
  readingMinutes?: number;
  lastUpdated?: string;
  category?: string;
  versionLabel?: string;
  versionReleased?: string;
};

export function DocPageMeta({
  authors,
  tags,
  readingMinutes,
  lastUpdated,
  category,
  versionLabel,
  versionReleased,
}: Props) {
  const parts: string[] = [];
  if (readingMinutes) parts.push(`${readingMinutes} min read`);
  if (lastUpdated) parts.push(`Updated ${lastUpdated}`);
  if (authors?.length) parts.push(authors.join(", "));

  if (
    !parts.length &&
    !tags?.length &&
    !category &&
    !versionLabel
  )
    return null;

  return (
    <div className="not-prose mb-6 flex flex-wrap items-center gap-2 border-b border-[var(--docs-border)] pb-4">
      {versionLabel ? (
        <span className="pds-version-badge">
          v{versionLabel}
          {versionReleased ? ` · ${versionReleased}` : ""}
        </span>
      ) : null}
      {parts.length > 0 ? (
        <p className="text-xs text-[var(--docs-muted-fg)]">{parts.join(" · ")}</p>
      ) : null}
      {category ? (
        <span className="doc-meta-tag rounded-full px-2 py-0.5 text-xs font-medium">
          {category}
        </span>
      ) : null}
      {tags?.map((tag) => (
        <span
          key={tag}
          className="doc-meta-tag rounded-full px-2 py-0.5 text-xs font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
