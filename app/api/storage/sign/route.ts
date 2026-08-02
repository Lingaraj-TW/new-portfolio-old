import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PATH_RE = /^[0-9a-f-]{36}\/[\w.\-+() ]+$/i;
const SIGNED_TTL_SEC = 60 * 30;

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "";
  if (!PATH_RE.test(path)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.app_metadata?.role;
  const isAuthReader = role === "admin" || role === "customer";

  if (isAuthReader) {
    const { data, error } = await supabase.storage
      .from("feedback-uploads")
      .createSignedUrl(path, SIGNED_TTL_SEC);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || "Could not sign URL." },
        { status: 500 },
      );
    }
    return NextResponse.json({ url: data.signedUrl });
  }

  // Public / demo: sign only for paths that exist on a feedback row (avoids open bucket access).
  const service = createServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error:
          "Public download links need SUPABASE_SERVICE_ROLE_KEY on the server.",
      },
      { status: 503 },
    );
  }

  const { data: att, error: attErr } = await service
    .from("feedback_attachments")
    .select("id")
    .eq("storage_path", path)
    .maybeSingle();

  if (attErr) {
    return NextResponse.json(
      { error: attErr.message || "Could not verify attachment." },
      { status: 500 },
    );
  }
  if (!att) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { data, error } = await service.storage
    .from("feedback-uploads")
    .createSignedUrl(path, SIGNED_TTL_SEC);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message || "Could not sign URL." },
      { status: 500 },
    );
  }
  return NextResponse.json({ url: data.signedUrl });
}
