import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import {
  highlightsJsonSizeOk,
  parseHighlights,
} from "@/lib/feedback/highlights";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parseMessageBody } from "@/lib/profeed/parseBodyField";
import {
  sanitizeStringArray,
  teamAllowedSet,
  writerAllowedSet,
} from "@/lib/profeed/constants";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "feedback-uploads";
const MAX_FILES = 12;

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

function maxBytesForMime(m: string) {
  if (m.startsWith("video/")) return 100 * 1024 * 1024;
  if (m.startsWith("audio/")) return 50 * 1024 * 1024;
  if (m.startsWith("image/")) return 20 * 1024 * 1024;
  return 15 * 1024 * 1024;
}

function allowedMime(m: string) {
  if (!m || m === "application/octet-stream") return true;
  if (m.startsWith("image/")) return true;
  if (m.startsWith("video/") || m.startsWith("audio/")) return true;
  if (m === "application/pdf" || m === "text/plain") return true;
  if (
    m.includes("word") ||
    m.includes("officedocument") ||
    m.includes("msword")
  )
    return true;
  if (
    m === "application/zip" ||
    m.includes("sheet") ||
    m.includes("presentation")
  )
    return true;
  return false;
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
  tagged_authors: string[];
  tagged_teams: string[];
  /** Legacy: first of each for DB columns */
  tagged_author: string | null;
  tagged_team: string | null;
  voice_transcript: string | null;
  highlights: ReturnType<typeof parseHighlights>;
  files: File[];
};

function parseStringArrayField(raw: unknown, max: number): string[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      if (!Array.isArray(p)) return [];
      return p
        .filter((x) => typeof x === "string")
        .map((s) => s.slice(0, 200))
        .slice(0, max);
    } catch {
      return [];
    }
  }
  return [];
}

async function parseMultipartRequest(
  form: FormData,
): Promise<ParsedPayload | NextResponse> {
  const page_path = String(form.get("page_path") || "").trim();
  const section_anchorRaw = String(form.get("section_anchor") || "").trim();
  const bodyFormat = String(form.get("body_format") || "html").toLowerCase();
  const bodyRaw = String(form.get("body") || "");
  const visitor_session = String(form.get("visitor_session") || "")
    .trim()
    .slice(0, 200);
  const ratingRaw = form.get("rating");
  const starRaw = form.get("star_rating");
  const highlightsRaw = String(form.get("highlights") || "[]");

  const voice = String(form.get("voice_transcript") || "")
    .trim()
    .slice(0, 8_000);

  const allowWriters = writerAllowedSet();
  const allowTeams = teamAllowedSet();
  const tagsA = sanitizeStringArray(
    parseStringArrayField(form.get("tagged_authors"), 32),
    allowWriters,
    32,
  );
  const tagsT = sanitizeStringArray(
    parseStringArrayField(form.get("tagged_teams"), 32),
    allowTeams,
    32,
  );

  let highlightsParsed: unknown;
  try {
    highlightsParsed = JSON.parse(highlightsRaw) as unknown;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid highlights JSON." },
      { status: 400 },
    );
  }

  const nRating = Number(ratingRaw);
  const rating =
    ratingRaw === null || ratingRaw === ""
      ? null
      : nRating === 0 || nRating === 1 || nRating === -1
        ? nRating
        : null;

  const star_rating =
    starRaw === null || starRaw === ""
      ? null
      : (() => {
          const n = Number(starRaw);
          return n >= 1 && n <= 5 ? n : null;
        })();

  const { body, error: bodyErr } = parseMessageBody(bodyRaw, bodyFormat);
  if (bodyErr) {
    return NextResponse.json({ ok: false, error: bodyErr }, { status: 400 });
  }

  const files = form
    .getAll("files")
    .filter((v): v is File => v instanceof File && v.size > 0);

  return {
    page_path,
    section_anchor: section_anchorRaw
      ? section_anchorRaw.slice(0, 200)
      : null,
    body,
    visitor_session: visitor_session || null,
    rating,
    star_rating,
    tagged_authors: tagsA,
    tagged_teams: tagsT,
    tagged_author: tagsA[0] ?? null,
    tagged_team: tagsT[0] ?? null,
    voice_transcript: voice || null,
    highlights: parseHighlights(highlightsParsed),
    files,
  };
}

function parseJsonRequest(
  json: Record<string, unknown>,
): ParsedPayload | NextResponse {
  const page_path =
    typeof json.page_path === "string" ? json.page_path.trim() : "";
  const section_anchor =
    typeof json.section_anchor === "string" && json.section_anchor.trim()
      ? json.section_anchor.trim().slice(0, 200)
      : null;
  const bodyFormat =
    typeof json.body_format === "string"
      ? json.body_format.toLowerCase()
      : "html";
  const bodyRaw = typeof json.body === "string" ? json.body : "";
  const { body, error: bodyJsonErr } = parseMessageBody(bodyRaw, bodyFormat);
  if (bodyJsonErr) {
    return NextResponse.json(
      { ok: false, error: bodyJsonErr },
      { status: 400 },
    );
  }
  const visitor_session =
    typeof json.visitor_session === "string" && json.visitor_session.trim()
      ? json.visitor_session.trim().slice(0, 200)
      : null;

  const nRatingJ = Number(json.rating);
  const rating =
    json.rating === 1 || json.rating === -1
      ? (json.rating as number)
      : json.rating === 0 || nRatingJ === 0
        ? 0
        : null;

  const star_rating = (() => {
    const n = Number(json.star_rating);
    return n >= 1 && n <= 5 ? n : null;
  })();

  const allowWritersJ = writerAllowedSet();
  const allowTeamsJ = teamAllowedSet();
  const jAuthors = Array.isArray(json.tagged_authors)
    ? json.tagged_authors
    : [];
  const jTeams = Array.isArray(json.tagged_teams) ? json.tagged_teams : [];
  const tagsA = sanitizeStringArray(
    jAuthors.filter((x) => typeof x === "string") as string[],
    allowWritersJ,
    32,
  );
  const tagsT = sanitizeStringArray(
    jTeams.filter((x) => typeof x === "string") as string[],
    allowTeamsJ,
    32,
  );

  const voice_transcript =
    typeof json.voice_transcript === "string"
      ? json.voice_transcript.trim().slice(0, 8_000) || null
      : null;

  const highlights = parseHighlights(json.highlights);

  return {
    page_path,
    section_anchor,
    body,
    visitor_session,
    rating,
    star_rating,
    tagged_authors: tagsA,
    tagged_teams: tagsT,
    tagged_author: tagsA[0] ?? null,
    tagged_team: tagsT[0] ?? null,
    voice_transcript,
    highlights,
    files: [],
  };
}

async function parseRequest(
  request: Request,
): Promise<ParsedPayload | NextResponse> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return parseMultipartRequest(form);
  }

  let json: Record<string, unknown>;
  try {
    json = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  return parseJsonRequest(json);
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
  if (
    blockedPrefixes.some(
      (prefix) =>
        p.page_path === prefix || p.page_path.startsWith(`${prefix}/`),
    )
  ) {
    return "Feedback is not accepted for this page.";
  }
  if (p.star_rating === null) {
    return "Page quality: choose a 1–5 star rating.";
  }
  if (p.rating === null) {
    return "Helpfulness: choose Helpful, Not helpful, or Neutral.";
  }
  if (p.rating !== 0 && p.rating !== 1 && p.rating !== -1) {
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
    if (!allowedMime(file.type)) continue;
    const cap = maxBytesForMime(file.type);
    if (file.size > cap) continue;
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

    const { error: rowErr } = await service
      .from("feedback_attachments")
      .insert({
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

type FeedbackRowInsert = {
  page_path: string;
  section_anchor: string | null;
  body: string;
  rating: number | null;
  star_rating: number | null;
  tagged_author: string | null;
  tagged_team: string | null;
  tagged_authors: string[];
  tagged_teams: string[];
  voice_transcript: string | null;
  highlights: ReturnType<typeof parseHighlights>;
  visitor_session: string | null;
  status: "open";
  submitted_by: string | null;
};

function buildRow(
  p: ParsedPayload,
  submittedBy: string | null,
): FeedbackRowInsert {
  return {
    page_path: p.page_path,
    section_anchor: p.section_anchor,
    body: p.body,
    rating: p.rating,
    star_rating: p.star_rating,
    tagged_author: p.tagged_author,
    tagged_team: p.tagged_team,
    tagged_authors: p.tagged_authors,
    tagged_teams: p.tagged_teams,
    voice_transcript: p.voice_transcript,
    highlights: p.highlights,
    visitor_session: p.visitor_session,
    status: "open" as const,
    submitted_by: submittedBy,
  };
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
  if (err) {
    return NextResponse.json(
      { ok: false, error: err },
      { status: 400, headers: cors },
    );
  }

  let submittedBy: string | null = null;
  try {
    const supa = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supa.auth.getUser();
    submittedBy = user?.id ?? null;
  } catch {
    submittedBy = null;
  }

  const row = buildRow(parsed, submittedBy);

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

    return NextResponse.json(
      { ok: true, id: feedbackId, editSecret },
      { headers: cors },
    );
  }

  /*
   * Using anon key client — RLS applies here. Insert may fail silently
   * if RLS blocks anonymous writes.
   */
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

  const { error } = await supabase.from("feedback").insert({
    page_path: row.page_path,
    section_anchor: row.section_anchor,
    body: row.body,
    rating: row.rating,
    star_rating: row.star_rating,
    tagged_author: row.tagged_author,
    tagged_team: row.tagged_team,
    tagged_authors: row.tagged_authors,
    tagged_teams: row.tagged_teams,
    voice_transcript: row.voice_transcript,
    highlights: row.highlights,
    visitor_session: row.visitor_session,
    status: row.status,
    submitted_by: row.submitted_by,
  });
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
