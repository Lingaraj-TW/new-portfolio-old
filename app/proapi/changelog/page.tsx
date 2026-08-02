import { ChangelogTimeline } from "@/components/proapi/ChangelogTimeline";

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Changelog</h1>
        <p className="mt-1 text-sm text-slate-600">API versions, breaking changes, and migrations.</p>
      </header>
      <ChangelogTimeline />
    </div>
  );
}
