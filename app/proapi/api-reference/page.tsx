import { Suspense } from "react";

import { ApiReferenceExperience } from "@/components/proapi/ApiReferenceExperience";

export default function ApiReferencePage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">API Reference</h1>
        <p className="mt-1 text-sm text-slate-600">
          Interactive explorer with OpenAPI import, code samples, and try-it console.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-slate-500">Loading API reference…</p>}>
        <ApiReferenceExperience />
      </Suspense>
    </div>
  );
}
