import Link from "next/link";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/AdminLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProFeedLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const misconfigured = sp.misconfigured === "1";
  const notAdmin = sp.error === "not_admin";

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold tracking-tight">ProFeed sign in</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Use a Supabase Auth user whose JWT includes{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-900">
          app_metadata.role = admin
        </code>
        .
      </p>

      {misconfigured || !isSupabaseConfigured() ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-medium">Supabase is not configured</p>
          <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-100/80">
            Copy{" "}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">
              .env.example
            </code>{" "}
            to{" "}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">
              .env.local
            </code>{" "}
            and set real <span className="font-mono">NEXT_PUBLIC_SUPABASE_*</span>{" "}
            values, then restart <span className="font-mono">npm run dev</span>.
          </p>
        </div>
      ) : null}

      {notAdmin ? (
        <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">
          That account is not an admin. Update{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-900">
            raw_app_meta_data
          </code>{" "}
          in Supabase, sign out, and try again.
        </p>
      ) : null}

      {isSupabaseConfigured() ? (
        <Suspense fallback={<p className="mt-6 text-sm text-zinc-500">Loading…</p>}>
          <AdminLoginForm />
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

