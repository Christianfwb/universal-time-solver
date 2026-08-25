# Frequenz-Pendel v3

Interaktive Demo der mathematischen Beziehung **T = ΔΦ_cycles / f ≡ Δφ_rad / (2π·f)**
und Illustration des öffentlichen Modells des Frequenzgesetzes.
Die Demo behauptet keinen experimentellen Beweis der Ontologie; die Mathematik
erlaubt beide Leserichtungen. Private Inhalte sind nicht Teil dieser Demo.

## Schnellstart (Release)

`release/index.html` im Browser öffnen. Keine Installation, keine Netzwerkzugriffe,
keine Tracker, null Laufzeitabhängigkeiten.

## Provenienz (gebunden)

| Datei | Quelle | Bytes | SHA-256 |
|---|---|---|---|
| legacy/frequenz-pendel-original.html | Christianfwb/frequenzprojekt @ Commit e1aeede657ccea033804db0345fc82aa352f20bd, Pfad Pendelcode1.html, Commitdatum 2026-03-13T07:07:29Z, Git-Blob-SHA-1 2439b74ddf0c009ce84a3334ba43124430f1d025. Abruf ausschließlich commit-gepinnt via fetch-legacy.js | 31465 | 1585035656d7fd533f7434aea28ac601d74375dc797b2e4d5f0bdbd800010c56 |
| legacy/frequenz-pendel-v2-chat-prototyp.html | Rekonstruierte Konversationsübergabe (Chat-Zwischenstand Aug 2026). **Kein historisches Original.** | 19402 | 42dc11002d6f5ecffd32988f8749bdf306eceeae334f8cb33eaa9315c9316776 |
| legacy/rendered-reference-original.png | Erzeugt aus dem unveränderten Original via render-reference.js (Chromium aus package-lock.json, 1280×900, deviceScaleFactor 1, reduced-motion, Animationen aus, 2-rAF-Ready-Marker). **"Rendered Reference", kein historischer Screenshot.** Visuell reproduzierbar; PNG-Bytes plattformabhängig (Font-Rasterung, Antialiasing, Chromium-Version) — daher bewusst NICHT hash-gebunden | — | nicht gebunden (siehe links) |

Der autoritative KI-Katalog liegt außerhalb dieses Ordners:
`../../concepts/frequenzgesetz.public.v1.json`. Er wird ausschließlich gelesen.
`build.js` bettet ihn byte-identisch ins Release ein; `tests/catalog.test.js`
verifiziert Bytes UND SHA-256 der Einbettung sowie die Unverändertheit der Quelle.

## Netzwerkphasen (genau vier, getrennt offengelegt)

1. `npm install --package-lock-only` — erzeugt die Sperrdatei (npm-Registry)
2. `npm ci` — installiert exakt die Sperrdatei (npm-Registry)
3. `npx playwright install chromium` — Browser-Binary, ~150 MB (Playwright-CDN)
4. `node fetch-legacy.js` — commit-gepinnter Originalabruf (raw.githubusercontent.com)

Das Release selbst führt **null** Netzwerkzugriffe aus (Playwright-verifiziert).

## Befehlsfolge

