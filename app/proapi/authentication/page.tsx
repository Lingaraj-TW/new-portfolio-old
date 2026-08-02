import { AuthCodeSample } from "@/app/proapi/authentication/AuthCodeSample";
import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { allEndpoints } from "@/lib/proapi/mock-data";

const oauthEndpoint = allEndpoints.find((e) => e.id === "oauth-token")!;

export default function AuthenticationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Authentication</h1>
        <p className="mt-2 text-slate-600">
          API Key · Bearer Token · OAuth 2.0 · JWT
        </p>
      </header>

      {[
        {
          title: "API Key",
          body: "Include your workspace API key in the Authorization header as a Bearer token.",
          example: 'Authorization: Bearer pk_live_abc123',
        },
        {
          title: "Bearer Token",
          body: "Short-lived access tokens from OAuth or JWT exchange. Preferred for server-side integrations.",
          example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...',
        },
        {
          title: "OAuth 2.0",
          body: "Authorization code flow for user-delegated access. Exchange codes at POST /oauth/token.",
        },
        {
          title: "JWT",
          body: "Service accounts can use signed JWTs with scoped claims for machine-to-machine access.",
        },
      ].map((section) => (
        <ProApiGlassCard key={section.title} className="p-6">
          <h2 className="font-semibold text-slate-900">{section.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{section.body}</p>
          {section.example ? (
            <pre className="mt-3 rounded-lg bg-slate-950/5 p-3 font-mono text-xs text-slate-700">
              {section.example}
            </pre>
          ) : null}
        </ProApiGlassCard>
      ))}

      <ProApiGlassCard className="p-6">
        <h2 className="font-semibold text-slate-900">OAuth authorization flow</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950/5 p-4 font-mono text-[11px] text-slate-700">{`User → Authorize (/oauth/authorize)
     → Redirect with code
     → POST /oauth/token
     → Access + refresh tokens`}</pre>
        <div className="mt-4">
          <AuthCodeSample endpoint={oauthEndpoint} />
        </div>
      </ProApiGlassCard>
    </div>
  );
}
