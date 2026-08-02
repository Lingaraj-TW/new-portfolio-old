import Link from "next/link";

import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { guides } from "@/lib/proapi/mock-data";

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Guides</h1>
        <p className="mt-2 text-slate-600">Integration patterns and best practices.</p>
      </header>

      <div className="grid gap-4">
        {guides.map((g) => (
          <Link key={g.id} href={g.href}>
            <ProApiGlassCard className="p-5 transition hover:border-[#7C3AED]/30">
              <h2 className="font-semibold text-slate-900">{g.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{g.description}</p>
            </ProApiGlassCard>
          </Link>
        ))}
      </div>

      <ProApiGlassCard id="webhooks" className="scroll-mt-24 p-6">
        <h2 className="font-semibold text-slate-900">Webhooks</h2>
        <p className="mt-2 text-sm text-slate-600">
          Subscribe to feedback.created and feedback.status_changed events. Verify signatures with
          HMAC-SHA256 and your webhook secret.
        </p>
      </ProApiGlassCard>

      <ProApiGlassCard id="errors" className="scroll-mt-24 p-6">
        <h2 className="font-semibold text-slate-900">Error handling</h2>
        <p className="mt-2 text-sm text-slate-600">
          All errors return JSON with code, message, and request_id. Retry 429 and 5xx with
          exponential backoff.
        </p>
      </ProApiGlassCard>
    </div>
  );
}
