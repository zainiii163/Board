/**
 * Full-stack browser QA at 375 / 768 / 1440.
 * Requires: frontend on :3000, backend on :4000, and `npx playwright` browsers.
 *
 *   node scripts/browser-qa.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "qa-screenshots");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];
const PATHS = [
  "/",
  "/fbise",
  "/punjab",
  "/fbise/9",
  "/punjab/9",
  "/past-papers",
  "/past-papers?board=fbise",
  "/books",
];

mkdirSync(OUT, { recursive: true });

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("BLOCKED: playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
    process.exit(2);
  }

  // Prefer an installed browser when Playwright's Chromium download is blocked (disk/network).
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.QA_BROWSER_CHANNEL || "msedge",
  });
  const report = { base: BASE, startedAt: new Date().toISOString(), results: [] };

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() });
    });

    for (const path of PATHS) {
      const url = `${BASE}${path}`;
      const entry = {
        viewport: vp.name,
        path,
        ok: false,
        title: "",
        overflowX: false,
        consoleErrors: [],
        failedRequests: [],
        screenshot: "",
      };
      try {
        const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        entry.ok = Boolean(res && res.ok());
        entry.title = await page.title();
        entry.overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
        const safe = path.replace(/[^\w]+/g, "_").replace(/^_|_$/g, "") || "home";
        const shot = join(OUT, `${vp.name}-${safe}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        entry.screenshot = shot;
      } catch (err) {
        entry.error = err instanceof Error ? err.message : String(err);
      }
      entry.consoleErrors = [...consoleErrors];
      entry.failedRequests = [...failedRequests];
      consoleErrors.length = 0;
      failedRequests.length = 0;
      report.results.push(entry);
      console.log(`${vp.name} ${path} → ${entry.ok ? "OK" : "FAIL"}${entry.overflowX ? " (overflow-x)" : ""}`);
    }
    await context.close();
  }

  await browser.close();
  report.finishedAt = new Date().toISOString();
  const reportPath = join(ROOT, "docs", "qa-browser-results.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  const failed = report.results.filter((r) => !r.ok || r.error);
  console.log(`\nWrote ${reportPath}`);
  console.log(`Passed ${report.results.length - failed.length}/${report.results.length}`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
