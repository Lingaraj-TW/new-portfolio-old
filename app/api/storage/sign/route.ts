import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PATH_RE = /^[0-9a-f-]{36}\/[\w.\-+() ]+$/i;

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
  if (role !== "admin" && role !== "customer") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase.storage
    .from("feedback-uploads")
    .createSignedUrl(path, 60 * 30);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message || "Could not sign URL." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
