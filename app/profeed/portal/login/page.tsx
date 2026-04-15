import Link from "next/link";
import { Suspense } from "react";

import { PortalLoginForm } from "@/components/PortalLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProFeedPortalLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const misconfigured = sp.misconfigured === "1";
  const notCustomer = sp.error === "not_customer";

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold tracking-tight">ProFeed portal sign in</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        This portal lists documentation feedback for your organization (MVP: all records).
        Grant access with{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-900">
          app_metadata.role = customer
        </code>{" "}
        in Supabase Auth.
      </p>

      {misconfigured || !isSupabaseConfigured() ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured</p>
          <p className="mt-2 text-xs leading-relaxed text-amber-800/95 dark:text-amber-100/85">
            Create a file named <span className="font-mono">.env.local</span> in the
            project root (same folder as <span className="font-mono">package.json</span>)
            with your real project values—not the placeholders from{" "}
            <span className="font-mono">.env.example</span>.
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-xs text-amber-800/95 dark:text-amber-100/85">
            <li>
              In Supabase:{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                Dashboard
              </a>{" "}
              → your project →{" "}
              <span className="font-medium">Project Settings → API</span>.
            </li>
            <li>
              Copy <span className="font-medium">Project URL</span> into{" "}
              <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-900/50">
                NEXT_PUBLIC_SUPABASE_URL
              </code>
            </li>
            <li>
              Copy the <span className="font-medium">anon public</span> key into{" "}
              <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-900/50">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>
            </li>
            <li>
              Save the file, then stop and run{" "}
              <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-900/50">
                npm run dev
              </code>{" "}
              again.
            </li>
          </ol>
        </div>
      ) : null}

      {notCustomer ? (
        <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">
          That account is not a customer viewer. Ask your administrator to set the customer
          role on your user, then try again.
        </p>
      ) : null}

      {isSupabaseConfigured() ? (
        <Suspense fallback={<p className="mt-6 text-sm text-zinc-500">Loading…</p>}>
          <PortalLoginForm />
        </Suspense>
      ) : null}

      <p className="mt-6 text-center text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
          ← Portfolio home
        </Link>
      </p>
    </div>
  );
}

