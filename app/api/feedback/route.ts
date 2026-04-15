import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { highlightsJsonSizeOk, parseHighlights } from "@/lib/feedback/highlights";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleClient } from "@/lib/supabase/service";

const BUCKET = "feedback-uploads";
const MAX_FILES = 8;
const MAX_FILE_BYTES = 4 * 1024 * 1024;

const ALLOWED_ORIGINS = (process.env.PRODOC_ALLOWED_ORIGINS || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin) return {};
  if (ALLOWED_ORIGINS.length === 0) return {};
  if (!ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

function allowedMime(m: string) {
  return m.startsWith("image/") || m === "application/pdf" || m === "text/plain";
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120);
}

type ParsedPayload = {
  page_path: string;
  section_anchor: string | null;
  body: string;
  visitor_session: string | null;
  rating: number | null;
  star_rating: number | null;
  tagged_author: string | null;
  tagged_team: string | null;
  highlights: ReturnType<typeof parseHighlights>;
  files: File[];
};

async function parseRequest(request: Request): Promise<ParsedPayload | NextResponse> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const page_path = String(form.get("page_path") || "").trim();
    const section_anchorRaw = String(form.get("section_anchor") || "").trim();
    const body = String(form.get("body") || "").trim().slice(0, 4000);
    const visitor_session = String(form.get("visitor_session") || "")
      .trim()
      .slice(0, 200);
    const ratingRaw = form.get("rating");
    const starRaw = form.get("star_rating");
    const tagged_author = String(form.get("tagged_author") || "")
      .trim()
      .slice(0, 120);
    const tagged_team = String(form.get("tagged_team") || "").trim().slice(0, 120);
    const highlightsRaw = String(form.get("highlights") || "[]");

    let highlightsParsed: unknown;
    try {
      highlightsParsed = JSON.parse(highlightsRaw) as unknown;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid highlights JSON." }, {
        status: 400,
      });
    }

    const rating =
      ratingRaw === null || ratingRaw === ""
        ? null
        : Number(ratingRaw) === 1 || Number(ratingRaw) === -1
          ? Number(ratingRaw)
          : null;

    const star_rating =
      starRaw === null || starRaw === ""
        ? null
        : (() => {
            const n = Number(starRaw);
            return n >= 1 && n <= 5 ? n : null;
          })();

    const files = form
      .getAll("files")
      .filter((v): v is File => v instanceof File && v.size > 0);

    return {
      page_path,
      section_anchor: section_anchorRaw ? section_anchorRaw.slice(0, 200) : null,
      body,
      visitor_session: visitor_session || null,
      rating,
      star_rating,
      tagged_author: tagged_author || null,
      tagged_team: tagged_team || null,
      highlights: parseHighlights(highlightsParsed),
      files,
    };
  }

  let json: Record<string, unknown>;
  try {
    json = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const page_path = typeof json.page_path === "string" ? json.page_path.trim() : "";
  const section_anchor =
    typeof json.section_anchor === "string" && json.section_anchor.trim()
      ? json.section_anchor.trim().slice(0, 200)
      : null;
  const body =
    typeof json.body === "string" ? json.body.trim().slice(0, 4000) : "";
  const visitor_session =
    typeof json.visitor_session === "string" && json.visitor_session.trim()
      ? json.visitor_session.trim().slice(0, 200)
      : null;

  const rating =
    json.rating === 1 || json.rating === -1
      ? json.rating
      : json.rating === 0
        ? 0
        : null;

  const star_rating = (() => {
    const n = Number(json.star_rating);
    return n >= 1 && n <= 5 ? n : null;
  })();

  const tagged_author =
    typeof json.tagged_author === "string"
      ? json.tagged_author.trim().slice(0, 120) || null
      : null;
  const tagged_team =
    typeof json.tagged_team === "string"
      ? json.tagged_team.trim().slice(0, 120) || null
      : null;

  const highlights = parseHighlights(json.highlights);

  return {
    page_path,
    section_anchor,
    body,
    visitor_session,
    rating,
    star_rating,
    tagged_author,
    tagged_team,
    highlights,
    files: [],
  };
}

function validatePayload(p: ParsedPayload): string | null {
  if (!p.page_path.startsWith("/") || p.page_path.includes("://")) {
    return "Invalid page path.";
  }
  const blockedPrefixes = [
    "/api",
    "/admin",
    "/portal",
    "/profeed",
    "/proinsights",
    "/_next",
  ];
  if (blockedPrefixes.some((prefix) => p.page_path === prefix || p.page_path.startsWith(`${prefix}/`))) {
    return "Feedback is not accepted for this page.";
  }
  if (p.rating === null && p.star_rating === null) {
    return "Add a helpful / not helpful vote or a 1–5 star rating.";
  }
  if (p.rating !== null && p.rating !== 1 && p.rating !== -1 && p.rating !== 0) {
    return "Invalid helpfulness rating.";
  }
  if (!highlightsJsonSizeOk(p.highlights)) {
    return "Highlights payload is too large.";
  }
  return null;
}

async function uploadAttachments(
  service: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  feedbackId: string,
  files: File[],
) {
  for (const file of files.slice(0, MAX_FILES)) {
    if (file.size > MAX_FILE_BYTES) continue;
    if (!allowedMime(file.type)) continue;
    const safe = sanitizeFilename(file.name);
    const path = `${feedbackId}/${randomUUID()}-${safe}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error } = await service.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) throw new Error(error.message);

    const kind: "screenshot" | "file" = file.type.startsWith("image/")
      ? "screenshot"
      : "file";

    const { error: rowErr } = await service.from("feedback_attachments").insert({
      feedback_id: feedbackId,
      storage_path: path,
      file_name: file.name.slice(0, 240),
      mime_type: (file.type || "application/octet-stream").slice(0, 120),
      kind,
      byte_size: file.size,
    });
    if (rowErr) throw new Error(rowErr.message);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const cors = corsHeaders(origin);

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured on the server." },
      { status: 503, headers: cors },
    );
  }

  const parsed = await parseRequest(request);
  if (parsed instanceof NextResponse) {
    Object.entries(cors).forEach(([k, v]) => parsed.headers.set(k, v));
    return parsed;
  }

  const err = validatePayload(parsed);
  if (err) return NextResponse.json({ ok: false, error: err }, { status: 400, headers: cors });

  const row = {
    page_path: parsed.page_path,
    section_anchor: parsed.section_anchor,
    body: parsed.body,
    rating: parsed.rating,
    star_rating: parsed.star_rating,
    tagged_author: parsed.tagged_author,
    tagged_team: parsed.tagged_team,
    highlights: parsed.highlights,
    visitor_session: parsed.visitor_session,
    status: "open" as const,
  };

  const service = createServiceRoleClient();

  if (service) {
    const { data, error } = await service
      .from("feedback")
      .insert(row)
      .select("id, edit_secret")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: error?.message || "Insert failed." },
        { status: 500, headers: cors },
      );
    }

    const feedbackId = data.id as string;
    const editSecret = data.edit_secret as string;

    if (parsed.files.length) {
      try {
        await uploadAttachments(service, feedbackId, parsed.files);
      } catch (e) {
        await service.from("feedback").delete().eq("id", feedbackId);
        return NextResponse.json(
          {
            ok: false,
            error: e instanceof Error ? e.message : "Attachment upload failed.",
          },
          { status: 500, headers: cors },
        );
      }
    }

    return NextResponse.json({ ok: true, id: feedbackId, editSecret }, { headers: cors });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  if (parsed.files.length) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "File uploads require SUPABASE_SERVICE_ROLE_KEY on the server. Submit without files, or configure the service role.",
      },
      { status: 400, headers: cors },
    );
  }

  const { error } = await supabase.from("feedback").insert(row);
  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message || "Insert failed." },
      { status: 500, headers: cors },
    );
  }

  return NextResponse.json({ ok: true }, { headers: cors });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const cors = corsHeaders(origin);
  return new NextResponse(null, { status: 204, headers: cors });
}
