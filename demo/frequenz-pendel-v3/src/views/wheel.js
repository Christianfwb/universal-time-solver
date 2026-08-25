// wheel.js — Phasenrad. Vertrag V7: Restbogen + max. 8 Perlen + Badge +N + Exaktwert.
import { TAU, cyclesToRad } from "../core/phase.js";

const CX = 110, CY = 110, R = 86;
function polar(ang) { return [CX + R * Math.sin(ang), CY - R * Math.cos(ang)]; }

export function renderWheelStatic(els, phiCycles) {
  const whole = Math.floor(phiCycles);
  const pearls = Math.min(whole, 8);
  const badge = whole > 8 ? whole - 8 : 0;
  let dots = "";
  for (let i = 0; i < pearls; i++) {
    const a = -0.35 - i * 0.16; // Perlenkette links oben außen
    const x = CX + (R + 14) * Math.sin(a), y = CY - (R + 14) * Math.cos(a);
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="var(--accent)"/>`;
  }
  els.pearls.innerHTML = dots;
  els.badge.textContent = badge > 0 ? `+${badge}` : "";
  els.exact.textContent =
    `ΔΦ_cycles = ${phiCycles.toFixed(3)} cyc ≙ Δφ_rad = ${cyclesToRad(phiCycles).toFixed(3)} rad`;
}

export function renderWheelFrame(els, visAngle, phiCycles) {
  const a1 = visAngle;
  const a2 = visAngle - cyclesToRad(phiCycles);
  const [x1, y1] = polar(a1), [x2, y2] = polar(a2);
  els.hand1.setAttribute("x2", x1); els.hand1.setAttribute("y2", y1);
  els.hand2.setAttribute("x2", x2); els.hand2.setAttribute("y2", y2);
  const rest = phiCycles - Math.floor(phiCycles);
  if (rest > 0.001) {
    const arcRad = cyclesToRad(rest);
    const [ax, ay] = polar(a1 - arcRad), [bx, by] = polar(a1);
    const large = arcRad > Math.PI ? 1 : 0;
    els.arc.setAttribute("d", `M${CX},${CY} L${ax},${ay} A${R},${R} 0 ${large} 1 ${bx},${by} Z`);
  } else els.arc.setAttribute("d", "");
}
