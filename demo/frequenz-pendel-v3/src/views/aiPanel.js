// aiPanel.js — KI-Ansicht. Vertrag V3/D002: Statuswerte exakt, Glossen nur daneben.
// Rendert defensiv, deutet nichts um, benennt nichts um.
const VOCAB = new Set([
  "established_relation", "ontological_interpretation",
  "research_hypothesis", "playful_metaphor"
]);

function entriesOf(catalog) {
  if (Array.isArray(catalog)) return catalog;
  for (const k of ["concepts", "entries", "items"])
    if (Array.isArray(catalog?.[k])) return catalog[k];
  if (catalog && typeof catalog === "object")
    return Object.entries(catalog).map(([id, v]) =>
      (v && typeof v === "object") ? { id, ...v } : { id, value: v });
  return [];
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderAiPanel(container, catalog, glosses) {
  const rows = entriesOf(catalog).map(e => {
    const scalarFields = Object.entries(e)
      .filter(([k, v]) => typeof v !== "object")
      .map(([k, v]) => {
        if (k === "status") {
          const gloss = VOCAB.has(v) && glosses[v]
            ? ` <span class="gloss">· ${esc(glosses[v])}</span>` : "";
          return `<div class="f"><b>status:</b> <code>${esc(v)}</code>${gloss}</div>`;
        }
        return `<div class="f"><b>${esc(k)}:</b> ${esc(v)}</div>`;
      }).join("");
    const formulae = Array.isArray(e.formulae)
      ? e.formulae
          .filter(f => f && typeof f.text === "string")
          .map(f => `<div class="f"><b>formula:</b> <code>${esc(f.text)}</code></div>`)
          .join("")
      : "";
    return `<div class="ai-entry">${scalarFields}${formulae}</div>`;
  }).join("");
  container.innerHTML = rows || `<p>${esc(glosses.__empty || "Katalog leer oder unbekanntes Format.")}</p>`;
}
