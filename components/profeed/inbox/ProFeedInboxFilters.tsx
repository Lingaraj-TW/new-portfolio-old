"use client";

import { ChevronDown, Filter, Search, X } from "lucide-react";

type FilterState = {
  pagePath: string;
  team: string;
  writer: string;
  stars: string;
  status: string;
};

const inputClass =
  "w-full rounded-lg border border-white/[0.08] bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition focus:border-purple-500 focus:outline-none";

export function ProFeedInboxFilters({
  filters,
  onChange,
  onApply,
  onClear,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[160px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            PAGE PATH
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={filters.pagePath}
              onChange={(e) =>
                onChange({ ...filters, pagePath: e.target.value })
              }
              placeholder="/docs/..."
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>

        <div className="min-w-[140px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            TEAM
          </label>
          <input
            value={filters.team}
            onChange={(e) => onChange({ ...filters, team: e.target.value })}
            placeholder="contains..."
            className={inputClass}
          />
        </div>

        <div className="min-w-[140px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            WRITER
          </label>
          <input
            value={filters.writer}
            onChange={(e) => onChange({ ...filters, writer: e.target.value })}
            placeholder="contains..."
            className={inputClass}
          />
        </div>

        <div className="min-w-[120px]">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            STARS
          </label>
          <div className="relative">
            <select
              value={filters.stars}
              onChange={(e) => onChange({ ...filters, stars: e.target.value })}
              className={`${inputClass} appearance-none pr-8`}
            >
              {["Any", "1", "2", "3", "4", "5"].map((v) => (
                <option key={v} value={v}>
                  {v === "Any" ? "Any" : `${v} ★`}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        <div className="min-w-[130px]">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            STATUS
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) =>
                onChange({ ...filters, status: e.target.value })
              }
              className={`${inputClass} appearance-none pr-8`}
            >
              {["Any", "open", "triaged", "closed"].map((v) => (
                <option key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onApply}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            <Filter size={14} />
            Apply
          </button>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-slate-800 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
