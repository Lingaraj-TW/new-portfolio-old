/** Default options for "Tag writers" (multi-select). */
export const PROFEED_WRITER_OPTIONS = [
  "Linga Raj M",
  "Writer A",
  "Writer B",
] as const;

/** Default options for "Tag teams" (multi-select). */
export const PROFEED_TEAM_OPTIONS = [
  "Product Development",
  "Support",
  "Marketing",
  "Projects",
  "Implementation",
  "Content Experience Team",
] as const;

const WRITER_MAX = 32;
const TEAM_MAX = 32;

function norm(s: string) {
  return s.trim().slice(0, 120);
}

export function sanitizeStringArray(
  values: string[],
  allowed: ReadonlySet<string> | null,
  max: number,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = norm(typeof raw === "string" ? raw : "");
    if (!v) continue;
    if (allowed && !allowed.has(v)) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
    if (out.length >= max) break;
  }
  return out;
}

export function writerAllowedSet(): Set<string> {
  return new Set([...PROFEED_WRITER_OPTIONS]);
}

export function teamAllowedSet(): Set<string> {
  return new Set([...PROFEED_TEAM_OPTIONS]);
}

export { WRITER_MAX, TEAM_MAX };
