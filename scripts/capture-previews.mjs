/**
 * Captures 16:10 PNGs for the home page product cards.
 * Expects a running Next server (use `npm run capture-previews` which builds and starts it).
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

// Some environments (e.g. IDE sandboxes) set an incomplete browser cache; use the default install.
delete process.env.PLAYWRIGHT_BROWSERS_PATH;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "portfolio");

// Default 3005 so `npm run capture-previews` does not fight `next dev` on 3000.
const base = (process.env.PREVIEW_BASE_URL ?? "http://127.0.0.1:3005").replace(/\/$/, "");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const shots = [
  {
    path: "/prodoc",
    file: "prodoc.png",
    waitSelector: "#doc-root",
  },
  {
    path: "/profeed/login",
    file: "profeed.png",
    waitText: "ProFeed sign in",
  },
  {
    path: "/preview/proinsights-mock",
    file: "proinsights.png",
    waitSelector: ".recharts-responsive-container",
  },
];

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  for (const s of shots) {
    const url = `${base}${s.path}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });

    if (s.waitSelector) {
      await page.waitForSelector(s.waitSelector, { state: "visible", timeout: 20_000 });
    }
    if (s.waitText) {
      await page.getByText(s.waitText, { exact: true }).first().waitFor({ state: "visible", timeout: 20_000 });
    }

    // Let fonts / Recharts finish painting
    await sleep(s.path.includes("proinsights") ? 2000 : 800);

    const out = join(outDir, s.file);
    await page.screenshot({ path: out, type: "png" });
    console.log("Wrote", out);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
