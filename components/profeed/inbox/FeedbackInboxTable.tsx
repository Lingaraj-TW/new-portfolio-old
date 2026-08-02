"use client";

import { useMemo, useState } from "react";

import { InboxTableRow } from "./InboxTableRow";
import { ProFeedInboxFilters } from "./ProFeedInboxFilters";
import { ProFeedInboxHeader } from "./ProFeedInboxHeader";
import type { InboxRow } from "./inbox-types";

type FilterState = {
  pagePath: string;
  team: string;
  writer: string;
  stars: string;
  status: string;
};

const EMPTY_FILTERS: FilterState = {
  pagePath: "",
  team: "",
  writer: "",
  stars: "Any",
  status: "Any",
};

function applyFilters(rows: InboxRow[], f: FilterState): InboxRow[] {
  return rows.filter((row) => {
    if (
      f.pagePath &&
      !row.page_path.toLowerCase().includes(f.pagePath.toLowerCase())
    ) {
      return false;
    }
    if (
      f.team &&
      !row.teams.some((t) => t.toLowerCase().includes(f.team.toLowerCase()))
    ) {
      return false;
    }
    if (
      f.writer &&
      !row.authors.some((w) =>
        w.toLowerCase().includes(f.writer.toLowerCase()),
      )
    ) {
      return false;
    }
    if (f.stars !== "Any" && String(row.star_rating ?? "") !== f.stars) {
      return false;
    }
    if (f.status !== "Any" && row.status !== f.status) {
      return false;
    }
    return true;
  });
}

export function FeedbackInboxTable({
  rows,
  canTriage,
  canOpenFileLinks,
  isAdmin,
}: {
  rows: InboxRow[];
  canTriage: boolean;
  canOpenFileLinks: boolean;
  isAdmin: boolean;
}) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<FilterState>(EMPTY_FILTERS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = useMemo(
    () => applyFilters(rows, applied),
    [rows, applied],
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <ProFeedInboxHeader isAdmin={isAdmin} />

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Doc feedback inbox</h1>
          <p className="mt-1 text-sm text-slate-400">
            {filtered.length} of {rows.length} shown (newest 200 loaded) ·
            Public read-only
            {canTriage ? " · Admin triage enabled" : ""}
          </p>
        </div>

        <ProFeedInboxFilters
          filters={filters}
          onChange={setFilters}
          onApply={() => setApplied(filters)}
          onClear={() => {
            setFilters(EMPTY_FILTERS);
            setApplied(EMPTY_FILTERS);
          }}
        />

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse table-fixed">
              <colgroup>
                <col className="w-44" />
                <col className="w-36" />
                <col className="w-40" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-36" />
                <col className="w-32" />
                <col className="w-12" />
                <col className="w-48" />
                <col className="w-16" />
                <col className="w-16" />
                <col className="w-28" />
              </colgroup>
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {[
                    "WHEN",
                    "PAGE",
                    "SECTION",
                    "HELPFUL",
                    "STARS",
                    "WRITERS",
                    "TEAMS",
                    "HL",
                    "MESSAGE",
                    "VOICE",
                    "FILES",
                    "STATUS",
                  ].map((label) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 ${label === "HL" || label === "VOICE" || label === "FILES" ? "text-center" : ""}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <InboxTableRow
                    key={row.id}
                    row={row}
                    expanded={expandedRow === row.id}
                    onToggle={() =>
                      setExpandedRow((id) => (id === row.id ? null : row.id))
                    }
                    canTriage={canTriage}
                    canOpenFileLinks={canOpenFileLinks}
                  />
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-16 text-center text-slate-600"
                    >
                      {rows.length === 0
                        ? "No feedback yet — submit from a ProDoc page."
                        : "No feedback matches your filters."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
