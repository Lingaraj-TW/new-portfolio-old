import { PlaygroundExperience } from "@/components/proapi/PlaygroundExperience";

export default function PlaygroundPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Playground</h1>
        <p className="mt-1 text-sm text-slate-600">
          Postman-lite — request builder, collections, history, and environment variables.
        </p>
      </header>
      <PlaygroundExperience />
    </div>
  );
}
