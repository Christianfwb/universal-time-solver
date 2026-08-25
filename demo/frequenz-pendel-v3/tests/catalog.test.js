// Verträge V3 (Einbettung), V4/V5 (Legacy-Hashes), V6 (cwd-Unabhängigkeit), read-only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // Demo-Ordner
const REPO = path.resolve(HERE, "../..");
const CATALOG = path.resolve(REPO, "concepts/frequenzgesetz.public.v1.json");
const RELEASE = path.join(HERE, "release/index.html");
const BUILD = path.join(HERE, "build.js");

const sha256 = (b) => createHash("sha256").update(b).digest("hex");

// Gebundene Werte (V4/V5) — Änderung nur per neuem schriftlichen Vertrag.
const ORIGINAL = {
  file: path.join(HERE, "legacy/frequenz-pendel-original.html"),
  bytes: 31465,
  sha: "1585035656d7fd533f7434aea28ac601d74375dc797b2e4d5f0bdbd800010c56"
};
const V2PROTO = {
  file: path.join(HERE, "legacy/frequenz-pendel-v2-chat-prototyp.html"),
  bytes: 19402,
  sha: "42dc11002d6f5ecffd32988f8749bdf306eceeae334f8cb33eaa9315c9316776"
};

function extractEmbedded(html, id) {
  const m = html.match(new RegExp(
    `<script type="application/json" id="${id}">([\\s\\S]*?)</script>`));
  assert.ok(m, `Eingebetteter Block #${id} nicht gefunden`);
  // Escaping-Rückweg exakt invers zu build.js:
  return Buffer.from(m[1].replaceAll("<\\/script", "</script"), "utf8");
}

test("statisch: build.js enthält keinen Schreibpfad auf concepts/", () => {
  const src = readFileSync(BUILD, "utf8");
  const writes = src.match(/writeFileSync\([^)]*\)/g) || [];
  for (const w of writes) assert.ok(!w.includes("concepts"), `Schreibaufruf verdächtig: ${w}`);
  assert.ok(!/writeFileSync\([^)]*CATALOG/.test(src));
});

test("Bundle-Konvention: Top-Level-Namen über alle Module eindeutig", () => {
  const files = ["src/core/phase.js","src/core/clock.js","src/state.js","src/views/wheel.js",
    "src/views/wave.js","src/views/pendulum.js","src/views/aiPanel.js","src/ui.js"];
  const seen = new Map();
  for (const f of files) {
    const src = readFileSync(path.join(HERE, f), "utf8");
    for (const m of src.matchAll(/^export\s+(?:const|function|class|let)\s+([A-Za-z_$][\w$]*)/gm)) {
      assert.ok(!seen.has(m[1]), `Name '${m[1]}' doppelt: ${seen.get(m[1])} und ${f}`);
      seen.set(m[1], f);
    }
  }
});

test("Build cwd-unabhängig, byteidentisch, Quelle unverändert (V6)", () => {
  const preSha = sha256(readFileSync(CATALOG));
  const preMtime = statSync(CATALOG).mtimeMs;

  execFileSync(process.execPath, [BUILD], { cwd: HERE });
  const outA = readFileSync(RELEASE);
  execFileSync(process.execPath, [BUILD], { cwd: REPO });
  const outB = readFileSync(RELEASE);

  assert.equal(Buffer.compare(outA, outB), 0, "Release nicht byteidentisch bei cwd-Wechsel");
  assert.equal(sha256(readFileSync(CATALOG)), preSha, "Katalog-Bytes verändert!");
  assert.equal(statSync(CATALOG).mtimeMs, preMtime, "Katalog-mtime verändert!");
});

test("Einbettung: Bytes exakt UND SHA-256 identisch (V3, doppelt unabhängig)", () => {
  const html = readFileSync(RELEASE, "utf8");
  const embedded = extractEmbedded(html, "catalog");
  const source = readFileSync(CATALOG);
  assert.equal(Buffer.compare(embedded, source), 0, "Nutzbytes weichen ab");
  assert.equal(sha256(embedded), sha256(source), "SHA-256 weicht ab");
});

test("Legacy-Original: gebundene Bytezahl + SHA-256 (V4)", (t) => {
  if (!existsSync(ORIGINAL.file)) return t.skip("noch nicht abgerufen — node fetch-legacy.js");
  const b = readFileSync(ORIGINAL.file);
  assert.equal(b.byteLength, ORIGINAL.bytes);
  assert.equal(sha256(b), ORIGINAL.sha);
});

test("Legacy-v2-Prototyp: gebundene Bytezahl + SHA-256 (V5)", (t) => {
  if (!existsSync(V2PROTO.file)) return t.skip("noch nicht kopiert");
  const b = readFileSync(V2PROTO.file);
  assert.equal(b.byteLength, V2PROTO.bytes);
  assert.equal(sha256(b), V2PROTO.sha);
});
