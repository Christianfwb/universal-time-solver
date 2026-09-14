// Playwright: UI-Verträge am Release. Vorher: node build.js.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RELEASE = pathToFileURL(path.join(HERE, "release/index.html")).href;

test("Null Netzwerk: einziger Request ist das file://-Dokument (V9)", async ({ page }) => {
  const requests = [];
  page.on("request", r => requests.push(r.url()));
  await page.goto(RELEASE);
  await page.waitForTimeout(1500);
  const external = requests.filter(u => !u.startsWith("file://"));
  expect(external).toEqual([]);
  expect(requests.length).toBe(1);
});

test("Einheitenwechsel ändert T nicht", async ({ page }) => {
  await page.goto(RELEASE);
  const t1 = await page.locator("#res1").textContent();
  await page.click("#uRad");
  const t2 = await page.locator("#res1").textContent();
  expect(t1).toBe(t2);
  await expect(page.locator("#phaseLabelUnit")).toContainText("Δφ_rad");
  await page.click("#uCycles");
  await expect(page.locator("#phaseLabelUnit")).toContainText("ΔΦ_cycles");
});

test("Pause cancelt die rAF-Schleife wirklich", async ({ page }) => {
  await page.goto(RELEASE);
  await page.click("#playBtn"); // Pause
  await page.waitForTimeout(200);
  const a = await page.evaluate(() => window.__fp_frames);
  await page.waitForTimeout(400);
  const b = await page.evaluate(() => window.__fp_frames);
  expect(b).toBe(a); // kein einziger Frame mehr
});

test("prefers-reduced-motion: startet pausiert, keine Schleife", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(RELEASE);
  await page.waitForTimeout(400);
  const frames = await page.evaluate(() => window.__fp_frames);
  expect(frames).toBe(0);
  await expect(page.locator("#playBtn")).toContainText("▶");
});

test("Perlen-Vertrag D004: 23.25 → 8 Perlen, +15, Exaktwert 23.250", async ({ page }) => {
  await page.goto(RELEASE);
  await page.click('button[data-c="23.25"]');
  expect(await page.locator("#pearls circle").count()).toBe(8);
  await expect(page.locator("#cycBadge")).toHaveText("+15");
  await expect(page.locator("#exactPhase")).toContainText("23.250 cyc");
});

test("Perlen-Grenzfälle: 8.0 / 9.0", async ({ page }) => {
  await page.goto(RELEASE);
  await page.fill("#phase", "8");
  expect(await page.locator("#pearls circle").count()).toBe(8);
  await expect(page.locator("#cycBadge")).toHaveText("");
  await page.fill("#phase", "9");
  await expect(page.locator("#cycBadge")).toHaveText("+1");
});

test("42-Hz-Egg: sichtbar und exakt als playful_metaphor markiert", async ({ page }) => {
  await page.goto(RELEASE);
  await page.fill("#freq", "42");
  await expect(page.locator("#egg")).toBeVisible();
  await expect(page.locator("#egg")).toContainText("playful_metaphor");
  await expect(page.locator("#egg")).toContainText("kein Messwert");
});

test("KI-Panel zeigt Formel, Status und Evidenzgrenze aus dem öffentlichen Katalog", async ({ page }) => {
  await page.goto(RELEASE);
  await page.click("#aiToggle");
  const panel = page.locator("#aiPanel");
  await expect(panel).toContainText("T = delta_phi_rad / (2 * pi * f)");
  await expect(panel).toContainText("established_relation");
  await expect(panel).toContainText("The phase-duration relation is established");
});
test("Pendel-Label V8 exakt, ohne Jahr", async ({ page }) => {
  await page.goto(RELEASE);
  await expect(page.locator("#pendLabel")).toHaveText(
    "Historische Visualisierungsmetapher aus dem erhaltenen Originalartefakt — keine physikalische Pendelsimulation.");
});

test("Tastatur: Pfeiltasten und Shift-Schritt am Frequenzregler", async ({ page }) => {
  await page.goto(RELEASE);
  await page.locator("#freqSlider").focus();
  await page.keyboard.press("ArrowUp");
  const v1 = parseFloat(await page.inputValue("#freqSlider"));
  expect(v1).toBeCloseTo(1.01, 5);
  await page.keyboard.press("Shift+ArrowUp");
  const v2 = parseFloat(await page.inputValue("#freqSlider"));
  expect(v2).toBeCloseTo(2.01, 5);
});

test("Ungültige Eingabe wird klar abgewiesen", async ({ page }) => {
  await page.goto(RELEASE);
  await page.fill("#freq", "-5");
  await expect(page.locator("#err")).toBeVisible();
});

test("A11y: axe-core ohne critical/serious-Verstöße", async ({ page }) => {
  await page.goto(RELEASE);
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter(v => ["critical", "serious"].includes(v.impact));
  expect(bad).toEqual([]);
});

test("Ungültige und leere Eingaben stoppen ohne die Uhr zu beschädigen", async ({ page }) => {
  await page.goto(RELEASE);
  await page.fill("#freq", "-5");
  await expect(page.locator("#freq")).toHaveAttribute("aria-invalid", "true");
  const count = await page.locator("#cycFull").textContent();
  await page.waitForTimeout(100);
  await expect(page.locator("#cycFull")).toHaveText(count);
  expect(Number(await page.locator("#cycPart").textContent())).toBeGreaterThanOrEqual(0);
  await page.fill("#freq", "");
  await expect(page.locator("#err")).toBeVisible();
  await page.fill("#freq", "1");
  await expect(page.locator("#err")).not.toBeVisible();
  await page.click("#playBtn");
  await page.waitForTimeout(100);
  expect(Number(await page.locator("#cycPart").textContent())).toBeGreaterThanOrEqual(0);
});

test("Pause: Reset und Phasenänderung aktualisieren Grafik und Zähler", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(RELEASE);
  const before = await page.locator("#hand2").getAttribute("x2");
  await page.fill("#phase", "0.25");
  expect(await page.locator("#hand2").getAttribute("x2")).not.toBe(before);
  await page.click("#playBtn");
  await page.waitForTimeout(150);
  await page.click("#playBtn");
  await page.click("#resetBtn");
  await expect(page.locator("#tRun")).toHaveText("0.00 s");
  await expect(page.locator("#cycFull")).toHaveText("0");
  await expect(page.locator("#cycPart")).toHaveText("0.00");
});
