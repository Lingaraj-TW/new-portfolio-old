import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { changelog } from "@/lib/proapi/mock-data";

export function ChangelogTimeline() {
  return (
    <ol className="relative space-y-6 border-l-2 border-[#7C3AED]/20 pl-6">
      {changelog.map((entry) => (
        <li key={entry.version} className="relative">
          <span
            className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-[#7C3AED] bg-[#FAFAFC]"
            aria-hidden
          />
          <ProApiGlassCard className="p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="font-mono text-lg font-bold text-[#7C3AED]">{entry.version}</h2>
              <time className="text-xs text-slate-500">{entry.date}</time>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {entry.changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {entry.breaking.length > 0 ? (
              <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
                <p className="text-xs font-semibold uppercase text-amber-700">Breaking changes</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-800/90">
                  {entry.breaking.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {entry.migration ? (
              <p className="mt-3 text-sm text-slate-600">
                <strong>Migration:</strong> {entry.migration}
              </p>
            ) : null}
          </ProApiGlassCard>
        </li>
      ))}
    </ol>
  );
}
