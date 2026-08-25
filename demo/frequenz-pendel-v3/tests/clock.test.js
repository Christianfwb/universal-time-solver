// Vertrag V2: Tests A, B, C — Toleranzen vorregistriert, nicht nachträglich anpassbar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createClock, strobeFactor } from "../src/core/clock.js";

test("Test A: 24h @ 42 Hz exakt — 3628800 Zyklen ±0, Restphase exakt 0", () => {
  const c = createClock();
  c.advanceExactSeconds(42, 86400);
  assert.equal(c.cycles, 3628800);
  assert.equal(c.frac, 0);
});

test("Test B: Float-Pfad 8.64e6 Schritte à 0.01s @ 42 Hz — |Δ| ≤ 1e-6 cyc", () => {
  const c = createClock();
  for (let i = 0; i < 8640000; i++) c.advance(42, 0.01);
  const total = c.cycles + c.frac;
  assert.ok(Math.abs(total - 3628800) <= 1e-6,
    `Drift ${Math.abs(total - 3628800)} cyc überschreitet Toleranz`);
  assert.ok(c.frac >= 0 && c.frac < 1, "Restphase muss in [0,1) liegen");
});

test("Test C: Pause-Kontinuität — kein Phasensprung, Toleranz 1e-12", () => {
  const ref = createClock(), paused = createClock();
  const f = 7.83, dt = 1 / 60;
  for (let i = 0; i < 1000; i++) ref.advance(f, dt);
  for (let i = 0; i < 500; i++) paused.advance(f, dt);
  // Pause: keine advance-Aufrufe — dann Fortsetzung
  for (let i = 0; i < 500; i++) paused.advance(f, dt);
  assert.ok(Math.abs(ref.totalCycles - paused.totalCycles) < 1e-12);
});

test("Strobo-Faktor: sichtbare Rate ≤ 1 U/s für f ∈ {0.5,1,7.83,42,1000}", () => {
  for (const f of [0.5, 1, 7.83, 42, 1000]) {
    const s = strobeFactor(f);
    assert.ok(f / s <= 1, `f=${f}: sichtbare Rate ${f / s} > 1`);
    assert.ok(s >= 1 && Number.isInteger(s));
  }
});
