// Vertrag V1.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as P from "../src/core/phase.js";

test("Prüffall: 1 cyc / 1 Hz = 1 s exakt", () => {
  assert.equal(P.durationFromCycles(1, 1), 1.0);
});
test("Prüffall: π rad / 1 Hz = 0.5 s exakt", () => {
  assert.equal(P.durationFromRadians(Math.PI, 1), 0.5);
});
test("Prüffall: 1 cyc / 2 Hz = 0.5 s exakt", () => {
  assert.equal(P.durationFromCycles(1, 2), 0.5);
});
test("Einheiten-Rundlauf < 1e-12", () => {
  const c = 0.73;
  const back = P.radToCycles(P.cyclesToRad(c));
  assert.ok(Math.abs(back - c) < 1e-12);
});
test("Property: beide Formeln identisch (10000 Zufallsfälle)", () => {
  for (let i = 0; i < 10000; i++) {
    const f = 0.01 + Math.random() * 999;
    const cyc = Math.random() * 100;
    const a = P.durationFromCycles(cyc, f);
    const b = P.durationFromRadians(P.cyclesToRad(cyc), f);
    assert.ok(Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(a)),
      `Abweichung bei f=${f}, cyc=${cyc}`);
  }
});
test("Ablehnungen: 0, negativ, NaN, ±Infinity, Bereichsgrenzen", () => {
  for (const bad of [0, -1, NaN, Infinity, -Infinity, 0.001, 1001])
    assert.notEqual(P.validateFrequency(bad), null, `f=${bad} muss abgelehnt werden`);
  for (const bad of [-0.1, NaN, Infinity, 101])
    assert.notEqual(P.validatePhaseCycles(bad), null, `phi=${bad} muss abgelehnt werden`);
  assert.equal(P.validateFrequency(7.83), null);
  assert.equal(P.validatePhaseCycles(23.25), null);
});
