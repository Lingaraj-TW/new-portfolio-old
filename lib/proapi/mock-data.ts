import type {
  ApiCategory,
  ApiEndpoint,
  ChangelogEntry,
  GuideDoc,
  SdkDoc,
} from "./types";

export const portalMetrics = {
  apisPublished: 3,
  endpoints: 24,
  sdks: 5,
  avgIntegrationMinutes: 12,
};

export const apiVersions = ["v1", "v2", "v3"] as const;

export const servers = [
  { id: "production", label: "Production", url: "https://api.prodoc.dev" },
  { id: "sandbox", label: "Sandbox", url: "https://sandbox.api.prodoc.dev" },
];

const feedbackEndpoints: ApiEndpoint[] = [
  {
    id: "create-feedback",
    method: "POST",
    path: "/v1/feedback",
    version: "v1",
    category: "feedback",
    summary: "Submit documentation feedback",
    description:
      "Create a new feedback item from the ProFeed widget. Supports stars, helpful votes, anchored highlights, and attachments.",
    parameters: [
      {
        name: "X-Device-Id",
        in: "header",
        required: true,
        type: "string",
        description: "Anonymous device identifier for edit-scoped access.",
        example: "device_8f2a1c",
      },
    ],
    requestBody: {
      contentType: "application/json",
      schema: [
        { name: "page_path", type: "string", required: true, description: "Doc page path" },
        { name: "message", type: "string", required: true, description: "Feedback body" },
        { name: "stars", type: "integer", required: false, description: "1–5 rating" },
        { name: "helpful", type: "boolean", required: false, description: "Was this helpful?" },
        { name: "anchor", type: "string", required: false, description: "Section anchor id" },
      ],
      example: {
        page_path: "/guides/auth/oauth",
        message: "The redirect URI example is outdated.",
        stars: 4,
        helpful: false,
        anchor: "redirect-uri",
      },
    },
    responses: [
      {
        status: 201,
        label: "Created",
        body: { id: "fb_9k2m1", status: "open", created_at: "2026-06-07T12:00:00Z" },
      },
    ],
    errors: [
      { code: "invalid_payload", status: 400, description: "Missing required fields" },
      { code: "rate_limited", status: 429, description: "Too many submissions" },
    ],
    bestPractices: [
      "Always send page_path and anchor for in-context triage.",
      "Use idempotency keys for retry-safe submissions.",
    ],
    rateLimit: "100 requests / minute per device",
  },
  {
    id: "get-feedback",
    method: "GET",
    path: "/v1/feedback/{id}",
    version: "v1",
    category: "feedback",
    summary: "Retrieve feedback by ID",
    description: "Fetch a single feedback record. Requires admin or device-scoped credentials.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        type: "string",
        description: "Feedback identifier",
        example: "fb_9k2m1",
      },
    ],
    responses: [
      {
        status: 200,
        label: "OK",
        body: {
          id: "fb_9k2m1",
          status: "triaged",
          page_path: "/guides/auth/oauth",
          tags: ["docs", "api"],
        },
      },
    ],
    errors: [
      { code: "not_found", status: 404, description: "Feedback does not exist" },
      { code: "forbidden", status: 403, description: "Insufficient scope" },
    ],
    bestPractices: ["Poll status after PATCH for portal sync."],
    rateLimit: "300 requests / minute",
  },
  {
    id: "update-feedback",
    method: "PATCH",
    path: "/v1/feedback/{id}",
    version: "v1",
    category: "feedback",
    summary: "Update feedback status",
    description: "Triage admins update status, tags, and resolution notes.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        type: "string",
        description: "Feedback identifier",
      },
    ],
    requestBody: {
      contentType: "application/json",
      schema: [
        { name: "status", type: "string", required: false, description: "open | triaged | closed" },
        { name: "tags", type: "string[]", required: false, description: "Owner tags" },
      ],
      example: { status: "triaged", tags: ["docs", "api"] },
    },
    responses: [
      { status: 200, label: "OK", body: { id: "fb_9k2m1", status: "triaged" } },
    ],
    errors: [{ code: "forbidden", status: 403, description: "Admin role required" }],
    bestPractices: ["Use webhooks to notify external ticketing systems."],
    rateLimit: "60 requests / minute",
  },
];

const docsEndpoints: ApiEndpoint[] = [
  {
    id: "docs-meta",
    method: "GET",
    path: "/v1/docs/meta/{slug}",
    version: "v1",
    category: "docs",
    summary: "Get documentation page metadata",
    description:
      "Returns author, team, and nav metadata for a doc slug. Supports multi-segment paths like getting-started/intro.",
    parameters: [
      {
        name: "slug",
        in: "path",
        required: true,
        type: "string",
        description: "Doc slug path",
        example: "getting-started/intro",
      },
    ],
    responses: [
      {
        status: 200,
        label: "OK",
        body: {
          title: "Introduction",
          authors: ["Linga Raj M"],
          team: "ProDocs Ecosystem",
          nav_order: 1,
        },
      },
    ],
    errors: [{ code: "not_found", status: 404, description: "Slug not found" }],
    bestPractices: ["Cache metadata for 5 minutes in client apps."],
    rateLimit: "1000 requests / minute",
  },
  {
    id: "create-event",
    method: "POST",
    path: "/v1/events",
    version: "v1",
    category: "events",
    summary: "Create an analytics event",
    description: "Track documentation usage events for ProInsights dashboards.",
    parameters: [],
    requestBody: {
      contentType: "application/json",
      schema: [
        { name: "type", type: "string", required: true, description: "Event type" },
        { name: "page", type: "string", required: true, description: "Page path" },
        { name: "properties", type: "object", required: false, description: "Custom properties" },
      ],
      example: { type: "page_view", page: "/apis/overview", properties: { referrer: "search" } },
    },
    responses: [
      { status: 201, label: "Created", body: { id: "evt_7h3k", received: true } },
    ],
    errors: [{ code: "invalid_event", status: 422, description: "Unknown event type" }],
    bestPractices: ["Batch events client-side when possible."],
    rateLimit: "500 requests / minute",
  },
  {
    id: "oauth-token",
    method: "POST",
    path: "/oauth/token",
    version: "v1",
    category: "auth",
    summary: "Exchange OAuth authorization code",
    description: "OAuth 2.0 token endpoint for workspace integrations.",
    parameters: [],
    requestBody: {
      contentType: "application/x-www-form-urlencoded",
      schema: [
        { name: "grant_type", type: "string", required: true, description: "authorization_code" },
        { name: "code", type: "string", required: true, description: "Auth code" },
        { name: "redirect_uri", type: "string", required: true, description: "Callback URL" },
      ],
      example: {
        grant_type: "authorization_code",
        code: "ac_abc123",
        redirect_uri: "https://app.example.com/callback",
      },
    },
    responses: [
      {
        status: 200,
        label: "OK",
        body: {
          access_token: "eyJhbGciOiJIUzI1NiIs...",
          token_type: "Bearer",
          expires_in: 3600,
        },
      },
    ],
    errors: [{ code: "invalid_grant", status: 400, description: "Code expired or invalid" }],
    bestPractices: ["Store refresh tokens securely server-side only."],
    rateLimit: "30 requests / minute",
  },
];

export const mockCategories: ApiCategory[] = [
  { id: "feedback", label: "Feedback", endpoints: feedbackEndpoints },
  { id: "docs", label: "Documentation", endpoints: docsEndpoints.filter((e) => e.category === "docs") },
  { id: "events", label: "Analytics", endpoints: docsEndpoints.filter((e) => e.category === "events") },
  { id: "auth", label: "Authentication", endpoints: docsEndpoints.filter((e) => e.category === "auth") },
];

export const v2DeprecatedEndpoints: ApiEndpoint[] = [
  {
    ...feedbackEndpoints[0],
    id: "create-feedback-v2",
    path: "/v2/feedback",
    version: "v2",
    deprecated: true,
    summary: "[Deprecated] Submit feedback (v2)",
    description: "Deprecated — migrate to POST /v1/feedback by 2026-12-01.",
    parameters: feedbackEndpoints[0].parameters,
    requestBody: feedbackEndpoints[0].requestBody,
    responses: feedbackEndpoints[0].responses,
    errors: feedbackEndpoints[0].errors,
    bestPractices: ["Migrate to v1 before sunset."],
    rateLimit: "50 requests / minute",
  },
];

export const allEndpoints: ApiEndpoint[] = [
  ...mockCategories.flatMap((c) => c.endpoints),
  ...v2DeprecatedEndpoints,
];

export const guides: GuideDoc[] = [
  {
    id: "quickstart",
    title: "Quickstart",
    description: "Ship your first API call in under 10 minutes.",
    href: "/proapi/getting-started",
  },
  {
    id: "auth-guide",
    title: "Authentication",
    description: "API keys, Bearer tokens, OAuth 2.0, and JWT.",
    href: "/proapi/authentication",
  },
  {
    id: "webhooks",
    title: "Webhooks",
    description: "React to feedback and status changes in real time.",
    href: "/proapi/guides#webhooks",
  },
  {
    id: "errors",
    title: "Error handling",
    description: "Standard error codes and retry strategies.",
    href: "/proapi/guides#errors",
  },
];

export const sdks: SdkDoc[] = [
  {
    language: "javascript",
    name: "JavaScript SDK",
    install: "npm install @prodoc/sdk",
    quickStart: `import { ProDoc } from '@prodoc/sdk';\nconst client = new ProDoc({ apiKey: process.env.PRODOC_KEY });`,
    methods: [
      { name: "feedback.create()", description: "Submit documentation feedback" },
      { name: "docs.getMeta()", description: "Fetch page metadata" },
      { name: "events.track()", description: "Send analytics events" },
    ],
    example: `const fb = await client.feedback.create({\n  page_path: '/guides/auth',\n  message: 'Great guide!',\n  stars: 5,\n});`,
  },
  {
    language: "python",
    name: "Python SDK",
    install: "pip install prodoc-sdk",
    quickStart: `from prodoc import Client\nclient = Client(api_key=os.environ["PRODOC_KEY"])`,
    methods: [
      { name: "client.feedback.create()", description: "Submit feedback" },
      { name: "client.docs.meta()", description: "Get doc metadata" },
    ],
    example: `fb = client.feedback.create(\n    page_path="/guides/auth",\n    message="Clear examples",\n    stars=5,\n)`,
  },
  {
    language: "java",
    name: "Java SDK",
    install: 'implementation "dev.prodoc:sdk:1.2.0"',
    quickStart: `ProDocClient client = ProDocClient.builder().apiKey(key).build();`,
    methods: [
      { name: "client.feedback().create()", description: "Submit feedback" },
      { name: "client.events().track()", description: "Track events" },
    ],
    example: `Feedback fb = client.feedback().create(\n  FeedbackRequest.builder().pagePath("/guides").build()\n);`,
  },
  {
    language: "go",
    name: "Go SDK",
    install: "go get github.com/prodoc/sdk-go",
    quickStart: `client := prodoc.NewClient(prodoc.WithAPIKey(os.Getenv("PRODOC_KEY")))`,
    methods: [
      { name: "client.Feedback.Create()", description: "Submit feedback" },
      { name: "client.Docs.Meta()", description: "Get metadata" },
    ],
    example: `fb, err := client.Feedback.Create(ctx, &prodoc.FeedbackParams{\n  PagePath: "/guides",\n})`,
  },
  {
    language: "csharp",
    name: "C# SDK",
    install: "dotnet add package ProDoc.Sdk",
    quickStart: `var client = new ProDocClient(apiKey);`,
    methods: [
      { name: "client.Feedback.CreateAsync()", description: "Submit feedback" },
      { name: "client.Events.TrackAsync()", description: "Track events" },
    ],
    example: `var fb = await client.Feedback.CreateAsync(new FeedbackRequest {\n  PagePath = "/guides"\n});`,
  },
];

export const changelog: ChangelogEntry[] = [
  {
    version: "v1.4.0",
    date: "2026-06-01",
    changes: [
      "Added PATCH /v1/feedback/{id} triage fields",
      "Improved error payloads with machine-readable codes",
      "SDK 1.4 released for JavaScript and Python",
    ],
    breaking: [],
  },
  {
    version: "v1.3.0",
    date: "2026-03-15",
    changes: ["GET /v1/docs/meta/{slug} multi-segment support", "Rate limit headers on all endpoints"],
    breaking: [],
  },
  {
    version: "v2.0.0-beta",
    date: "2025-11-20",
    changes: ["OAuth 2.0 token endpoint", "Sandbox server environment"],
    breaking: ["POST /v2/feedback deprecated — use /v1/feedback"],
    migration: "Replace v2 feedback URLs with /v1/feedback. No schema changes required.",
  },
];

export const defaultOpenApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "ProDoc Platform API",
    version: "1.4.0",
    description: "Documentation platform APIs — feedback, docs metadata, analytics, and auth.",
  },
  servers: [{ url: "https://api.prodoc.dev" }],
  paths: {
    "/v1/feedback": {
      post: {
        operationId: "createFeedback",
        summary: "Submit documentation feedback",
        tags: ["Feedback"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["page_path", "message"],
                properties: {
                  page_path: { type: "string" },
                  message: { type: "string" },
                  stars: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/v1/feedback/{id}": {
      get: {
        operationId: "getFeedback",
        summary: "Retrieve feedback",
        tags: ["Feedback"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/v1/docs/meta/{slug}": {
      get: {
        operationId: "getDocsMeta",
        summary: "Get doc metadata",
        tags: ["Documentation"],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" } },
      },
    },
  },
};
