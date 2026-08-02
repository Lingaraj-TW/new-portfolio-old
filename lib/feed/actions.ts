"use server";

import { revalidatePath } from "next/cache";

import { isAdminSession } from "@/lib/admin/session-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import type { FeedPost } from "@/lib/types/feed";

async function requireAdmin() {
  if (await isAdminSession()) return;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("Admin access required.");
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listAllPostsAdmin(): Promise<FeedPost[]> {
  await requireAdmin();
  const service = createServiceRoleClient();
  if (!service) return [];

  const { data, error } = await service
    .from("posts")
    .select(
      `id, title, slug, excerpt, body, category_id, published, created_at, updated_at,
       categories ( id, name, slug )`,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as FeedPost[]).map((row) => ({
    ...row,
    categories: Array.isArray(row.categories)
      ? (row.categories[0] ?? null)
      : row.categories,
  }));
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role not configured.");

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title || !body) throw new Error("Title and body are required.");

  const slug = slugify(slugRaw || title);
  const { error } = await service.from("posts").insert({
    title,
    slug,
    excerpt,
    body,
    published,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/feed");
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function updatePost(formData: FormData) {
  await requireAdmin();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role not configured.");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!id || !title || !body) throw new Error("Missing required fields.");

  const slug = slugify(slugRaw || title);
  const { error } = await service
    .from("posts")
    .update({
      title,
      slug,
      excerpt,
      body,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/feed");
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/feed/${slug}`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role not configured.");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Post id required.");

  const { error } = await service.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/feed");
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function togglePostPublished(formData: FormData) {
  await requireAdmin();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role not configured.");

  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (!id) throw new Error("Post id required.");

  const { error } = await service
    .from("posts")
    .update({ published: !published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/feed");
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}
