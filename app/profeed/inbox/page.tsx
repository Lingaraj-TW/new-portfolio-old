import { FeedbackInboxTable } from "@/components/profeed/inbox/FeedbackInboxTable";
import { mapFeedbackToInboxRow } from "@/lib/feedback/inbox-map";
import { listFeedbackForInbox } from "@/lib/feedback/queries";
import { isAdminSession } from "@/lib/admin/session-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function ProFeedInboxPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8 text-slate-400">
        <p className="max-w-md text-center text-sm">
          Supabase is not configured. Add keys to{" "}
          <code className="font-mono text-purple-300">.env.local</code> and
          restart the dev server.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const cookieAdmin = await isAdminSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role as string | undefined;
  const canTriage = cookieAdmin || role === "admin";
  const hasServiceForPublicFileLinks = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const canOpenFileLinks = Boolean(
    cookieAdmin ||
      (user && (role === "admin" || role === "customer")) ||
      (!user && hasServiceForPublicFileLinks),
  );

  const { rows: raw, error: loadError } = await listFeedbackForInbox(
    supabase,
    200,
  );

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8">
        <div className="max-w-lg rounded-xl border border-rose-500/30 bg-rose-950/30 p-6 text-sm text-rose-200">
          <p className="font-medium">Could not load feedback</p>
          <p className="mt-1 text-xs opacity-90">{loadError}</p>
        </div>
      </div>
    );
  }

  const rows = raw.map(mapFeedbackToInboxRow);

  return (
    <FeedbackInboxTable
      rows={rows}
      canTriage={canTriage}
      canOpenFileLinks={canOpenFileLinks}
      isAdmin={cookieAdmin}
    />
  );
}
