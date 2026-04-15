"use server";

import { revalidatePath } from "next/cache";

import type { FeedbackStatus } from "@/lib/types/feedback";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

function isStatus(value: string): value is FeedbackStatus {
  return value === "open" || value === "triaged" || value === "closed";
}

export async function updateFeedbackStatus(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const statusRaw = String(formData.get("status") || "").trim();

  if (!id || !isStatus(statusRaw)) {
    return { ok: false as const, error: "Invalid payload." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { ok: false as const, error: "Unauthorized." };
  }

  // Use service-role for writes after verifying admin. This avoids RLS footguns during local/dev
  // while keeping the UI permissioned by user role.
  const service = createServiceRoleClient();
  const client = service ?? supabase;

  const { error } = await client.from("feedback").update({ status: statusRaw }).eq("id", id);

  if (error) {
    console.error("[profeed] updateFeedbackStatus failed", {
      id,
      status: statusRaw,
      hasServiceRole: Boolean(service),
      code: (error as { code?: string } | null)?.code,
      message: error.message,
    });
    return { ok: false as const, error: error.message };
  }

  const { data: check, error: checkError } = await client
    .from("feedback")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (checkError) {
    console.error("[profeed] updateFeedbackStatus readback failed", {
      id,
      hasServiceRole: Boolean(service),
      message: checkError.message,
    });
    return { ok: false as const, error: checkError.message };
  }

  revalidatePath("/profeed");
  revalidatePath("/proinsights");
  return { ok: true as const, status: (check?.status as FeedbackStatus | null) ?? statusRaw };
}

