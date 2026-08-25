// build.js — erzeugt release/index.html. Verträge V3, V6, V9.
// Liest den Katalog NUR (kein Schreibaufruf zeigt auf concepts/ — statisch prüfbar).
// Pfadanker: import.meta.url, nie process.cwd().
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_SRC = path.resolve(HERE, "../../concepts/frequenzgesetz.public.v1.json");

const MODULE_ORDER = [
  "src/core/phase.js", "src/core/clock.js", "src/state.js",
  "src/views/wheel.js", "src/views/wave.js", "src/views/pendulum.js",
  "src/views/aiPanel.js", "src/ui.js"
];

// ESM→classic: entfernt import-Zeilen, streicht export-Schlüsselwörter.
// Konvention: eindeutige Top-Level-Namen über alle Module (im Test abgesichert).
function stripEsm(code) {
  return code
    .split("\n")
    .filter(l => !/^\s*import\s/.test(l))
    .join("\n")
    .replace(/^export\s+async\s+function/gm, "async function")
    .replace(/^export\s+(const|function|class|let)/gm, "$1")
    .replace(/^export\s*\{[^}]*\};?\s*$/gm, "");
}

// JSON sicher in <script type="application/json"> einbetten:
// ausschließlich "</script" → "<\/script" (gültiges JSON-String-Escape; nur in Strings möglich).
function escapeJsonForScriptTag(jsonText) {
  return jsonText.replaceAll("</script", "<\\/script");
}

const catalogBytes = readFileSync(CATALOG_SRC);           // NUR lesen
const catalogSha = createHash("sha256").update(catalogBytes).digest("hex");
const contentText = readFileSync(path.join(HERE, "src/content/de.json"), "utf8");
const html = readFileSync(path.join(HERE, "index.html"), "utf8");

const bundled = MODULE_ORDER
  .map(p => `// ── ${p} ──\n` + stripEsm(readFileSync(path.join(HERE, p), "utf8")))
  .join("\n");

let out = html
  .replace('<script type="application/json" id="catalog"></script>',
    `<!-- catalog sha256:${catalogSha} -->\n` +
    `<script type="application/json" id="catalog">${escapeJsonForScriptTag(catalogBytes.toString("utf8"))}</script>`)
  .replace('<script type="application/json" id="content"></script>',
    `<script type="application/json" id="content">${escapeJsonForScriptTag(contentText)}</script>`)
  .replace('<script type="module" src="src/ui.js"></script>',
    `<script>\n"use strict";\n${bundled}</script>`);

mkdirSync(path.join(HERE, "release"), { recursive: true });
writeFileSync(path.join(HERE, "release/index.html"), out);
console.log(`release/index.html geschrieben (Katalog sha256:${catalogSha})`);
