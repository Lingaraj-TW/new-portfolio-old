import { NextResponse } from "next/server";

import { getDocMeta, isSafeDocSlug } from "@/lib/docs/paths";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!isSafeDocSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  const meta = getDocMeta(slug);
  if (!meta) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json(meta);
}
