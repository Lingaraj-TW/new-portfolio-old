"use server";

import { revalidatePath } from "next/cache";

import type { FeedbackStatus } from "@/lib/types/feedback";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const { error } = await supabase
    .from("feedback")
    .update({ status: statusRaw })
    .eq("id", id);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/admin");
  return { ok: true as const };
}
