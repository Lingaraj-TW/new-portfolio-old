/**
 * Scans app pages, content modules, and key components for assistant context.
 * Run: npm run build:context
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "app");
const CONTENT_DIR = path.join(ROOT, "content");
const COMPONENT_DIRS = [
  path.join(ROOT, "components/home"),
  path.join(ROOT, "components/products"),
  path.join(ROOT, "components/layout"),
];
const OUTPUT = path.join(ROOT, "lib/prodocContext.ts");

const SKIP_ATTRS = new Set([
  "className",
  "class",
  "href",
  "src",
  "id",
  "type",
  "name",
  "rel",
  "target",
  "role",
  "key",
  "fill",
  "stroke",
  "strokeWidth",
  "viewBox",
  "xmlns",
  "d",
  "style",
  "data-testid",
  "aria-hidden",
  "aria-labelledby",
  "aria-controls",
]);

const SKIP_CONTENT_FILES = new Set(["types.ts", "dropdown.ts"]);

function findPageFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findPageFiles(full));
    else if (entry.isFile() && entry.name === "page.tsx") results.push(full);
  }
  return results.sort();
}

function findSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findSourceFiles(full));
    else if (/\.(tsx?|mdx)$/.test(entry.name)) results.push(full);
  }
  return results.sort();
}

function pageTitle(relativeToApp: string): string {
  if (relativeToApp === "page.tsx") return "Home";
  const segments = relativeToApp
    .replace(/\/page\.tsx$/, "")
    .split("/")
    .filter(Boolean)
    .map((seg) => seg.replace(/^\[\[\.\.\.(.+)\]\]$/, "[$1]").replace(/^\[(.+)\]$/, "[$1]"));
  return segments
    .map((seg) =>
      seg
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    )
    .join(" / ");
}

function moduleTitle(relativePath: string): string {
  return relativePath
    .replace(/\.(tsx|ts|mdx)$/, "")
    .split(/[/\\]/)
    .map((seg) =>
      seg
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    )
    .join(" / ");
}

function isImportOrRequirePath(node: ts.Node): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isImportDeclaration(current) || ts.isExportDeclaration(current)) return true;
    if (
      ts.isCallExpression(current) &&
      ts.isIdentifier(current.expression) &&
      current.expression.text === "require"
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function isClassNameValue(node: ts.Node): boolean {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isJsxAttribute(parent) && parent.name.getText() === "className") return true;
  if (
    ts.isPropertyAssignment(parent) &&
    ts.isIdentifier(parent.name) &&
    parent.name.text === "className"
  ) {
    return true;
  }
  return false;
}

function looksLikeCodeOrPath(text: string): boolean {
  if (text === "force-dynamic" || (text.startsWith("__") && text.endsWith("__"))) return true;
  if (/^\/[#\w./?-]+$/.test(text) && !text.includes(" ")) return true;
  if (/^[\w@./:-]+$/.test(text) && (text.includes("/") || text.startsWith("@"))) return true;
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return true;
  if (/^(px|py|mt|mb|ml|mr|flex|grid|text|bg|border|rounded|max-w|min-h|scroll-mt)-/.test(text)) {
    return true;
  }
  if (text.includes("-") && !text.includes(" ") && text.length > 18) return true;
  if (/^[\d.]+(rem|px|em|%|ms|s)$/.test(text)) return true;
  return false;
}

function isHumanReadable(text: string, node: ts.Node): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length < 2) return false;
  if (isImportOrRequirePath(node) || isClassNameValue(node)) return false;
  if (looksLikeCodeOrPath(trimmed)) return false;
  const parent = node.parent;
  if (ts.isJsxAttribute(parent) && SKIP_ATTRS.has(parent.name.getText())) return false;
  if (trimmed.includes(" ")) return true;
  if (/^[A-Z][a-zA-Z0-9'’/&.,!?-]*$/.test(trimmed) && trimmed.length >= 3) return true;
  if (/[.!?]/.test(trimmed)) return true;
  if (trimmed.length >= 12 && /[a-z]/i.test(trimmed)) return true;
  return false;
}

function extractStringsFromFile(filePath: string): string[] {
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const found: string[] = [];

  function add(text: string, node: ts.Node) {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (!isHumanReadable(normalized, node)) return;
    found.push(normalized);
  }

  function visit(node: ts.Node) {
    if (ts.isJsxText(node)) {
      const raw = node.getText(sourceFile).trim();
      if (raw) found.push(raw.replace(/\s+/g, " "));
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      add(node.text, node);
    }
    if (ts.isJsxExpression(node) && node.expression) {
      if (ts.isStringLiteral(node.expression) || ts.isNoSubstitutionTemplateLiteral(node.expression)) {
        add(node.expression.text, node.expression);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}

function dedupePreserveOrder(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function buildSection(
  kind: "PAGE" | "CONTENT" | "COMPONENT",
  title: string,
  filePath: string,
): string {
  const body = dedupePreserveOrder(extractStringsFromFile(filePath)).join("\n");
  return `=== ${kind}: ${title} ===\n${body || "(No extractable text)"}`;
}

function escapeTemplateLiteral(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function main() {
  const sections: string[] = [];

  const pages = findPageFiles(APP_DIR);
  for (const pagePath of pages) {
    const relative = path.relative(APP_DIR, pagePath);
    sections.push(buildSection("PAGE", pageTitle(relative), pagePath));
  }

  const contentFiles = findSourceFiles(CONTENT_DIR).filter(
    (f) => !SKIP_CONTENT_FILES.has(path.basename(f)),
  );
  for (const filePath of contentFiles) {
    const relative = path.relative(CONTENT_DIR, filePath);
    sections.push(buildSection("CONTENT", moduleTitle(relative), filePath));
  }

  for (const dir of COMPONENT_DIRS) {
    const componentFiles = findSourceFiles(dir);
    for (const filePath of componentFiles) {
      const relative = path.relative(path.join(ROOT, "components"), filePath);
      sections.push(buildSection("COMPONENT", moduleTitle(relative), filePath));
    }
  }

  const contextBody = sections.join("\n\n");

  const output = `/**
 * Auto-generated by scripts/buildContext.ts — do not edit manually.
 * Regenerate: npm run build:context (also runs before \`npm run build\`)
 */
export const PRODOC_CONTEXT = \`
${escapeTemplateLiteral(contextBody)}
\`.trim();
`;

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, output, "utf8");

  console.log(`Wrote ${OUTPUT}`);
  console.log(`Pages: ${pages.length}, Content: ${contentFiles.length}, Components: ${COMPONENT_DIRS.reduce((n, d) => n + findSourceFiles(d).length, 0)}`);
  console.log(`Context length: ${contextBody.length} characters`);
}

main();
