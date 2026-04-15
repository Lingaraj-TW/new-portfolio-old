import { NextResponse } from "next/server";

import { highlightsJsonSizeOk, parseHighlights } from "@/lib/feedback/highlights";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleClient } from "@/lib/supabase/service";

type Ctx = { params: Promise<{ id: string }> };

async function assertEditSecret(feedbackId: string, secret: string | null) {
  if (!secret) return "Missing edit secret.";
  const service = createServiceRoleClient();
  if (!service) return "Editing requires SUPABASE_SERVICE_ROLE_KEY on the server.";

  const { data, error } = await service
    .from("feedback")
    .select("id")
    .eq("id", feedbackId)
    .eq("edit_secret", secret)
    .maybeSingle();

  if (error) return error.message;
  if (!data) return "Not found or invalid edit secret.";
  return null;
}

export async function PATCH(request: Request, context: Ctx) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const secret = request.headers.get("x-edit-secret");
  const gate = await assertEditSecret(id, secret);
  if (gate) return NextResponse.json({ ok: false, error: gate }, { status: 403 });

  let json: Record<string, unknown>;
  try {
    json = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const body =
    typeof json.body === "string" ? json.body.trim().slice(0, 4000) : undefined;
  const section_anchor =
    typeof json.section_anchor === "string"
      ? json.section_anchor.trim().slice(0, 200) || null
      : undefined;
  const tagged_author =
    typeof json.tagged_author === "string"
      ? json.tagged_author.trim().slice(0, 120) || null
      : undefined;
  const tagged_team =
    typeof json.tagged_team === "string"
      ? json.tagged_team.trim().slice(0, 120) || null
      : undefined;

  const rating =
    json.rating === null
      ? null
      : json.rating === 1 || json.rating === -1 || json.rating === 0
        ? json.rating
        : undefined;

  const star_rating = (() => {
    if (json.star_rating === null) return null;
    if (json.star_rating === undefined) return undefined;
    const n = Number(json.star_rating);
    return n >= 1 && n <= 5 ? n : undefined;
  })();

  const highlights =
    json.highlights === undefined ? undefined : parseHighlights(json.highlights);
  if (highlights && !highlightsJsonSizeOk(highlights)) {
    return NextResponse.json({ ok: false, error: "Highlights too large." }, {
      status: 400,
    });
  }

  const patch: Record<string, unknown> = {};
  if (body !== undefined) patch.body = body;
  if (section_anchor !== undefined) patch.section_anchor = section_anchor;
  if (tagged_author !== undefined) patch.tagged_author = tagged_author;
  if (tagged_team !== undefined) patch.tagged_team = tagged_team;
  if (rating !== undefined) patch.rating = rating;
  if (star_rating !== undefined) patch.star_rating = star_rating;
  if (highlights !== undefined) patch.highlights = highlights;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: "No changes." }, { status: 400 });
  }

  const service = createServiceRoleClient()!;
  const { error } = await service.from("feedback").update(patch).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, context: Ctx) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const secret = request.headers.get("x-edit-secret");
  const gate = await assertEditSecret(id, secret);
  if (gate) return NextResponse.json({ ok: false, error: gate }, { status: 403 });

  const service = createServiceRoleClient()!;
  const { error } = await service.from("feedback").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
