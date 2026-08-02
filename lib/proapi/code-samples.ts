import type { ApiEndpoint, CodeLanguage } from "./types";
import { servers } from "./mock-data";

export const codeLanguages: { id: CodeLanguage; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "go", label: "Go" },
  { id: "csharp", label: "C#" },
  { id: "php", label: "PHP" },
];

export function generateCodeSample(
  endpoint: ApiEndpoint,
  language: CodeLanguage,
  apiKey: string,
  serverUrl: string = servers[0].url,
): string {
  const url = `${serverUrl}${endpoint.path.replace(/\{(\w+)\}/g, (_, name) => {
    const param = endpoint.parameters.find((p) => p.name === name);
    return param?.example ?? `{${name}}`;
  })}`;

  const body = endpoint.requestBody?.example
    ? JSON.stringify(endpoint.requestBody.example, null, 2)
    : null;

  switch (language) {
    case "curl":
      return [
        `curl -X ${endpoint.method} "${url}" \\`,
        `  -H "Authorization: Bearer ${apiKey || "$TOKEN"}" \\`,
        `  -H "Content-Type: application/json"`,
        body ? `  -d '${body.replace(/\n/g, "")}'` : "",
      ]
        .filter(Boolean)
        .join("\n");

    case "javascript":
      return `const res = await fetch("${url}", {
  method: "${endpoint.method}",
  headers: {
    Authorization: "Bearer ${apiKey || "YOUR_TOKEN"}",
    "Content-Type": "application/json",
  },${body ? `\n  body: JSON.stringify(${body}),` : ""}
});
const data = await res.json();`;

    case "typescript":
      return `const res = await fetch("${url}", {
  method: "${endpoint.method}",
  headers: {
    Authorization: \`Bearer \${process.env.PRODOC_API_KEY}\`,
    "Content-Type": "application/json",
  },${body ? `\n  body: JSON.stringify(${body} as const),` : ""}
});
const data: unknown = await res.json();`;

    case "python":
      return `import requests

res = requests.${endpoint.method.toLowerCase()}(
    "${url}",
    headers={"Authorization": f"Bearer {api_key}"},${body ? `\n    json=${body},` : ""}
)
data = res.json()`;

    case "java":
      return `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${url}"))
    .header("Authorization", "Bearer " + apiKey)
    .method("${endpoint.method}", ${body ? `BodyPublishers.ofString("${body.replace(/"/g, '\\"')}")` : "BodyPublishers.noBody()"})
    .build();`;

    case "go":
      return `req, _ := http.NewRequest("${endpoint.method}", "${url}", ${body ? "body" : "nil"})
req.Header.Set("Authorization", "Bearer "+apiKey)
resp, err := client.Do(req)`;

    case "csharp":
      return `var request = new HttpRequestMessage(HttpMethod.${endpoint.method.charAt(0) + endpoint.method.slice(1).toLowerCase()}, "${url}");
request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
var response = await client.SendAsync(request);`;

    case "php":
      return `$ch = curl_init("${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${endpoint.method}");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $apiKey"]);${body ? `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${body.replace(/'/g, "\\'")}');` : ""}
$response = curl_exec($ch);`;

    default:
      return "";
  }
}
