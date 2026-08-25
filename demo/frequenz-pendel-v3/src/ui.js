// ui.js — Bedienung, Einheiten, ARIA, rAF-Steuerung.
// Verträge: Pause cancelt rAF; prefers-reduced-motion startet pausiert und ohne Schleife;
// Rundung nie zurück ins Modell; Slider/Feld-Grenzen vertraglich getrennt.
import { TAU, validateFrequency, validatePhaseCycles, durationFromCycles, durationFromRadians, radToCycles, cyclesToRad } from "./core/phase.js";
import { createClock, strobeFactor } from "./core/clock.js";
import { createStore } from "./state.js";
import { renderWheelStatic, renderWheelFrame } from "./views/wheel.js";
import { renderWaveStatic, renderWaveFrame } from "./views/wave.js";
import { renderPendulumFrame } from "./views/pendulum.js";
import { renderAiPanel } from "./views/aiPanel.js";

const $ = (id) => document.getElementById(id);

async function loadJsonTagOrFetch(tagId, url) {
  const tag = $(tagId);
  if (tag && tag.textContent.trim()) return JSON.parse(tag.textContent);
  const res = await fetch(url);
  return res.json();
}

export async function boot() {
  const content = await loadJsonTagOrFetch("content", "src/content/de.json");
  const catalog = await loadJsonTagOrFetch("catalog", "/concepts/frequenzgesetz.public.v1.json");

  // Texte einsetzen
  for (const [id, key] of Object.entries(content.bindings))
    if ($(id)) $(id).textContent = content.texts[key];

  const store = createStore({ f: 1, phiCycles: 1, unit: "cycles" });
  const clock = createClock();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let running = false, rafId = null, lastTs = null;
  window.__fp_frames = 0; // Testzähler (ui.spec.js)

  const els = {
    wheel: { hand1: $("hand1"), hand2: $("hand2"), arc: $("phaseArc"),
             pearls: $("pearls"), badge: $("cycBadge"), exact: $("exactPhase") },
    wave: { w1: $("wave1"), w2: $("wave2"), m1: $("tm1"), m2: $("tm2"),
            tLabel: $("tLabel"), cursor: $("waveCursor") }
  };
  const pend = { p1: $("pend1"), p2: $("pend2") };

  function fmt(x, d = 4) { return Number.isFinite(x) ? x.toFixed(d) : "—"; }

  function updateStatic() {
    const { f, phiCycles, unit } = store.get();
    const err = validateFrequency(f) || validatePhaseCycles(phiCycles);
    const errBox = $("err");
    if (err) { errBox.textContent = "⚠ " + err; errBox.style.display = "block"; return; }
    errBox.style.display = "none";

    const T = durationFromCycles(phiCycles, f);
    const rad = cyclesToRad(phiCycles);
    $("calc1").textContent = `= ${fmt(phiCycles)} / ${fmt(f, 2)} Hz`;
    $("res1").textContent = `T = ${fmt(T)} s`;
    $("calc2").textContent = `= ${fmt(rad)} / (2π·${fmt(f, 2)} Hz)`;
    $("res2").textContent = `T = ${fmt(durationFromRadians(rad, f))} s`;
    $("phaseLabelUnit").textContent = unit === "rad" ? "Δφ_rad (Radiant)" : "ΔΦ_cycles (Zyklen)";

    const s = strobeFactor(f);
    $("strobe").textContent = s > 1
      ? content.texts.strobe.replace("{s}", s) : "";
    $("strobe").hidden = s <= 1;

    renderWheelStatic(els.wheel, phiCycles);
    renderWaveStatic(els.wave, f, phiCycles);

    // 42-Hz Easter Egg (V3: playful_metaphor)
    const egg = f === 42;
    $("egg").hidden = !egg;
    $("whale").style.opacity = egg ? "0.18" : "0";

    // Slider-Anschlag-Marker
    $("fOut").hidden = !(f > parseFloat($("freqSlider").max));
    $("liveResult").textContent = `T = ${fmt(T)} s`; // aria-live, nur bei Änderung
  }

  function frame(ts) {
    window.__fp_frames++;
    if (lastTs === null) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.1);
    lastTs = ts;
    const { f, phiCycles } = store.get();
    clock.advance(f, dt);
    const s = strobeFactor(f);
    const visCycles = clock.totalCycles / s;
    const visAngle = TAU * (visCycles % 1);
    renderWheelFrame(els.wheel, visAngle, phiCycles);
    renderWaveFrame(els.wave, visCycles);
    renderPendulumFrame(pend, visAngle, phiCycles);
    $("tRun").textContent = fmt(clock.seconds, 2) + " s";
    $("cycFull").textContent = String(clock.cycles);
    $("cycPart").textContent = fmt(clock.frac, 2);
    rafId = requestAnimationFrame(frame);
  }

  function play() {
    if (running) return;
    running = true; lastTs = null;
    $("playBtn").textContent = content.texts.pause;
    rafId = requestAnimationFrame(frame);
  }
  function pause() {
    running = false;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } // Schleife WIRKLICH aus
    $("playBtn").textContent = content.texts.play;
  }

  $("playBtn").addEventListener("click", () => running ? pause() : play());
  $("resetBtn").addEventListener("click", () => { clock.reset(); updateStatic(); });

  // Regler-Paare: Modell hält volle Präzision, Anzeige rundet — nie zurück ins Modell.
  function bindPair(sliderId, numId, key, toModel, fromModel) {
    $(sliderId).addEventListener("input", () => {
      store.set({ [key]: toModel(parseFloat($(sliderId).value)) });
      $(numId).value = fromModel(store.get()[key]);
      updateStatic();
    });
    $(numId).addEventListener("input", () => {
      const v = parseFloat($(numId).value);
      if (Number.isFinite(v)) {
        store.set({ [key]: toModel(v) });
        const sl = $(sliderId);
        sl.value = Math.min(Math.max(v, parseFloat(sl.min)), parseFloat(sl.max));
      }
      updateStatic();
    });
  }
  bindPair("freqSlider", "freq", "f", v => v, v => v);
  bindPair("phaseSlider", "phase", "phiCycles",
    v => store.get().unit === "rad" ? radToCycles(v) : v,
    v => store.get().unit === "rad" ? cyclesToRad(v) : v);

  function setUnit(u) {
    if (u === store.get().unit) return;
    store.set({ unit: u });
    const phi = store.get().phiCycles; // Modell unangetastet — nur Anzeige wechselt
    $("phase").value = (u === "rad" ? cyclesToRad(phi) : phi).toFixed(4);
    const sl = $("phaseSlider");
    sl.max = u === "rad" ? (8 * TAU).toFixed(2) : "8";
    sl.value = Math.min(u === "rad" ? cyclesToRad(phi) : phi, parseFloat(sl.max));
    $("uCycles").classList.toggle("active", u === "cycles");
    $("uCycles").setAttribute("aria-pressed", String(u === "cycles"));
    $("uRad").classList.toggle("active", u === "rad");
    $("uRad").setAttribute("aria-pressed", String(u === "rad"));
    updateStatic();
  }
  $("uCycles").addEventListener("click", () => setUnit("cycles"));
  $("uRad").addEventListener("click", () => setUnit("rad"));

  // Tastatur-Feinsteuerung: Pfeil = Schritt, Shift+Pfeil = 1.0
  for (const id of ["freqSlider", "phaseSlider"]) {
    $(id).addEventListener("keydown", (e) => {
      if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowRight")) {
        e.preventDefault(); $(id).value = parseFloat($(id).value) + 1;
        $(id).dispatchEvent(new Event("input"));
      }
      if (e.shiftKey && (e.key === "ArrowDown" || e.key === "ArrowLeft")) {
        e.preventDefault(); $(id).value = parseFloat($(id).value) - 1;
        $(id).dispatchEvent(new Event("input"));
      }
    });
  }

  // Presets
  document.querySelectorAll("[data-preset]").forEach(b => {
    b.addEventListener("click", () => {
      setUnit("cycles");
      store.set({ f: parseFloat(b.dataset.f), phiCycles: parseFloat(b.dataset.c) });
      $("freq").value = b.dataset.f;
      $("freqSlider").value = Math.min(parseFloat(b.dataset.f), 100);
      $("phase").value = b.dataset.c;
      $("phaseSlider").value = Math.min(parseFloat(b.dataset.c), 8);
      clock.reset(); updateStatic();
    });
  });

  // KI-Panel
  $("aiToggle").addEventListener("click", () => {
    const p = $("aiPanel");
    p.hidden = !p.hidden;
    $("aiToggle").setAttribute("aria-expanded", String(!p.hidden));
    if (!p.hidden) renderAiPanel(p, catalog, content.statusGloss);
  });

  updateStatic();
  if (reduced) { pause(); } else { play(); }
}
boot();
