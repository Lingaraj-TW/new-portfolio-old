import { NextResponse } from "next/server";

import { allEndpoints } from "@/lib/proapi/mock-data";

export async function POST(request: Request) {
  const start = Date.now();
  let payload: {
    method?: string;
    path?: string;
    serverUrl?: string;
    apiKey?: string;
    body?: unknown;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { method = "GET", path = "/v1/feedback", apiKey, body } = payload;

  if (!apiKey && method !== "GET") {
    return NextResponse.json(
      {
        status: 401,
        headers: { "content-type": "application/json" },
        body: { code: "unauthorized", message: "API key required" },
        durationMs: Date.now() - start,
      },
      { status: 200 },
    );
  }

  const endpoint = allEndpoints.find(
    (e) => e.method === method && e.path === path,
  );

  const mockBody = endpoint?.responses[0]?.body ?? {
    ok: true,
    message: "Mock response from ProAPI sandbox",
    echo: body ?? null,
  };

  const status = endpoint?.responses[0]?.status ?? (method === "POST" ? 201 : 200);

  return NextResponse.json({
    status,
    headers: {
      "content-type": "application/json",
      "x-ratelimit-remaining": "99",
      "x-request-id": `req_${Math.random().toString(36).slice(2, 10)}`,
    },
    body: mockBody,
    durationMs: Date.now() - start + Math.floor(Math.random() * 80) + 40,
  });
}
