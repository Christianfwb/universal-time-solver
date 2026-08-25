// clock.js — Simulationsuhr. Vertrag V2.
// Zyklen als Ganzzahl + Restphase in [0,1); nie sin(großes Argument).
export function createClock() {
  const st = { cycles: 0, frac: 0, seconds: 0 };

  function carry() {
    if (st.frac >= 1) {
      const whole = Math.floor(st.frac);
      st.cycles += whole;
      st.frac -= whole;
    }
  }

  return {
    // Laufzeitpfad: Float-dt (Test B: Toleranz ≤ 1e-6 cyc über 8.64e6 Schritte)
    advance(f, dt) {
      st.frac += f * dt;
      st.seconds += dt;
      carry();
    },
    // Exaktpfad: ganzzahlige Sekunden (Test A: ±0 bei ganzzahligem f·n)
    advanceExactSeconds(f, n) {
      if (!Number.isInteger(n)) throw new Error("advanceExactSeconds: n muss ganzzahlig sein");
      const total = f * n;
      const whole = Math.floor(total);
      st.cycles += whole;
      st.frac += total - whole;
      st.seconds += n;
      carry();
    },
    reset() { st.cycles = 0; st.frac = 0; st.seconds = 0; },
    get cycles() { return st.cycles; },
    get frac() { return st.frac; },
    get totalCycles() { return st.cycles + st.frac; },
    get seconds() { return st.seconds; }
  };
}

// Stroboskop-Faktor: sichtbare Rotation ≤ 1 Umdrehung/s.
export function strobeFactor(f) { return Math.max(1, Math.ceil(f)); }
