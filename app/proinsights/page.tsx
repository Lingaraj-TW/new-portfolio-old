import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

import { ProInsightsCharts } from "@/components/proinsights/ProInsightsCharts";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  page_path: string;
  section_anchor: string | null;
  rating: number | null;
  star_rating: number | null;
  tagged_author: string | null;
  tagged_team: string | null;
  highlights: unknown;
  status: string;
  created_at: string;
  feedback_attachments?: { id: string }[];
};

function clampNonEmpty(s: string | null | undefined, fallback: string) {
  const v = (s || "").trim();
  return v ? v : fallback;
}

function toDayKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function countHighlights(h: unknown) {
  return Array.isArray(h) ? h.length : 0;
}

function fmtPct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function topN(map: Map<string, number>, n: number) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function toChartKV(entries: [string, number][]) {
  return entries.map(([name, value]) => ({ name, value }));
}

export default async function ProInsightsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-muted-foreground">
        Supabase is not configured. Add keys to{" "}
        <code className="font-mono">.env.local</code> and restart the dev
        server.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("feedback")
    .select(
      `id, page_path, section_anchor, rating, star_rating, tagged_author, tagged_team, highlights, status, created_at,
 feedback_attachments ( id )`,
    )
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100">
        <p className="font-medium">Could not load analytics</p>
        <p className="mt-1 text-xs opacity-90">{error.message}</p>
        <p className="mt-3 text-xs">
          Ensure your account is authenticated and has the right Supabase role.
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as Row[];

  if (rows.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ProInsights</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No feedback data yet. Submit feedback from ProDoc and check back here.
        </p>
      </div>
    );
  }

  const total = rows.length;
  const byStatus = new Map<string, number>();
  const byPage = new Map<string, number>();
  const byTeam = new Map<string, number>();
  const byAuthor = new Map<string, number>();
  const byDay = new Map<string, number>();

  let helpful = 0;
  let notHelpful = 0;
  let starsCount = 0;
  let starsSum = 0;
  const starsDist = new Map<number, number>([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ]);

  let attachments = 0;
  const highlightsByPage = new Map<string, number>();

  for (const r of rows) {
    byStatus.set(r.status, (byStatus.get(r.status) || 0) + 1);

    byPage.set(r.page_path, (byPage.get(r.page_path) || 0) + 1);

    const team = clampNonEmpty(r.tagged_team, "Unspecified");
    byTeam.set(team, (byTeam.get(team) || 0) + 1);

    const author = clampNonEmpty(r.tagged_author, "Unspecified");
    byAuthor.set(author, (byAuthor.get(author) || 0) + 1);

    byDay.set(
      toDayKey(r.created_at),
      (byDay.get(toDayKey(r.created_at)) || 0) + 1,
    );

    if (r.rating === 1) helpful += 1;
    if (r.rating === -1) notHelpful += 1;

    if (
      typeof r.star_rating === "number" &&
      r.star_rating >= 1 &&
      r.star_rating <= 5
    ) {
      starsCount += 1;
      starsSum += r.star_rating;
      starsDist.set(r.star_rating, (starsDist.get(r.star_rating) || 0) + 1);
    }

    attachments += r.feedback_attachments?.length || 0;

    const hl = countHighlights(r.highlights);
    if (hl > 0) {
      highlightsByPage.set(
        r.page_path,
        (highlightsByPage.get(r.page_path) || 0) + hl,
      );
    }
  }

  const avgStars = starsCount ? starsSum / starsCount : null;
  const helpfulTotal = helpful + notHelpful;
  const helpfulPct = helpfulTotal ? helpful / helpfulTotal : null;

  const statusCards = [
    { label: "Open", value: byStatus.get("open") || 0 },
    { label: "Triaged", value: byStatus.get("triaged") || 0 },
    { label: "Closed", value: byStatus.get("closed") || 0 },
  ];

  const topPages = topN(byPage, 8);
  const topTeams = topN(byTeam, 6);
  const topAuthors = topN(byAuthor, 6);
  const topHighlights = topN(highlightsByPage, 6);
  const daily = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14);
  const statusChart = [
    { name: "open", value: byStatus.get("open") || 0 },
    { name: "triaged", value: byStatus.get("triaged") || 0 },
    { name: "closed", value: byStatus.get("closed") || 0 },
  ].filter((s) => s.value > 0);
  const dailyChart = daily.map(([day, count]) => ({ day, count }));
  const starsChart = [1, 2, 3, 4, 5].map((stars) => ({
    stars,
    count: starsDist.get(stars) || 0,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">ProInsights</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Analytics overview for documentation feedback captured in ProFeed. (MVP
        aggregates the newest {total} items.)
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total feedback
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{total}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Last 1000 (or fewer)
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Average stars
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {avgStars === null ? "—" : avgStars.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {starsCount ? `${starsCount} rated` : "No star ratings yet"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Helpfulness
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {helpfulPct === null ? "—" : fmtPct(helpfulPct)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {helpfulTotal
              ? `${helpful} helpful · ${notHelpful} not helpful`
              : "No helpful votes yet"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Attachments
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {attachments}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Files uploaded with feedback
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {statusCards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-card p-5 "
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <ProInsightsCharts
        status={
          statusChart.length ? statusChart : [{ name: "other", value: total }]
        }
        daily={dailyChart}
        topPages={toChartKV(topPages)}
        topTeams={toChartKV(topTeams)}
        topAuthors={toChartKV(topAuthors)}
        stars={starsChart}
      />
    </div>
  );
}
