// phase.js — reiner Mathe-Kern. Keine DOM-Zugriffe. Vertrag V1.
export const TAU = 2 * Math.PI;

export function validateFrequency(f) {
  if (typeof f !== "number" || !Number.isFinite(f) || f <= 0)
    return "Frequenz muss eine endliche Zahl > 0 sein.";
  if (f < 0.01 || f > 1000)
    return "Frequenz außerhalb des Vertragsbereichs [0.01, 1000] Hz.";
  return null;
}

export function validatePhaseCycles(c) {
  if (typeof c !== "number" || !Number.isFinite(c) || c < 0)
    return "Phasendifferenz muss eine endliche Zahl ≥ 0 sein.";
  if (c > 100)
    return "Phasendifferenz außerhalb des Vertragsbereichs [0, 100] Zyklen.";
  return null;
}

export function durationFromCycles(cycles, f) { return cycles / f; }
export function durationFromRadians(rad, f) { return rad / (TAU * f); }
export function radToCycles(rad) { return rad / TAU; }
export function cyclesToRad(cyc) { return cyc * TAU; }
