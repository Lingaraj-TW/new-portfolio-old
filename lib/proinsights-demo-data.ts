/** Static chart payloads for ProInsights marketing / screenshot pages — not wired to Supabase. */
export const PROINSIGHTS_MOCK_STATUS = [
  { name: "open", value: 14 },
  { name: "triaged", value: 9 },
  { name: "closed", value: 28 },
] as const;

export const PROINSIGHTS_MOCK_DAILY = (() => {
  const out: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    out.push({
      day: d.toISOString().slice(0, 10),
      count: 4 + ((13 - i) % 5) + Math.floor((13 - i) / 3),
    });
  }
  return out;
})();

export const PROINSIGHTS_MOCK_TOP_PAGES = [
  { name: "/prodoc/apis/reference", value: 24 },
  { name: "/prodoc/changelog", value: 18 },
  { name: "/prodoc/platform-overview/ecosystem-overview", value: 15 },
  { name: "/prodoc/concepts/diataxis", value: 11 },
  { name: "/prodoc/apis/feedback", value: 9 },
];

export const PROINSIGHTS_MOCK_TOP_TEAMS = [
  { name: "Engineering", value: 22 },
  { name: "Docs", value: 19 },
  { name: "Support", value: 8 },
  { name: "Product", value: 6 },
];

export const PROINSIGHTS_MOCK_TOP_AUTHORS = [
  { name: "A. Smith", value: 12 },
  { name: "J. Park", value: 10 },
  { name: "M. Kumar", value: 7 },
];

export const PROINSIGHTS_MOCK_STARS = [
  { stars: 1, count: 1 },
  { stars: 2, count: 2 },
  { stars: 3, count: 5 },
  { stars: 4, count: 12 },
  { stars: 5, count: 18 },
] as const;
