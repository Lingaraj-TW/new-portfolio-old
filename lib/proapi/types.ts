export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiVersion = "v1" | "v2" | "v3";

export type AuthType = "apiKey" | "bearer" | "oauth2" | "jwt";

export type CodeLanguage =
  | "curl"
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "csharp"
  | "php";

export type ApiParameter = {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  type: string;
  description: string;
  example?: string;
};

export type ApiSchemaField = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type ApiResponseExample = {
  status: number;
  label: string;
  body: Record<string, unknown>;
};

export type ApiErrorCode = {
  code: string;
  status: number;
  description: string;
};

export type ApiEndpoint = {
  id: string;
  method: HttpMethod;
  path: string;
  version: ApiVersion;
  category: string;
  summary: string;
  description: string;
  deprecated?: boolean;
  parameters: ApiParameter[];
  requestBody?: {
    contentType: string;
    schema: ApiSchemaField[];
    example: Record<string, unknown>;
  };
  responses: ApiResponseExample[];
  errors: ApiErrorCode[];
  bestPractices: string[];
  rateLimit: string;
};

export type ApiCategory = {
  id: string;
  label: string;
  endpoints: ApiEndpoint[];
};

export type SdkLanguage = "javascript" | "python" | "java" | "go" | "csharp";

export type SdkDoc = {
  language: SdkLanguage;
  name: string;
  install: string;
  quickStart: string;
  methods: { name: string; description: string }[];
  example: string;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  changes: string[];
  breaking: string[];
  migration?: string;
};

export type GuideDoc = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export type SearchResult = {
  id: string;
  type: "endpoint" | "schema" | "guide" | "sdk" | "error";
  title: string;
  subtitle: string;
  href: string;
  highlight?: string;
};

export type PlaygroundRequest = {
  id: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
};

export type ParsedOpenApi = {
  title: string;
  version: string;
  categories: ApiCategory[];
};
