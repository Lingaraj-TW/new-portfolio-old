import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleClient } from "@/lib/supabase/service";

type Ctx = { params: Promise<{ attachmentId: string }> };

export async function DELETE(request: Request, context: Ctx) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  }

  const service = createServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: "Deleting attachments requires the service role key." },
      { status: 400 },
    );
  }

  const { attachmentId } = await context.params;
  const secret = request.headers.get("x-edit-secret");
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Missing edit secret." }, {
      status: 403,
    });
  }

  const { data: att, error: aErr } = await service
    .from("feedback_attachments")
    .select("id, feedback_id, storage_path")
    .eq("id", attachmentId)
    .maybeSingle();

  if (aErr || !att) {
    return NextResponse.json({ ok: false, error: "Attachment not found." }, {
      status: 404,
    });
  }

  const { data: fb, error: fErr } = await service
    .from("feedback")
    .select("id")
    .eq("id", att.feedback_id)
    .eq("edit_secret", secret)
    .maybeSingle();

  if (fErr || !fb) {
    return NextResponse.json({ ok: false, error: "Invalid edit secret." }, {
      status: 403,
    });
  }

  const { error: rmErr } = await service.storage
    .from("feedback-uploads")
    .remove([att.storage_path]);

  if (rmErr) {
    return NextResponse.json({ ok: false, error: rmErr.message }, { status: 500 });
  }

  const { error: dErr } = await service
    .from("feedback_attachments")
    .delete()
    .eq("id", attachmentId);

  if (dErr) {
    return NextResponse.json({ ok: false, error: dErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
