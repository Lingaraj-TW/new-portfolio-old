import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "js-yaml";

import type { ApiCategory, ApiEndpoint, HttpMethod, ParsedOpenApi } from "./types";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function resolveSchemaType(schema: Record<string, unknown> | undefined): string {
  if (!schema) return "object";
  if (typeof schema.type === "string") return schema.type;
  if (schema.$ref) return String(schema.$ref).split("/").pop() ?? "object";
  return "object";
}

function parseParameters(
  params: Record<string, unknown>[] | undefined,
): ApiEndpoint["parameters"] {
  if (!params) return [];
  return params.map((p) => ({
    name: String(p.name ?? ""),
    in: (p.in as ApiEndpoint["parameters"][0]["in"]) ?? "query",
    required: Boolean(p.required),
    type: resolveSchemaType(p.schema as Record<string, unknown>),
    description: String(p.description ?? ""),
    example: p.example != null ? String(p.example) : undefined,
  }));
}

function operationToEndpoint(
  method: HttpMethod,
  path: string,
  op: Record<string, unknown>,
): ApiEndpoint {
  const operationId = String(op.operationId ?? `${method}-${path}`);
  const tag = Array.isArray(op.tags) && op.tags[0] ? String(op.tags[0]) : "General";

  const requestBody = op.requestBody as Record<string, unknown> | undefined;
  let bodySection: ApiEndpoint["requestBody"] | undefined;

  if (requestBody?.content) {
    const content = requestBody.content as Record<string, Record<string, unknown>>;
    const json = content["application/json"];
    const schema = json?.schema as Record<string, unknown> | undefined;
    const props = (schema?.properties ?? {}) as Record<string, Record<string, unknown>>;
    const required = (schema?.required ?? []) as string[];

    bodySection = {
      contentType: "application/json",
      schema: Object.entries(props).map(([name, def]) => ({
        name,
        type: resolveSchemaType(def),
        required: required.includes(name),
        description: String(def.description ?? ""),
      })),
      example: (json?.example as Record<string, unknown>) ?? {},
    };
  }

  const responses = op.responses as Record<string, Record<string, unknown>> | undefined;
  const responseExamples: ApiEndpoint["responses"] = responses
    ? Object.entries(responses).slice(0, 2).map(([status, res]) => ({
        status: Number(status),
        label: String(res.description ?? status),
        body: { message: String(res.description ?? "Success") },
      }))
    : [{ status: 200, label: "OK", body: {} }];

  return {
    id: operationId,
    method,
    path,
    version: path.includes("/v2/") ? "v2" : path.includes("/v3/") ? "v3" : "v1",
    category: tag.toLowerCase().replace(/\s+/g, "-"),
    summary: String(op.summary ?? operationId),
    description: String(op.description ?? op.summary ?? ""),
    deprecated: Boolean(op.deprecated),
    parameters: parseParameters(op.parameters as Record<string, unknown>[] | undefined),
    requestBody: bodySection,
    responses: responseExamples,
    errors: [{ code: "error", status: 400, description: "See OpenAPI responses" }],
    bestPractices: ["Refer to imported OpenAPI spec for full details."],
    rateLimit: "Per server policy",
  };
}

export async function parseOpenApiDocument(
  raw: string,
  format: "json" | "yaml" | "auto" = "auto",
): Promise<ParsedOpenApi> {
  let doc: unknown;

  if (format === "yaml" || (format === "auto" && !raw.trim().startsWith("{"))) {
    doc = yaml.load(raw);
  } else {
    doc = JSON.parse(raw) as unknown;
  }

  try {
    await SwaggerParser.validate(doc as Parameters<typeof SwaggerParser.validate>[0]);
  } catch {
    /* proceed with best-effort parse */
  }

  const api = doc as Record<string, unknown>;
  const info = (api.info ?? {}) as Record<string, unknown>;
  const paths = (api.paths ?? {}) as Record<string, Record<string, unknown>>;

  const endpoints: ApiEndpoint[] = [];

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const upper = method.toUpperCase() as HttpMethod;
      if (!HTTP_METHODS.includes(upper)) continue;
      endpoints.push(operationToEndpoint(upper, path, operation as Record<string, unknown>));
    }
  }

  const byCategory = new Map<string, ApiEndpoint[]>();
  for (const ep of endpoints) {
    const list = byCategory.get(ep.category) ?? [];
    list.push(ep);
    byCategory.set(ep.category, list);
  }

  const categories: ApiCategory[] = Array.from(byCategory.entries()).map(([id, eps]) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
    endpoints: eps,
  }));

  return {
    title: String(info.title ?? "Imported API"),
    version: String(info.version ?? "1.0.0"),
    categories,
  };
}

export async function parseOpenApiFromUrl(url: string): Promise<ParsedOpenApi> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch OpenAPI: ${res.status}`);
  const text = await res.text();
  const format = url.endsWith(".yaml") || url.endsWith(".yml") ? "yaml" : "auto";
  return parseOpenApiDocument(text, format);
}
