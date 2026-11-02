import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const outDir = "d:/board/docs/qa-screenshots";
fs.mkdirSync(outDir, { recursive: true });
const widths = [320, 375, 768, 938, 1024, 1440];
const browser = await chromium.launch({ headless: true });
const results = [];

for (const w of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: Math.max(900, Math.round(w * 0.75)) },
  });
  await page.goto("http://localhost:3000/past-papers", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(400);
  const metrics = await page.evaluate(() => {
    const d = document.documentElement;
    const h = document.querySelector("h1");
    return {
      innerWidth: window.innerWidth,
      scrollWidth: d.scrollWidth,
      clientWidth: d.clientWidth,
      overflowX: d.scrollWidth > d.clientWidth + 1,
      heading: h?.innerText ?? null,
      headingOverflow: h ? h.scrollWidth > h.clientWidth + 1 : null,
    };
  });
  const file = path.join(outDir, `fix2-past-papers-${w}.png`);
  await page.screenshot({ path: file, fullPage: false });
  results.push({ w, ...metrics, file });
  await page.close();
}

const books = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await books.goto("http://localhost:3000/books", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await books.waitForTimeout(800);
const booksInfo = await books.evaluate(() => {
  const text = document.body.innerText;
  return {
    hasOxford: /Oxford/i.test(text),
    hasSindh: /Sindh/i.test(text),
    hasCambridge: /Cambridge/i.test(text),
    hasAqa: /\bAQA\b/i.test(text),
    hasPastPaperCard: /Past Paper/i.test(text),
    resourceCountHint: (text.match(/(\d+)\s+resources/i) || [])[1] || null,
  };
});
await books.screenshot({
  path: path.join(outDir, "fix2-books-1440.png"),
  fullPage: false,
});

const books375 = await browser.newPage({ viewport: { width: 375, height: 812 } });
await books375.goto("http://localhost:3000/books", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await books375.waitForTimeout(500);
await books375.screenshot({
  path: path.join(outDir, "fix2-books-375.png"),
  fullPage: false,
});
await books375.close();
await books.close();
await browser.close();

console.log(JSON.stringify({ pastPapers: results, booksInfo }, null, 2));
