import Link from "next/link";

import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Getting started</h1>
        <p className="mt-2 text-slate-600">
          Ship your first API call in under 10 minutes.
        </p>
      </header>

      <ProApiGlassCard className="p-6">
        <ol className="list-decimal space-y-4 pl-5 text-sm text-slate-700">
          <li>
            <strong>Create an API key</strong> in your workspace settings (sandbox keys available
            instantly).
          </li>
          <li>
            <strong>Authenticate requests</strong> with{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              Authorization: Bearer YOUR_KEY
            </code>
            . See{" "}
            <Link href="/proapi/authentication" className="text-[#7C3AED] hover:underline">
              Authentication
            </Link>
            .
          </li>
          <li>
            <strong>Submit feedback</strong> via{" "}
            <code className="font-mono text-xs">POST /v1/feedback</code> — explore in{" "}
            <Link href="/proapi/api-reference" className="text-[#7C3AED] hover:underline">
              API Reference
            </Link>
            .
          </li>
          <li>
            <strong>Install an SDK</strong> from the{" "}
            <Link href="/proapi/sdks" className="text-[#7C3AED] hover:underline">
              SDK Center
            </Link>{" "}
            for typed client libraries.
          </li>
        </ol>
      </ProApiGlassCard>

      <ProApiGlassCard className="p-6">
        <h2 className="font-semibold text-slate-900">Base URLs</h2>
        <ul className="mt-3 space-y-2 font-mono text-xs text-slate-600">
          <li>Production — https://api.prodoc.dev</li>
          <li>Sandbox — https://sandbox.api.prodoc.dev</li>
        </ul>
      </ProApiGlassCard>
    </div>
  );
}
