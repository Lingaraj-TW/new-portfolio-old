import { allEndpoints, changelog, guides, sdks } from "./mock-data";
import type { ApiEndpoint, SearchResult } from "./types";

function matches(query: string, text: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function searchPortal(query: string, endpoints: ApiEndpoint[] = allEndpoints): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const ep of endpoints) {
    if (
      matches(q, ep.summary) ||
      matches(q, ep.path) ||
      matches(q, ep.description) ||
      matches(q, ep.category)
    ) {
      results.push({
        id: `ep-${ep.id}`,
        type: "endpoint",
        title: `${ep.method} ${ep.path}`,
        subtitle: ep.summary,
        href: `/proapi/api-reference?op=${ep.id}`,
        highlight: ep.summary,
      });
    }

    for (const err of ep.errors) {
      if (matches(q, err.code) || matches(q, err.description)) {
        results.push({
          id: `err-${ep.id}-${err.code}`,
          type: "error",
          title: err.code,
          subtitle: `${err.status} — ${err.description}`,
          href: `/proapi/api-reference?op=${ep.id}#errors`,
        });
      }
    }

    for (const field of ep.requestBody?.schema ?? []) {
      if (matches(q, field.name) || matches(q, field.description)) {
        results.push({
          id: `schema-${ep.id}-${field.name}`,
          type: "schema",
          title: field.name,
          subtitle: `${field.type} — ${ep.summary}`,
          href: `/proapi/api-reference?op=${ep.id}#schema`,
        });
      }
    }
  }

  for (const guide of guides) {
    if (matches(q, guide.title) || matches(q, guide.description)) {
      results.push({
        id: `guide-${guide.id}`,
        type: "guide",
        title: guide.title,
        subtitle: guide.description,
        href: guide.href,
      });
    }
  }

  for (const sdk of sdks) {
    if (matches(q, sdk.name) || matches(q, sdk.language)) {
      results.push({
        id: `sdk-${sdk.language}`,
        type: "sdk",
        title: sdk.name,
        subtitle: sdk.install,
        href: `/proapi/sdks#${sdk.language}`,
      });
    }
  }

  for (const entry of changelog) {
    if (matches(q, entry.version) || entry.changes.some((c) => matches(q, c))) {
      results.push({
        id: `changelog-${entry.version}`,
        type: "guide",
        title: `Changelog ${entry.version}`,
        subtitle: entry.date,
        href: "/proapi/changelog",
      });
    }
  }

  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  }).slice(0, 12);
}
