// render-reference.js — D011. Rendered Reference aus dem UNVERÄNDERTEN Original.
// Ehrliche Grenze: visuell reproduzierbar, PNG-Bytes plattformabhängig (siehe README).
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "legacy/frequenz-pendel-original.html");
const OUT = path.join(HERE, "legacy/rendered-reference-original.png");

if (!existsSync(SRC)) {
  console.error("STOP: Original fehlt — zuerst node fetch-legacy.js"); process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(pathToFileURL(SRC).href);
await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
await page.evaluate(() => new Promise(r =>            // Ready-Marker: zwei rAF-Ticks
  requestAnimationFrame(() => requestAnimationFrame(r))));
await page.screenshot({ path: OUT, fullPage: false });
await browser.close();
console.log("rendered-reference-original.png geschrieben (1280×900, dsf=1, reduced-motion)");
