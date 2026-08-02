"use server";

import { revalidatePath } from "next/cache";

import { isAdminSession } from "@/lib/admin/session-server";
import type { FeedbackStatus } from "@/lib/types/feedback";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

async function isAuthorizedAdmin(): Promise<boolean> {
  if (await isAdminSession()) return true;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.app_metadata?.role === "admin";
}

function isStatus(value: string): value is FeedbackStatus {
  return value === "open" || value === "triaged" || value === "closed";
}

export async function updateFeedbackStatus(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const statusRaw = String(formData.get("status") || "").trim();

  if (!id || !isStatus(statusRaw)) {
    return { ok: false as const, error: "Invalid payload." };
  }

  if (!(await isAuthorizedAdmin())) {
    return { ok: false as const, error: "Unauthorized." };
  }

  const service = createServiceRoleClient();
  const client = service ?? (await createSupabaseServerClient());

  const { error } = await client
    .from("feedback")
    .update({ status: statusRaw })
    .eq("id", id);

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

  revalidatePath("/profeed/inbox");
  revalidatePath("/proinsights");
  return {
    ok: true as const,
    status: (check?.status as FeedbackStatus | null) ?? statusRaw,
  };
}
