// wave.js — Wellenform mit Zeitcursor und T-Intervall. Fenster = 2 Zyklen.
import { TAU, cyclesToRad, durationFromCycles } from "../core/phase.js";

const W = 600, MID = 70, AMP = 48;

export function renderWaveStatic(els, f, phiCycles) {
  const path = (phase) => {
    let d = "";
    for (let x = 0; x <= W; x += 2) {
      const cyc = (x / W) * 2; // Fensterbreite: exakt 2 Zyklen
      const y = MID - AMP * Math.sin(TAU * cyc + phase);
      d += (x === 0 ? "M" : "L") + x + "," + y.toFixed(1);
    }
    return d;
  };
  els.w1.setAttribute("d", path(0));
  els.w2.setAttribute("d", path(-cyclesToRad(phiCycles)));
  const T = durationFromCycles(phiCycles, f);
  const x2 = Math.min(W, (phiCycles / 2) * W); // T im 2-Zyklen-Fenster
  els.m1.setAttribute("x1", 0); els.m1.setAttribute("x2", 0);
  els.m2.setAttribute("x1", x2); els.m2.setAttribute("x2", x2);
  els.tLabel.setAttribute("x", x2 / 2);
  els.tLabel.textContent = `T = ${T.toFixed(3)} s`;
}

export function renderWaveFrame(els, visCycles) {
  const x = ((visCycles % 2) / 2) * W; // synchron zu Rad: gleiche τ-Quelle
  els.cursor.setAttribute("x1", x); els.cursor.setAttribute("x2", x);
}
