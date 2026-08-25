// pendulum.js — historische Visualisierungsmetapher. Vertrag V8: Label aus de.json, kein Jahr.
import { TAU, cyclesToRad } from "../core/phase.js";

export function renderPendulumFrame(els, visAngle, phiCycles) {
  const p1 = 0.35 * Math.sin(visAngle);
  const p2 = 0.35 * Math.sin(visAngle - cyclesToRad(phiCycles));
  els.p1.setAttribute("transform", `rotate(${(p1 * 180 / Math.PI).toFixed(2)} 75 25)`);
  els.p2.setAttribute("transform", `rotate(${(p2 * 180 / Math.PI).toFixed(2)} 145 25)`);
}
