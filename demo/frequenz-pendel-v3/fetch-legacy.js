// fetch-legacy.js — Netzwerkphase 4. Vertrag V4: ausschließlich commit-gepinnt.
// Dreifache Verifikation VOR dem Schreiben; jede Abweichung → STOP, kein Schreiben, kein Fallback.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "legacy/frequenz-pendel-original.html");

const PINNED_URL = "https://raw.githubusercontent.com/Christianfwb/frequenzprojekt/e1aeede657ccea033804db0345fc82aa352f20bd/Pendelcode1.html";
const EXPECT = {
  bytes: 31465,
  sha256: "1585035656d7fd533f7434aea28ac601d74375dc797b2e4d5f0bdbd800010c56",
  blobSha1: "2439b74ddf0c009ce84a3334ba43124430f1d025"
};

function verify(buf) {
  const errors = [];
  if (buf.byteLength !== EXPECT.bytes)
    errors.push(`Bytezahl ${buf.byteLength} ≠ ${EXPECT.bytes}`);
  const sha = createHash("sha256").update(buf).digest("hex");
  if (sha !== EXPECT.sha256) errors.push(`SHA-256 ${sha} ≠ gebunden`);
  const blob = createHash("sha1")
    .update(`blob ${buf.byteLength}\0`).update(buf).digest("hex");
  if (blob !== EXPECT.blobSha1) errors.push(`Git-Blob-SHA-1 ${blob} ≠ gebunden`);
  return errors;
}

if (existsSync(OUT)) {
  const errs = verify(readFileSync(OUT));
  if (errs.length === 0) { console.log("Original bereits vorhanden und verifiziert — kein Abruf nötig."); process.exit(0); }
  console.error("STOP: vorhandene Datei verletzt Bindung:\n  " + errs.join("\n  ")); process.exit(1);
}

console.log("Abruf (commit-gepinnt): " + PINNED_URL);
const res = await fetch(PINNED_URL);
if (!res.ok) { console.error(`STOP: HTTP ${res.status} — kein Schreiben.`); process.exit(1); }
const buf = Buffer.from(await res.arrayBuffer());

const errs = verify(buf);
if (errs.length > 0) {
  console.error("STOP: Verifikation fehlgeschlagen — NICHTS geschrieben:\n  " + errs.join("\n  "));
  process.exit(1);
}
mkdirSync(path.join(HERE, "legacy"), { recursive: true });
writeFileSync(OUT, buf); // binär, keine Zeilenenden-/Encoding-Berührung
console.log(`OK: ${EXPECT.bytes} Bytes, SHA-256 + Blob-SHA-1 verifiziert → legacy/frequenz-pendel-original.html`);
